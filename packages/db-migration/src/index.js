require('dotenv').config()

const mysql = require('promise-mysql')
const camelCase = require('camelcase')
const AWS = require('aws-sdk')
const fs = require('fs')

const { DB_HOST, DB_PASSWORD, DYNAMODB_USER_TABLE, DYNAMODB_REPORT_TABLE, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, OLD_COMPANY_NAME, NEW_COMPANY_NAME, COMPANY_ABBREVIATION } =
  process.env

if (!DB_HOST) {
  throw new Error('Missing DB_HOST')
}

if (!DB_PASSWORD) {
  throw new Error('Missing DB_PASSWORD')
}

if (!DYNAMODB_USER_TABLE) {
  throw new Error('Missing DYNAMODB_USER_TABLE')
}

if (!DYNAMODB_REPORT_TABLE) {
  throw new Error('Missing DYNAMODB_REPORT_TABLE')
}

if (!AWS_ACCESS_KEY_ID) {
  throw new Error('Missing AWS_ACCESS_KEY_ID')
}

if (!AWS_SECRET_ACCESS_KEY) {
  throw new Error('Missing AWS_SECRET_ACCESS_KEY')
}

const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'eu-central-1',
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
})

let connection

const roughSizeOfObject = (object) => {
  var objectList = []
  var stack = [object]
  var bytes = 0

  while (stack.length) {
    var value = stack.pop()

    if (typeof value === 'boolean') {
      bytes += 4
    } else if (typeof value === 'string') {
      bytes += value.length * 2
    } else if (typeof value === 'number') {
      bytes += 8
    } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
      objectList.push(value)

      for (var i in value) {
        stack.push(value[i])
      }
    }
  }
  return bytes
}

const chunkArray = (array, chunkSize) => {
  let result = []

  for (let i = 0; i < array.length; i += chunkSize) {
    result = [...result, array.slice(i, i + chunkSize)]
  }

  return result
}

const saveItems = async (users, reports) => {
  const userItems = users.map((user) => ({
    PutRequest: {
      Item: user,
    },
  }))

  const chunkedUserItems = chunkArray(userItems, 25)

  await Promise.all(
    chunkedUserItems.map((chunk) => {
      console.log('Saving DynamoDB Chunk:', chunk.length)

      return documentClient
        .batchWrite({
          RequestItems: {
            [DYNAMODB_USER_TABLE]: chunk,
          },
        })
        .promise()
    })
  )

  const reportItems = reports.map((report) => ({
    PutRequest: {
      Item: report,
    },
  }))

  const chunkedReportItems = chunkArray(reportItems, 25)

  await Promise.all(
    chunkedReportItems.map((chunk) => {
      console.log('Saving DynamoDB Chunk:', chunk.length)

      return documentClient
        .batchWrite({
          RequestItems: {
            [DYNAMODB_REPORT_TABLE]: chunk,
          },
        })
        .promise()
    })
  )
}

const queryComments = async (commentableId, commentableType) => {
  const sqlResults = await connection.query(
    `SELECT * FROM comments WHERE commentable_id=${commentableId} AND commentable_type="${commentableType}"`
  )
  console.log(`Migrating comments (${commentableType}) for: ${commentableId}`)

  if (!sqlResults) {
    return []
  }

  return sqlResults.map((result) => ({
    id: String(result.id),
    text: result.text,
    createdAt: new Date(result.created_at).toISOString(),
    userId: String(result.user_id),
  }))
}

const queryReports = async () => {
  const sqlReports = await connection.query(`SELECT * FROM reports`)

  return Promise.all(
    sqlReports.map(async (report) => {
      console.log(`starting report from ${report.trainee_id}: ${report.id}`)

      const result = {
        id: String(report.id),
        year: report.year,
        week: report.week,
        summary: report.summary ?? '',
        status: report.status ?? 'todo',
        createdAt: new Date(report.created_at).toISOString(),
        department: report.department ?? '',
        days: await queryDays(report.id),
        comments: await queryComments(report.id, 'Report'),
        traineeId: String(report.trainee_id),
      }

      console.log(`finished report from ${report.trainee_id}: ${report.id}`)

      return result
    })
  )
}

