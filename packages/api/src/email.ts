export type BaseMailUserData = {
  receiverEmail: string
  receiverName: string
  buttonLink: string
}

export type BaseEmailPayload = {
  translations: EmailTranslations
}

export type TrainerMailPayload = BaseEmailPayload & {
  emailType: 'acceptReport' | 'needChanges'
  userData: BaseMailUserData & {
    trainer: string
  }
}

export type TraineeMailPayload = BaseEmailPayload & {
  emailType: 'deleteYourTrainee'
  userData: BaseMailUserData & {
    trainee: string
  }
}

export type ReportInReviewPayload = BaseEmailPayload & {
  emailType: 'reportInReview'
  userData: BaseMailUserData & {
    trainee: string
    week: string
  }
}

export type UserMailPayload = BaseEmailPayload & {
  emailType: 'deleteUser' | 'reportInReview'
  userData: BaseMailUserData & {
    user: string
  }
}

export type ExportMailPayload = BaseEmailPayload & {
  emailType: 'reportExport'
  userData: BaseMailUserData
  attachments: [
    {
      filename: string
    }
  ]
}

export type SimpleMailPayload = BaseEmailPayload & {
  emailType: 'deleteAccount' | 'error' | 'alexa'
  userData: BaseMailUserData
}

export type EmailPayload =
  | TrainerMailPayload
  | TraineeMailPayload
  | UserMailPayload
  | SimpleMailPayload
  | ExportMailPayload
  | ReportInReviewPayload

export type EmailType = EmailPayload['emailType']

export type EmailTranslations = {
  hello: string
  comment: string
  comment_plural: string
  subject: {
    error: string
    reportExport: string
    acceptReport: string
    needChanges: string
    deleteYourTrainee: string
    deleteAccount: string
    deleteUser: string
    reportInReview: string
    alexa: string
  }
  headline: {
    export: string
    accepted: string
    needChanges: string
    deleteTrainee: string
    deleteAccount: string
    deleteUser: string
    handOver: string
    alexa: string
  }
  message: {
    error: string
    success: string
    accepted: string
    needChanges: string
    deleteTrainee: string
    deleteAccount: string
    deleteUser: string
    handOver: string
    alexa: string
  }
  link: {
    archive: string
    report: string
    lara: string
    settings: string
  }
}
