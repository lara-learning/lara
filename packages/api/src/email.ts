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

export type PaperBriefingMailPayload = BaseEmailPayload & {
  emailType: 'paperBriefing'
  userData: BaseMailUserData
  attachments: [
    {
      filename: string
    }
  ]
}

export type SimpleMailPayload = BaseEmailPayload & {
  emailType: 'deleteAccount' | 'error' | 'alexa' | 'paperBriefingMail'
  userData: BaseMailUserData
}

export type EmailPayload =
  | TrainerMailPayload
  | TraineeMailPayload
  | UserMailPayload
  | SimpleMailPayload
  | ExportMailPayload
  | ReportInReviewPayload
  | PaperBriefingMailPayload

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
    paperBriefing: string
    paperBriefingMail: string
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
    paperBriefing: string
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
    paperBriefing: string
  }
  link: {
    archive: string
    report: string
    paperBriefing: string
    lara: string
    settings: string
  }
}
