declare module '*.gql' {
  import { DocumentNode } from 'graphql'

  const gql: DocumentNode
  export = gql
}

declare module '*.woff2' {
  const woff: string
  export default woff
}

declare module 'imagetracerjs'

declare module '*.json' {
  const json: any
  export default json
}

declare module '*.png'

declare const ENVIRONMENT: {
  name: string
  debug: boolean
  googleClientID: string
  authHeader: string
  backendUrl: string
  supportMail: string
}

declare const REVISION: string

declare const BUILD_DATE: string

declare const TAG: string

declare interface Window {
  dateLocale: string
}
