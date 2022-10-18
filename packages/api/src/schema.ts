import fs from 'fs'
import path from 'path'

export const gqlSchema = fs.readFileSync(path.resolve(__dirname, '../schema.gql')).toString()
