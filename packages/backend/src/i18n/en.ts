import { Translations } from '.'

export const EnglishTranslations: Translations = {
  errors: {
    startDateInFuture: 'start date has to be in the past.',
    startDateOutOfPeriod: 'start date has to be within 5 years.',
    endDateInPast: 'end date has to be in the future.',
    endDateBeforeStartDate: 'end date has to be after start date.',
    endDateOutOfPeriod: 'end date has to be within 5 years.',
    periodTooLong: "period can't be longer than 5 years.",
    missingTokens: "couldn't trade tokens.",
    missingUser: "clouldn't find user",
    missingReport: "clouldn't find report",
    missingDay: "clouldn't find day",
    missingEntry: "couldn't find entry",
    wrongReportStatus: 'wrong report status',
    wrongDayStatus: 'wrong Day status',
    userAlreadyExists: 'User with this Email already exists',
    userNotClaimed: 'You need to claim this user first',
    userAlreadyClaimed: 'The user is already claimed',
    dayTimeLimit: 'Day exceeds time limit',
    missingStartDate: 'Period is missing',
    missingCommentable: 'Commentable not found',
    wrongUserType: 'You have the wrong user type',
    reportIncomplete: 'Report is incomplete',
    missingPeriod: 'Missing period',
  },
  email: {
    hello: 'Hello',
    comment: 'There is a comment on this week.',
    comment_plural: 'There are {{ COUNT }} comments to this week.',
    subject: {
      error: 'Error while generating reports.',
      reportExport: 'Your Lara export',
      acceptReport: 'Your report got accepted',
      needChanges: 'Your report got handed back',
      deleteYourTrainee: 'Your Trainee will be deleted soon',
      deleteAccount: 'Your account will be deleted',
      deleteUser: 'A User will be deleted soon',
      reportInReview: 'A new report was handed in',
      alexa: 'Your Account have been linked',
      paperBriefing:'Your Paper Briefing',
      paperBriefingMail:'Your Paper Briefing'
    },
    headline: {
      export: 'Your Lara export!',
      accepted: 'Report accepted!',
      needChanges: 'Changes necessary!',
      deleteTrainee: 'Your trainee will be delted soon',
      deleteAccount: 'Your account will be deleted',
      deleteUser: 'A User will be deleted soon',
      handOver: 'A new report was handed in',
      alexa: 'Lara has been linked with Amazon Alexa!',
      paperBriefing:'Paper Briefing'
    },
    message: {
      error: 'Something went wring. Please conteact your Lara admin.',
      success: 'Your lara report is attached to this mail. Good luck with it.',
      accepted: '{{ trainer }} received your report and approved it',
      needChanges: '{{ trainer }} received your report and handed it back. There are comments to your report.',
      deleteTrainee:
        'Your trainee {{ trainee }} will be deleted in 3 month. If this is wrong you should contact your Lara-Admin to solve this problem.',
      deleteAccount:
        'Your account will be deleted in 3 month. If this is wrong you should contact your Lara-Admin to solve this problem.',
      deleteUser:
        'User {{ user }} will be deleted in 3 month. If this is wrong you should contact your Lara-Admin to solve this problem.',
      handOver: 'your Trainee {{ trainee }} handed in week {{ week }} report for review.',
      alexa:
        "Your Lara Account has been linked to your Amazon Alexa Account. If you didn't initiate the Account Linking please open you Lara Settings and remove the Amazon Account. You should also change you Password for Lara.",
      paperBriefing: 'attached you will find the briefing PDF for Anna\'s training station. We hope you have a lot of fun with it.'
    },
    link: {
      archive: 'Archive',
      paperBriefing: 'Paper',
      report: 'Report',
      lara: 'Lara',
      settings: 'Settings',
    },
  },
  print: {
    name: 'Name',
    department: 'Department',
    apprenticeCourse: 'Apprenticeship Course',
    apprenticeYear: 'Year',
    period: 'Period',
    description: 'Description',
    duration: 'Duration',
    holiday: 'Holiday',
    sick: 'Sick',
    vacation: 'Vacation',
    total: 'Total',
    totalWeek: 'Total of the week',
    date: 'DATE',
    signatureTrainee: 'SIGNATURE TRAINEE',
    signatureTrainer: 'SIGNATURE TRAINER',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    hello: 'Hello',
    client: 'Client',
    mentor: 'Mentor',
    trainer: 'Trainer',
    trainee: 'Trainee',
    briefing: 'Briefing'
  },
}
