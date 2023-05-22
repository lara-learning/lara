import Translation from './translation'

const englishTranslation: Translation = {
  today: 'Today',
  week: 'week',
  open: 'Open',
  total: 'Total',
  archive: 'Archive',
  course: 'Training Course',
  period: 'Period',
  periodTo: 'to',
  company: 'Company',
  companyPick: 'Please choose your company:',
  continue: 'Continue',
  save: 'Save',
  cancel: 'Cancel',
  edit: 'edit',
  done: 'done',
  markDelete: 'mark for deletion',
  unmarkDelete: 'remove deletion mark',
  deleteAt: 'Löschen nach',
  deactivate: 'deactivate',
  traineeShipYear: 'Year of Traineeship',
  claimed: 'Claimed',
  back: 'back',
  on: 'on',
  off: 'off',
  modal: {
    defaultClose: 'Close',
  },
  dashboard: {
    weekend: 'Enjoy your weekend!',
    success: 'You did it!',
    noReport: {
      headline: 'Yeah, looks great!',
      description: "You don't have any reports to do right now, time to work.",
    },
    declinedReportMessageTitle: 'got report back',
    declinedReportMessage: 'You got back your report about {0}{1}. Changes are requested.',
    reportToArciveAddedSuccessTitle: 'New report in your archive',
    reportToArciveAddedSuccess: 'Your report about {0}{1} was approved by {name} and is now stored in your archive.',
  },
  paper: {
    empty: {
      headline: 'Briefing/Kick-Off Meeting',
      description:
        "Your apprentice is coming to a new station, and it iss time for the kick-off meeting? Here you can fill out and prepare the briefing for the station. This way, you can set a framework for the scope and topics of your apprentice's training station.",
      createBriefing: 'Create briefing',
    },
    createBriefing: {
      title: 'Briefing',
      firstnameMentor: "Mentor's First Name",
      lastnameMentor: "Mentor's Last Name",
      emailMentor: "Mentor's Email",
      trainee: 'Trainee',
      department: 'Department',
      customer: 'Customer',
      projectPeriod: 'Station Period',
      schoolPeriod: 'School Period',
    },
    briefingQuestions: {
      objectOfTheWork: {
        question: 'Object of the Work',
        hint: 'Please specify the general activity/task that is the subject of the project station.',
      },
      procedure: {
        question: 'Procedure',
        hint: 'Please specify the framework conditions under which the project station should be set up for the apprentice.',
      },
      learningContent: {
        question: 'Learning Content Station',
        hint: 'Please specify the general content that the apprentice should be taught during the project period.',
      },
      frameworkPlan: {
        question: 'Framework Plan Learning Content',
        hint: 'Add additional points from the framework plan here (if desired) that you consider particularly important to mention in the briefing.',
      },
      tasksAndDutiesTrainee: {
        question: 'Tasks and Duties of the Trainee',
        hint: 'Please specify (if desired) the tasks and duties that your apprentice has to fulfill.',
      },
      tasksAndDutiesMentor: {
        question: 'Tasks and Duties of the Mentor',
        hint: 'Please specify (if desired) the tasks and duties that the mentor has to fulfill.',
      },
      primeBlueAntMyTe: {
        question: 'Prime / BlueAnt',
        hint: 'Briefly summarize the positions where the apprentice can/should book hours/efforts.',
      },
      feedback: {
        question: 'Feedback',
        hint: 'Here is a brief summary of what is understood by feedback in the briefing. You can supplement the template text as needed.',
      },
      otherRemarks: {
        question: 'Other Remarks',
        hint: 'If you have any additional points to be included in the briefing, you can note them here.',
      },
    },
    modal: {
      title: 'Are you sure you want to finish the briefing?',
      description:
        'Once you click "Create briefing," you won\'t be able to edit the briefing anymore. The briefing will be sent as a PDF to your apprentice and the training officer via email.\n\nYou can choose to save the briefing instead, so you can edit it later.',
      createBriefing: 'Create briefing',
      backToPaperTitle: 'Briefing is being exported',
      backToPaperDescription:
        'The Lara Paper briefing is being exported and will be sent as an email to all participants. You may need to reload Lara later to see the newly created paper.\n' +
        'Please be patient while the briefing is being exported.',
      backToPaperButton: 'Back to Paper Overview',
      deletePaperTitle: 'Delete Paper for {0}',
      deletePaperDescription:
        'Are you sure you want to delete the paper for customer {1}? This action cannot be undone.',
      deletePaperButtonAgree: 'Confirm',
      deletePaperButtonDisagree: 'Cancel',
    },
    dashboard: {
      title: 'Station',
      description: "It's time for the feedback meeting for your apprentice's station. You can start it here.",
      briefing: 'Briefing',
      feedback: 'Station Feedback',
      conclusion: 'Conclusion',
      pdfFeedback: 'PDF Station Feedback',
      trainee: 'Trainee',
      trainer: 'Trainer',
      editPaper: 'Edit Paper',
    },
    createPaper: {
      title: 'Briefing Created',
      text: 'The briefing has been created',
    },
    deletePaper: {
      title: 'Paper Deleted',
      text: 'The Lara Paper has been deleted',
    },
    briefing: {
      toastTitle: 'Creating Lara Paper briefing',
      toastDescription: 'The briefing is being created now and will be sent to the participants as a PDF via email',
    },
  },

  archivePage: {
    header: 'Archive',
    tableHead: {
      calendarWeek: 'CW',
      date: 'DATE',
      department: 'DEPARTMENT',
    },
    searchPlaceholder: 'Search',
    selectAllLabel: 'Select all',
    emptyState: {
      noResult: {
        title: "Sadly, I didn't find anything.",
        caption:
          'Please check your search entry and try again. {0} With {1} you can search for a specific calendar week or with {2} for a time period.',
      },
      initial: {
        title: "There's nothing here yet.",
        caption: 'Your reports appear here as soon as they have been accepted and are then ready for export.',
      },
    },
    exportTitle: 'export started',
    export: 'Shortly you will receive an email with your exported reports.',
  },
  report: {
    title: 'Report for',
    remarks: 'Additional Remarks',
    remarksPlaceholder: 'Add additional remarks here...',
    reportSaveSuccess: 'Report saved!',
    textPlaceholder: 'Description',
    export: 'Export PDF',
    handover: 'Hand over this report',
    handoverTitle: 'Hand over report',
    handoverNotificationText: 'Your report was handed over and is now being checked.',
    accept: 'Approve this report',
    decline: 'Hand back to trainee',
    archived: 'Archived',
    department: {
      title: 'Department',
      departmentAddedTitle: 'added department',
      departmentAddedText: 'Your department was added and saved successfully.',
      departmentMissingTitle: 'Add department',
      departmentMissingText: 'You have to add a department to hand over your report.',
    },
    unarchive: 'Unarchive report',
    total: 'Hours per week',
    headingContainer: {
      title: 'Calendar week',
      back: 'previous',
      forward: 'next',
    },
    modalTitle: {
      handover: 'Hand over report {0} {1}?',
      accept: 'Approve report {0} {1}?',
      decline: 'Hand back report {0} {1} to trainee?',
      unarchive: 'Unarchive report {0} {1}?',
    },
    modalCopy: {
      handover:
        'After handing your report over, you will not be able to make changes while it is under review by your trainer. If accepted you will have to option to export as PDF.',
      accept:
        'After approving the report, your signature will be applied and the trainee is going to be able to export the report.',
      decline:
        'After handing back the report, the trainee has the option to make changes to the report and hand it over to you again.',
      unarchive:
        'After unarchiving, you will not be able to export the report, unless it is approved by your trainer again.',
    },
    comments: {
      addComment: 'Add comment',
      addCommentToEntry: 'Add comment to entry',
    },
    underReview: 'under review',
  },
  dropdown: {
    help: 'Help',
    logout: 'Logout',
  },
  dayStatus: {
    work: 'Work',
    education: 'Education',
    vacation: 'Vacation',
    sick: 'Sick',
    holiday: 'Holiday',
  },
  weekOverview: {
    week: 'CW',
    finishedDays: 'days finished',
    commented: 'commented',
  },
  entryStatus: {
    saveSuccess: 'Entry has been created',
    changeSuccess: 'Entry has been changed',
    deleteSuccess: 'Entry has been deleted',
    saveError: 'Error while saving entry',
    changeError: 'Error while changing entry',
    deleteError: 'Error while deleting entry',
    dayLimitError: 'The entry time exceeds the day limit',
  },
  settings: {
    firstname: 'Firstname',
    lastname: 'Lastname',
    email: 'E-Mail',
    startOfToolusage: 'Start of lara usage',
    associatedTrainer: 'Associated Trainer',
    associatedTrainees: 'Associated Trainees',
    notAssociated: 'not associated yet',
    application: 'Usage',
    apprenticeship: 'Apprenticeship',
    user: 'User',
    trainership: 'Trainer Settings',
    contact: 'Contact Person',
    trainer: 'Trainer',
    noTrainer: 'You have not been claimed yet',
    saveSuccess: 'Your settings are now up to date.',
    saveSuccessTitle: 'updated settings',
    saveError: "Your settings could'nt be saved!",
    language: {
      title: 'Language',
      english: 'English',
      german: 'German',
    },
    theme: {
      title: 'Theme',
      system: 'System Preference',
      light: 'Light',
      dark: 'Dark',
    },
    other: 'other',
    notification: 'Get mail notifications',
    signature: {
      title: 'signature',
      deleteSignature: 'Delete signature',
      addSignature: 'Add signature',
      placeholder: {
        heading: 'Add your signature',
        description: 'To sign your finished documentations just add your signature.',
      },
      addSuccessTitle: 'added signature',
      addSuccess: 'Your signature can now be used to automatically sign your reports.',
      deleteSuccessTitle: 'deleted signature',
      deleteSuccess: 'Your signature can no longer be used to sign documents automatically.',
      modal: {
        title: 'Scan your signature',
        label:
          'Write your signature on a white piece of paper with a black pen and make sure the paper ist evenly illuminated so that the contrast between paper and signature is clearly visible.',
        record: 'Record',
        newtry: 'new try',
        error: 'Your browser is apparently not allowed to use your webcam. Please grant access.',
      },
    },
    alexa: {
      headline: 'Your Alexa device',
      linkTitle: 'Add your Alexa device',
      unlinkTitle: 'Remove your Alexa device',
      linkInstructions: 'Login with your amazon email to use Lara on your Alexa device.',
      linkButton: 'Login with Amazon',
      unlinkInstructions: 'Remove your alexa device from your Lara account',
      unlinkButton: 'Remove Alexa',
      linkSuccess: 'Your Amazon account has been successfully linked with your Lara account',
      linkError: 'Somethinkg went wrong while linking you Amazon account. Please try again later',
      unlinkSuccess: 'Your Amazon account has been successfully removed',
      unlinkError: 'Somethinkg went wrong while unlinking you Amazon account. Please try again later',
      loading: 'Your account is being linked. Please wait...',
    },
  },
  onboarding: {
    intro: 'Nice to meet you. Please tell us a bit about your traineeship.',
    hello: 'Hello',
  },
  missing: {
    missingReport: 'The report you are looking for is currently under review or does not exist.',
    missingPage: 'The page you are looking for does not exist.',
    back: 'Return to Dashboard',
  },
  errors: {
    error: 'error',
    authenticationError: 'Your user could not be found',
    authenticationSubtext: `If you are a trainee, please contact ${ENVIRONMENT.supportMail}.`,
    networkError: 'A network error occurred',
    default: 'An unknown error occurred',
    subtext: `Please try again in some minutes. If this problem remains, please inform ${ENVIRONMENT.supportMail}`,
  },
  support: {
    contactTitle: 'Contact',
    contactCopy: 'Report problems or ask questions about your account.',
    faqTitle: 'Questions',
    faqCopy: 'Find useful tips or frequently asked questions about Lara here.',
    questions: {
      signature: {
        question: 'What can I do to make my scanned signature easier to recognize?',
        answer:
          'The best thing to do is to write on a white piece of paper with a thicker pen that is as high-contrast as possible (e.g. blue / black).',
      },
      name: {
        question: 'What does Lara stand for?',
        answer:
          'Lara got its name from the Swedish word lära [˅læːra], which stands for learning or the “existence” of an apprentice.',
      },
      features: {
        question: 'What can the report-tool do?',
        answer:
          'With Lara you can write your report books, which are part of the dual vocational training, and hand them over digitally to your trainer. Then they can be checked by him / her and returned to you in the event of change requests or moved directly to your archive and saved.',
      },
      timetable: {
        question: 'Can I upload my schedule?',
        answer: 'You cannot upload your timetable yet, but the feature is already planned!',
      },
      schoolReport: {
        question: 'Can I upload my certificates?',
        answer: 'You cannot upload your certificates yet, but this feature is planned for Lara in the future!',
      },
      handoverMistake: {
        question: 'I sent my report book by mistake. What can I do?',
        answer:
          'Get in touch with your trainer. They can return the report portfolio that has already been sent to you and you can make changes again.',
      },
      bug: {
        question: 'Who do I contact if I find bugs, have problems or any other suggestions?',
        answer: 'Send us an email to {0} if you have any problems. We will get in touch with you!',
      },
      exportTime: {
        question: 'How long does a bulk export take?',
        answer:
          'In principle, an export does not take long. Nevertheless, plan enough time if you want to export several report books at once.',
      },
      autoSave: {
        question: 'Will my entries be saved automatically?',
        answer:
          'As soon as you have entered an activity (and confirm it with Enter) your entry is automatically saved and you can simply exit the page without having to save manually.',
      },
      aboutUs: {
        question: 'Who is behind Lara?',
        answer:
          'Trainees and dual students from Accenture Song are working on Lara. We manage, design and develop Lara continuously.',
      },
      darkmode: {
        question: 'Does Lara also exist in dark mode?',
        answer: 'Of course! You can choose between a light and dark appearance under {0}.',
        link: 'Setting > Application',
      },
      exportEmail: {
        question: 'How will the report books be delivered to me in the case of a bulk export?',
        answer:
          'Bulk exports are delivered like single exports. However, if a certain number of entries is reached, you will be sent two emails.',
      },
    },
  },
  navigation: {
    reports: 'Reports',
    trainees: 'Trainees',
    trainer: 'Trainer',
    mentor: 'mentor',
    paper: 'Paper',
    dashhboard: 'Dashboard',
    archive: 'Archive',
    settings: 'Settings',
  },
  trainerReportOverview: {
    todo: '{count} report is still in progress',
    todos: '{count} reports are still in progress',
    upToDate: 'Everything is up to date',
    reportHandoverSuccessTitle: 'received report',
    reportHandoverSuccess: '{name} has handed over a report.',
    reportCommentSuccessTitle: 'added comment',
    reportCommentSuccess: 'Your comment was added to the report.',
    reportDeclinedSuccessTitle: 'handed report back',
    reportDeclinedSuccess: 'You handed the report back and asked for changes.',
    reportToArchiveSuccessTitle: 'moved report to archive',
    reportToArchiveSuccess: 'You approved the report and it’s now stored in the archive.',
  },
  numerals: {
    first: 'First',
    second: 'Second',
    third: 'Third',
    fourth: 'Fourth',
  },
  traineePlaceholders: {
    trainerPlaceholder: 'Trainee is not claimed yet',
    companyPlaceholder: 'Company is not set yet',
    yearPlaceholder: 'Start date is not set yet',
    coursePlaceholder: 'Training Course is not set yet',
  },
  noUserPage: {
    title: 'About Lara',
    description: 'Lara enables trainees to write reports intuitively with ease.',
    featureReports: {
      title: 'Write Reports',
      description:
        'Always keep an overview and easily write your weekly reports with supportive features such as automated time calculation and dynamic export.',
    },
    featureHandover: {
      title: 'Easy Handover',
      description:
        'Reduce the hassle of feedback processes with a simple digital submission to your trainer. Approved documents are signed automatically and can be printed at the end of your traineeship.',
    },
    featureReviews: {
      title: 'Create Reviews',
      description:
        'Summarize your experiences after each apprenticeship station with a rich text editor that supports media content, syntax highlighting and formulas.',
    },
  },
  trainerReportsPage: {
    emptyState: {
      title: 'There are currently no trainees assigned to you',
      caption: 'You can claim trainees by selecting them in the trainees page.',
    },
  },
  validation: {
    maxLength: 'This field has a maxium length of {0} characters',
    minLength: 'This field has a minimum length of {0} characters',
    required: 'This field is required',
    dateBefore: 'This Date has to be before the end date',
    dateAfter: 'This Date has to be after the start date',
    startDateOutOfPeriod: 'Startdate has to be in the next 5 years',
    endDateOutOfPeriod: 'Enddate has to be in the next 5 years',
  },
  createTrainee: {
    title: 'New Trainee',
    description:
      'Please enter the informations of the new Trainee here so she/he can login. You can still change the data later.',
    success: 'The trainee {0} has been created',
  },
  createTrainer: {
    title: 'New Trainer',
    description:
      'Please enter the informations of the new Trainer here so she/he can login. You can still change the data later.',
    success: 'The trainer {0} has been created',
  },
  createMentor: {
    title: 'New Mentor',
    description:
      'Please enter the informations of the new Trainer here so she/he can login. You can still change the data later.',
    success: 'The trainer {0} has been created',
  },
  deleteTrainer: {
    title: 'Delete {0}?',
    description:
      'If you delete the user, the account will be deactivated for 24 hours. After that you will receive an email with the possibility to delete the account. ',
    success: 'Du erhältst in Kürze eine E-mail mit der Option den Nutzer zu Löschen.',
  },

  deleteMentor: {
    title: 'Delete {0}?',
    description:
      'If you delete the user, the account will be deactivated for 24 hours. After that you will receive an email with the possibility to delete the account. ',
    success: 'Du erhältst in Kürze eine E-mail mit der Option den Nutzer zu Löschen.',
  },
  userDelete: {
    title: 'User deactivated',
    description: 'Shortly you will receive an email with the option to delete the user. ',
  },
  admin: {
    marking: 'Marked for deletion',
  },
}

export default englishTranslation
