export default interface Translation {
  today: string
  week: string
  open: string
  total: string
  archive: string
  course: string
  period: string
  periodTo: string
  company: string
  companyPick: string
  continue: string
  save: string
  cancel: string
  edit: string
  done: string
  markDelete: string
  unmarkDelete: string
  deactivate: string
  traineeShipYear: string
  claimed: string
  back: string
  on: string
  off: string
  login: {
    userNotRegisteredError: {
      title: string
      description: string
    }
  }
  modal: {
    defaultClose: string
  }
  dashboard: {
    weekend: string
    success: string
    noReport: {
      headline: string
      description: string
    }
    declinedReportMessageTitle: string
    declinedReportMessage: string
    reportToArciveAddedSuccessTitle: string
    reportToArciveAddedSuccess: string
  }
  archivePage: {
    header: string
    tableHead: {
      calendarWeek: string
      date: string
      department: string
    }
    searchPlaceholder: string
    selectAllLabel: string
    emptyState: {
      noResult: {
        title: string
        caption: string
      }
      initial: {
        title: string
        caption: string
      }
    }
    exportTitle: string
    export: string
    back: string
  }
  report: {
    title: string
    remarks: string
    remarksPlaceholder: string
    textPlaceholder: string
    export: string
    handover: string
    handoverTitle: string
    handoverNotificationText: string
    accept: string
    decline: string
    archived: string
    unarchive: string
    department: {
      title: string
      departmentAddedTitle: string
      departmentAddedText: string
      departmentMissingTitle: string
      departmentMissingText: string
    }
    reportSaveSuccess: string
    total: string
    headingContainer: {
      title: string
      back: string
      forward: string
    }
    modalTitle: {
      handover: string
      accept: string
      decline: string
      unarchive: string
    }
    modalCopy: {
      handover: string
      accept: string
      decline: string
      unarchive: string
    }
    comments: {
      addComment: string
      addCommentToEntry: string
    }
    underReview: string
  }
  dropdown: {
    help: string
    logout: string
  }
  dayStatus: {
    work: string
    education: string
    vacation: string
    sick: string
    holiday: string
  }
  weekOverview: {
    week: string
    finishedDays: string
    commented: string
  }
  entryStatus: {
    saveSuccess: string
    changeSuccess: string
    deleteSuccess: string
    saveError: string
    changeError: string
    deleteError: string
    dayLimitError: string
  }
  settings: {
    firstname: string
    lastname: string
    email: string
    startOfToolusage: string
    associatedTrainer: string
    associatedTrainees: string
    notAssociated: string
    application: string
    apprenticeship: string
    user: string
    trainership: string
    contact: string
    trainer: string
    noTrainer: string
    saveSuccess: string
    saveError: string
    saveSuccessTitle: string
    language: {
      title: string
      english: string
      german: string
    }
    theme: {
      title: string
      system: string
      light: string
      dark: string
    }
    other: string
    notification: string
    avatar: {
      label: string
      title: string
      description: string
      addAvatar: string
      removeAvatar: string
      updateAvatar: string
      toasts: {
        success: {
          title: string
          description: string
        }
        errorCompression: {
          title: string
          description: string
        }
        errorFileSize: {
          title: string
          description: string
        }
      }
    }
    signature: {
      title: string
      addSignature: string
      deleteSignature: string
      placeholder: {
        heading: string
        description: string
      }
      addSuccessTitle: string
      addSuccess: string
      deleteSuccessTitle: string
      deleteSuccess: string
      modal: {
        title: string
        label: string
        record: string
        newtry: string
        error: string
      }
    }
    alexa: {
      headline: string
      linkTitle: string
      unlinkTitle: string
      linkInstructions: string
      linkButton: string
      unlinkInstructions: string
      unlinkButton: string
      linkSuccess: string
      linkError: string
      unlinkSuccess: string
      unlinkError: string
      loading: string
    }
  }
  trainerReportsPage: {
    emptyState: {
      caption: string
      title: string
    }
  }
  onboarding: {
    intro: string
    hello: string
  }
  missing: {
    missingReport: string
    missingPage: string
    back: string
  }
  errors: {
    error: string
    authenticationError: string
    authenticationSubtext: string
    networkError: string
    default: string
    subtext: string
  }
  support: {
    contactTitle: string
    contactCopy: string
    faqTitle: string
    faqCopy: string
    questions: {
      signature: {
        question: string
        answer: string
      }
      name: {
        question: string
        answer: string
      }
      features: {
        question: string
        answer: string
      }
      timetable: {
        question: string
        answer: string
      }
      schoolReport: {
        question: string
        answer: string
      }
      handoverMistake: {
        question: string
        answer: string
      }
      bug: {
        question: string
        answer: string
      }
      exportTime: {
        question: string
        answer: string
      }
      autoSave: {
        question: string
        answer: string
      }
      aboutUs: {
        question: string
        answer: string
      }
      darkmode: {
        question: string
        answer: string
        link: string
      }
      exportEmail: {
        question: string
        answer: string
      }
    }
  }
  navigation: {
    reports: string
    trainees: string
    trainer: string
    dashhboard: string
    archive: string
    settings: string
    wiki: string
  }
  trainerReportOverview: {
    todo: string
    todos: string
    upToDate: string
    reportHandoverSuccessTitle: string
    reportHandoverSuccess: string
    reportCommentSuccessTitle: string
    reportCommentSuccess: string
    reportDeclinedSuccessTitle: string
    reportDeclinedSuccess: string
    reportToArchiveSuccessTitle: string
    reportToArchiveSuccess: string
  }
  numerals: {
    first: string
    second: string
    third: string
    fourth: string
  }
  traineePlaceholders: {
    trainerPlaceholder: string
    companyPlaceholder: string
    yearPlaceholder: string
    coursePlaceholder: string
  }
  noUserPage: {
    title: string
    description: string
    featureReports: {
      title: string
      description: string
    }
    featureHandover: {
      title: string
      description: string
    }
    featureReviews: {
      title: string
      description: string
    }
  }
  validation: {
    minLength: string
    maxLength: string
    required: string
    dateBefore: string
    dateAfter: string
    startDateOutOfPeriod: string
    endDateOutOfPeriod: string
  }
  createTrainee: {
    title: string
    description: string
    success: string
  }
  createTrainer: {
    title: string
    description: string
    success: string
  }
  deleteTrainer: {
    title: string
    description: string
    success: string
  }
  admin: {
    marking: string
  }
  userDelete: {
    title: string
    description: string
  }
}
