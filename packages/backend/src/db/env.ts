// This file loads all important Environment Variables

const {
  USER_TABLE,
  COMPANY_TABLE,
  REPORT_TABLE,
  PAPER_TABLE,
  REPORT_WEEK_TRAINEEID_INDEX,
  REPORT_TRAINEEID_STATUS_INDEX,
  PAPER_TRAINEE_ID_INDEX,
  PAPER_TRAINER_ID_INDEX,
  PAPER_MENTOR_ID_INDEX,
  USER_TYPE_INDEX,
  USER_EMAIL_INDEX,
  USER_TRAINER_ID_INDEX,
  USER_OAUTH_CODE_INDEX,
} = process.env

if (!REPORT_TABLE) {
  throw new Error('Missing Env Variable: "REPORT_TABLE"')
}

if (!USER_TABLE) {
  throw new Error('Missing Env Variable: "USER_TABLE"')
}

if (!COMPANY_TABLE) {
  throw new Error('Missing Env Variable: "COMPANY_TABLE"')
}

if (!PAPER_TABLE) {
  throw new Error('Missing Env Variable: "PAPER_TABLE"')
}

if (!PAPER_TRAINEE_ID_INDEX) {
  throw new Error('Missing Env Variable: "PAPER_TRAINEE_ID_INDEX"')
}

if (!PAPER_TRAINER_ID_INDEX) {
  throw new Error('Missing Env Variable: "PAPER_TRAINER_ID_INDEX"')
}

if (!PAPER_MENTOR_ID_INDEX) {
  throw new Error('Missing Env Variable: "PAPER_MENTOR_ID_INDEX"')
}

if (!REPORT_WEEK_TRAINEEID_INDEX) {
  throw new Error('Missing Env Variable: "REPORT_WEEK_TRAINEEID_INDEX"')
}

if (!REPORT_TRAINEEID_STATUS_INDEX) {
  throw new Error('Missing Env Variable: "REPORT_TRAINEEID_STATUS_INDEX"')
}

if (!USER_TYPE_INDEX) {
  throw new Error('Missing Env Variable: "USER_TYPE_INDEX"')
}

if (!USER_EMAIL_INDEX) {
  throw new Error('Missing Env Variable: "USER_EMAIL_INDEX"')
}

if (!USER_TRAINER_ID_INDEX) {
  throw new Error('Missing Env Variable: "USER_TRAINER_ID_INDEX"')
}

if (!USER_OAUTH_CODE_INDEX) {
  throw new Error('Missing Env Variable: "USER_OAUTH_CODE_INDEX"')
}

// The ddb Tablenames
export const userTableName = USER_TABLE
export const companyTabelName = COMPANY_TABLE
export const reportTableName = REPORT_TABLE
export const paperTableName = PAPER_TABLE

// GSI's for the report table
export const reportWeekTraineeIdIndex = REPORT_WEEK_TRAINEEID_INDEX
export const reportTraineeIdStatusIndex = REPORT_TRAINEEID_STATUS_INDEX

// GSI's for the paper table
export const paperTraineeIdIndex = PAPER_TRAINEE_ID_INDEX
export const paperTrainerIdIndex = PAPER_TRAINER_ID_INDEX
export const paperMentorIdIndex = PAPER_MENTOR_ID_INDEX

// GSI'S for the user table
export const userTypeIndex = USER_TYPE_INDEX
export const userEmailIndex = USER_EMAIL_INDEX
export const userTrainerIdIndex = USER_TRAINER_ID_INDEX
export const userOAuthCodeIndex = USER_OAUTH_CODE_INDEX