const queryDays = async (reportId) => {
  const sqlResults = await connection.query(`SELECT * FROM days WHERE report_id=${reportId}`)
  console.log(`Migrating days for: ${reportId}`)

  return Promise.all(
    sqlResults.map(async (result) => ({
      id: String(result.id),
      date: new Date(result.date).toISOString(),
      status: result.status ?? '',
      createdAt: new Date(result.created_at).toISOString(),
      entries: await queryEntries(result.id),
      comments: await queryComments(result.id, 'Day'),
    }))
  )
}

const queryEntries = async (dayId) => {
  const sqlResults = await connection.query(`SELECT * FROM entries WHERE day_id=${dayId}`)
  console.log(`Migrating entries for: ${dayId}`)

  return Promise.all(
    sqlResults.map(async (result, index) => ({
      id: String(result.id),
      text: result.text,
      time: result.time,
      createdAt: new Date(result.created_at).toISOString(),
      orderId: result.order_id ?? index,
      comments: await queryComments(result.id, 'Entry'),
    }))
  )
}

const run = async () => {
  connection = await mysql.createConnection({
    host: DB_HOST,
    user: 'root',
    password: DB_PASSWORD,
    database: 'lara',
    port: 3306,
  })

  const sqlUsers = await connection.query('SELECT * FROM users')

  const users = await Promise.all(
    sqlUsers.map(async (sqlUser) => {
      console.log(`migrating User: ${sqlUser.username}`)

      return {
        id: String(sqlUser.id),
        companyId: sqlUser.company_id ? camelCase(sqlUser.company_id) : `${COMPANY_ABBREVIATION}Germany`,
        course: sqlUser.course ?? '',
        createdAt: new Date(sqlUser.created_at).toISOString(),
        email: sqlUser.email.replace(`${OLD_COMPANY_NAME}.com`, `${NEW_COMPANY_NAME}.com`),
        startDate: sqlUser.start_date ? new Date(sqlUser.start_date).toISOString() : undefined,
        endDate: sqlUser.end_date ? new Date(sqlUser.end_date).toISOString() : undefined,
        firstName: sqlUser.first_name,
        lastName: sqlUser.last_name,
        language: sqlUser.language ?? '',
        theme: sqlUser.theme ?? '',
        type: sqlUser.type,
        username: sqlUser.username,
        trainerId: sqlUser.trainer_id ? String(sqlUser.trainer_id) : '',
        notification: Boolean(sqlUser.notification),
        signature: sqlUser.signature ? sqlUser.signature.toString() : '',
      }
    })
  )

  const reports = await queryReports()

  const usersCount = await connection.query('SELECT COUNT(*) FROM users')
  const reportsCount = await connection.query('SELECT COUNT(*) FROM reports')
  const daysCount = await connection.query('SELECT COUNT(*) FROM days')
  const entriesCount = await connection.query('SELECT COUNT(*) FROM entries')
  const commentsCount = await connection.query('SELECT COUNT(*) FROM comments')

  console.log('Total users:', usersCount[0]['COUNT(*)'])
  console.log('Total reports:', reportsCount[0]['COUNT(*)'])
  console.log('Total days:', daysCount[0]['COUNT(*)'])
  console.log('Total entries:', entriesCount[0]['COUNT(*)'])
  console.log('Total comments:', commentsCount[0]['COUNT(*)'])

  await connection.end()

  users.forEach((user) => {
    console.log(`Item size for user ${user.username}: ${roughSizeOfObject(user)}`)
  })

  fs.writeFileSync('users.json', JSON.stringify(users))
  fs.writeFileSync('reports.json', JSON.stringify(reports))

  await saveItems(users, reports)

  console.log('Saved items to DynamoDB')
}

run()
