import Translation from './translation'

const germanTranslation: Translation = {
  today: 'Heute',
  week: 'Woche',
  open: 'Offen',
  total: 'Gesamt',
  archive: 'Archiv',
  course: 'Ausbildungsgang',
  period: 'Ausbildungszeitraum',
  periodTo: 'bis',
  company: 'Firma',
  companyPick: 'Bitte wähle deine Firma:',
  continue: 'Weiter',
  save: 'Speichern',
  edit: 'bearbeiten',
  done: 'fertig',
  markDelete: 'für Löschung markieren',
  unmarkDelete: 'Löschmarkierung aufheben',
  deleteAt: 'Löschen nach',
  cancel: 'Abbrechen',
  deactivate: 'Deaktivieren',
  traineeShipYear: 'Jahr der Ausbildung',
  claimed: 'Ausgewählt',
  back: 'zurück',
  on: 'an',
  off: 'aus',
  modal: {
    defaultClose: 'Schließen',
  },
  dashboard: {
    weekend: "Genieß' dein Wochenende!",
    success: 'Du hast es geschafft!',
    noReport: {
      headline: 'Yeah, das sieht gut aus!',
      description: 'Du hast gerade keine Berichtshefte zu erledigen, endlich Zeit zu arbeiten.',
    },
    declinedReportMessageTitle: 'Bericht zurückerhalten',
    declinedReportMessage:
      'Du hast deinen Bericht über {0}{1} von {name} zurückerhalten. Es sind Änderungen notwendig.',
    reportToArciveAddedSuccessTitle: 'Neuer Bericht im Archiv',
    reportToArciveAddedSuccess:
      'Dein Bericht über {0}{1} wurde von {name} genehmigt und befindet sich jetzt in deinem Archiv.',
  },

  paper: {
    empty: {
      headline: 'Briefing/Kick-Off Gespräch',
      description:
        'Dein Azubi kommt auf eine neue Station und es steht das Kick-Off Gespräch an? Hier kannst du das Briefing für die Station ausfüllen und vorbereiten. Damit kannst du einene Rahmen über den Umfang und die Themen der Ausbildungssation deines Azubis festlegen.',
      createBriefing: 'Briefing erstellen',
    },
    createBriefing: {
      title: 'Briefing',
      firstnameMentor: 'Vorname Ausbildungsbeauftragten',
      lastnameMentor: 'Nachname Ausbildungsbeauftragten',
      emailMentor: 'Email Ausbildungsbeauftragten',
      trainee: 'Auszubildender',
      department: 'Abteilung',
      customer: 'Kunde',
      projectPeriod: 'Stationszeitraum',
      schoolPeriod: 'Schulzeitraum',
    },
    briefingQuestions: {
      objectOfTheWork: {
        question: 'Gegenstand der Arbeit',
        hint: 'Nenne hier bitte die allgemeine Tätigkeit/Aufgabe, die Inhalt der Projektstation ist.',
      },
      procedure: {
        question: 'Vorgehen',
        hint: 'Nenne hier bitte unter welchen Rahmenbedingungen die Projektstation für den Azubi aufgebaut sein soll.',
      },
      learningContent: {
        question: 'Lerninhalte Station',
        hint: 'Nenne hier welche allgemeinen Inhalte dem Azubi während dem Projekt Zeitraum vermittelt werden sollen.',
      },
      frameworkPlan: {
        question: 'Rahmenplan Lerninhalte',
        hint: 'Ergänze hier (falls gewollt) zusätzliche Punkte aus dem Rahmenplan, welche du als besonders wichtig erachtest, dass diese im Briefing erwähnt werden.',
      },
      tasksAndDutiesTrainee: {
        question: 'Aufgaben und Pflichten des Azubis',
        hint: 'Nenne hier (falls gewollt), welche Aufgaben und Pflichten dein Azubi zu erfüllen hat. ',
      },
      tasksAndDutiesMentor: {
        question: 'Aufgaben und Pflichten des Ausbildungsbeauftragten',
        hint: 'Nenne hier (falls gewollt), welche Aufgaben und Pflichten der Ausbildungsbeauftragte zu erfüllen hat.',
      },
      primeBlueAntMyTe: {
        question: 'Prime / BlueAnt',
        hint: 'Fasse hier kurz zusammen auf welchen Posten der Azubi seine Stunden/Aufwände buchen kann/soll.',
      },
      feedback: {
        question: 'Feedback',
        hint: 'Hier ist im Briefing einmal kurz zusammenefasst, was unter Feedback zu verstehen ist. Du kannst den Vorlagen Text bei Bedarf natürlich noch ergänzen.',
      },
      otherRemarks: {
        question: 'Sonstige Anmerkungen',
        hint: 'Falls du noch zusätzliche Punkte hast, welche ins Breifing aufgenommen werden sollen, kannst du diese hier festhalten.',
      },
    },
    modal: {
      title: 'Bist du sicher, dass du das Briefing beenden möchtest?',
      description:
        '' +
        'Wenn du auf “Briefing erstellen” drückst, kannst du das Briefing nicht mehr bearbeiten. Das Briefing wird daraufhin als PDF an deinen Azubi und den Ausbildungsbeauftragten per E-Mail gesendet.\n' +
        '\n' +
        'Du kannst das Briefing stattdessen speichern, damit du es später nochmal bearbeiten kannst.',
      createBriefing: 'Briefing erstellen',
      backToPaperTitle: 'Briefing wird exportiert',
      backToPaperDescription:
        'Das Lara Paper Briefing wird exportiert und anschließend als PDF an alle Teilnehmer verschickt. Es kann sein, dass du später Lara neuladen musst, um das neu erstellte Paper sehen zu. \n' +
        'Hab jetzt etwas Geduld während das Briefing exportiert wird.',
      backToPaperButton: 'Züruck zur Paper Übersicht',
      deletePaperTitle: 'Paper löschen für {kunde}',
      deletePaperDescription:
        'Bist du sicher, dass du das Paper für den Kunden {kunde} löschen willst? Es kann nicht mehr rückgängig gemacht werden.',
      deletePaperButtonAgree: 'bestätigen',
      deletePaperButtonDisagree: 'abbrechen',
    },
    dashboard: {
      title: 'Station',
      description: 'Für die Station von ihrem Azubi steht das Stationsfeedbackgespräch an. Du kannst es hier starten.',
      briefing: 'Briefing',
      feedback: 'Stationsfeedback',
      conclusion: 'Fazit',
      pdfFeedback: 'PDF Stationsfeedback',
      trainee: 'Auszubildender',
      trainer: 'Ausbilder',
      editPaper: 'Paper bearbeiten',
    },
    createPaper: {
      title: 'Briefing erstellt',
      text: 'Das Briefing wurde erstellt',
    },
    deletePaper: {
      title: 'Paper gelöscht',
      text: 'Das Lara Paper wurde gelöscht',
    },
    briefing: {
      toastTitle: 'Lara Paper Briefing wird erstellt',
      toastDescription: 'Das Briefing wird jetzt erstellt und wird den Teilnehmern per Mail als PDF verschickt',
    },
  },

  archivePage: {
    header: 'Archiv',
    tableHead: {
      calendarWeek: 'KW',
      date: 'DATUM',
      department: 'ABTEILUNG',
    },
    searchPlaceholder: 'Suche',
    selectAllLabel: 'Alle auswählen',
    emptyState: {
      noResult: {
        title: 'Leider habe ich nichts gefunden',
        caption:
          'Bitte überprüfe deine Sucheingabe und versuche es erneut. {0} Mit {1} kannst du eine bestimmte Kalenderwoche suchen oder mit {2} nach einem Zeitraum.',
      },
      initial: {
        title: 'Hier gibt es noch nichts',
        caption: 'Deine Berichtshefte erscheinen hier sobald sie akzeptiert wurden und stehen dann zum Export bereit.',
      },
    },
    exportTitle: 'Export gestartet',
    export: 'Du erhältst in Kürze eine E-mail mit den exportierten Berichten.',
  },
  report: {
    title: 'Bericht für',
    remarks: 'Sonstige Anmerkungen',
    remarksPlaceholder: 'Trage hier sonstige Anmerkungen ein...',
    reportSaveSuccess: 'Das Berichtsheft wurde erfolgreich gespeichert!',
    textPlaceholder: 'Beschreibung',
    export: 'PDF exportieren',
    handover: 'Bericht übergeben',
    handoverTitle: 'Bericht übergeben',
    handoverNotificationText: 'Dein Bericht wurde übergeben und wird jetzt geprüft.',
    accept: 'Bericht genehmigen',
    decline: 'Bericht zurückgeben',
    archived: 'Archiviert',
    department: {
      title: 'Abteilung',
      departmentAddedTitle: 'Abteilung hinzugefügt',
      departmentAddedText: 'Deine Abteilung wurde erfolgreich hinzugefügt und gespeichert.',
      departmentMissingTitle: 'Abteilung hinzugefügen',
      departmentMissingText: 'Du musst eine Abteilung eintragen, damit dein Bericht übergeben werden kann.',
    },
    unarchive: 'Aus dem Archiv holen',
    total: 'Wochenstunden',
    headingContainer: {
      title: 'Kalenderwoche',
      back: 'vorherige',
      forward: 'nächste',
    },
    modalTitle: {
      handover: 'Bericht {0} {1} an Ausbilder übergeben?',
      accept: 'Bericht {0} {1} genehmigen?',
      decline: 'Bericht {0} {1} an Auszubildenden zurückgeben',
      unarchive: 'Bericht {0} {1} aus dem Archiv holen?',
    },
    modalCopy: {
      handover:
        'Nachdem der Bericht übergeben wurde kannst du keine Änderungen mehr vornehmen. Sobald der Bericht akzeptiert wurde, kannst du ihn als PDF exportieren.',
      accept:
        'Nach dem Genehmigen wird der Bericht elektronisch unterschrieben und der Auszubildende kann ihn exportieren.',
      decline:
        'Nachdem der Bericht zurückgegeben wurde, kann der Auszubildende weitere Änderungen vornehmen und ihn erneut übergeben.',
      unarchive:
        'Nachdem der Bericht aus dem Archiv geholt wurde kann dieser nicht mehr exportiert werden und muss von deinem Ausbilder erneut überprüft werden.',
    },
    comments: {
      addComment: 'Kommentar hinzufügen',
      addCommentToEntry: 'Kommentar zu Eintrag hinzufügen',
    },
    underReview: 'wird überprüft',
  },
  dropdown: {
    help: 'Hilfe',
    logout: 'Abmelden',
  },
  dayStatus: {
    work: 'Arbeit',
    education: 'Schule',
    vacation: 'Urlaub',
    sick: 'Krank',
    holiday: 'Feiertag',
  },
  weekOverview: {
    week: 'KW',
    finishedDays: 'Tage erfüllt',
    commented: 'kommentiert',
  },
  entryStatus: {
    saveSuccess: 'Eintrag erfolgreich erstellt',
    changeSuccess: 'Eintrag erfolgreich geändert',
    deleteSuccess: 'Eintrag erfolgreich gelöscht',
    saveError: 'Fehler beim Speichern',
    changeError: 'Fehler beim Ändern',
    deleteError: 'Fehler beim Löschen',
    dayLimitError: 'Der Eintrag überschreitet die maximalen Stunden pro Tag',
  },
  settings: {
    firstname: 'Vorname',
    lastname: 'Nachname',
    email: 'E-Mail',
    startOfToolusage: 'Start der Laranutzung',
    associatedTrainer: 'Zugeordnete Ausbildende',
    associatedTrainees: 'Zugeordnete Auszubildende',
    notAssociated: 'noch nicht zugeordnet',
    application: 'Anwendung',
    apprenticeship: 'Ausbildung',
    user: 'Benutzer',
    trainership: 'Ausbilder Einstellungen',
    contact: 'Ansprechpartner',
    trainer: 'Ausbilder',
    noTrainer: 'Von keinem Ausbilder ausgewählt',
    saveError: 'Deine Einstellungen konnten nicht gespeichert werden!',
    saveSuccess: 'Deine Einstellungen sind jetzt auf dem neuesten Stand.',
    saveSuccessTitle: 'Einstellungen aktualisiert',
    language: {
      title: 'Sprache',
      english: 'Englisch',
      german: 'Deutsch',
    },
    theme: {
      title: 'Erscheinungsbild',
      system: 'Systemeinstellungen',
      light: 'Hell',
      dark: 'Dunkel',
    },
    other: 'Sonstiges',
    notification: 'E-Mail Benachrichtigungen erhalten',
    signature: {
      title: 'Unterschrift',
      deleteSignature: 'Unterschrift löschen',
      addSignature: 'Unterschrift hinzufügen',
      placeholder: {
        heading: 'Füge deine Unterschrift hinzu',
        description: 'Füge deine Unterschrift hinzu, um fertige Berichte zu unterschreiben.',
      },
      addSuccessTitle: 'Unterschrift hinzugefügt',
      addSuccess: 'Deine Unterschrift kann jetzt zum automatischen Unterschreiben des Berichtsheftes genutzt werden.',
      deleteSuccessTitle: 'Unterschrift gelöscht',
      deleteSuccess:
        'Deine Unterschrift wurde entfernt und kann jetzt nicht mehr zum automatischen Unterschreiben genutzt werden.',
      modal: {
        title: 'Scanne deine Unterschrift',
        label:
          'Unterschreibe auf einem weißen Blatt mit einem schwarzen Stift und achte darauf, dass nur deine Unterschrift zu sehen ist und das Blatt gleichmäßig beleuchtet ist, damit der Kontrast zwischen dem Papier und deiner Unterschrift klar zu erkennen ist.',
        record: 'Aufnehmen',
        newtry: 'neuer Versuch',
        error: 'Dein Browser darf scheinbar deine Webcam nicht benutzen. Bitte gestatte es ihm.',
      },
    },
    alexa: {
      headline: 'Dein Alexa-Gerät',
      linkTitle: 'Füge deine Alexa hinzu',
      unlinkTitle: 'Entferne deine Alexa',
      linkInstructions: 'Melde dich mit deiner Amazon Email-Adresse an um Lara auf deinem Alexa Gerät zu benutzen.',
      linkButton: 'Anmelden mit Amazon',
      unlinkInstructions: 'Entferne deine Alexa Gerät von deinem Lara Account.',
      unlinkButton: 'Alexa entfernen',
      linkSuccess: 'Dein Amazon account wurde erfolgreich mit dem Lara account verknüpft',
      linkError: 'Dein Amazon account konnte nicht mit dem Lara account verknüpft werden. Versuche es später erneut',
      unlinkSuccess: 'Dein Amazon account wurde erfolgreich entfernt',
      unlinkError: 'Dein Amazon account konnte nicht entfernt werden. Versuche es später erneut',
      loading: 'Deine Accounts werden verknüpft. Bitte warte kurz...',
    },
  },
  onboarding: {
    intro: 'Schön dich kennenzulernen. Bitte trage ein paar Informationen zu deiner Ausbildung ein.',
    hello: 'Moin',
  },
  missing: {
    missingReport: 'Das Berichtsheft nach dem du suchst existiert nicht.',
    missingPage: 'Wir konnten die Seite nach der du suchst leider nicht finden.',
    back: 'Zurück zum Dashboard',
  },
  errors: {
    error: 'Fehler',
    authenticationError: 'Dein Benutzer konnte im System nicht gefunden werden',
    authenticationSubtext: `Solltest du dich in der Ausbildung befinden, wende dich bitte an ${ENVIRONMENT.supportMail}.`,
    networkError: 'Ein Netzwerkfehler ist aufgetreten',
    default: 'Ein unbekannter Fehler ist aufgetreten',
    subtext: `Bitte versuche es in einigen Minuten erneut. Sollte das Problem weiterhin bestehen, melde dich bitte bei ${ENVIRONMENT.supportMail}`,
  },
  support: {
    contactTitle: 'Kontakt',
    contactCopy: 'Berichte uns Probleme oder frage uns etwas über deinen Lara.',
    faqTitle: 'Fragen',
    faqCopy: 'Hier findest du hilfreiche Tipps oder oft gestellte Fragen über Lara.',
    questions: {
      signature: {
        question: 'Was kann ich tun, damit meine eingescannte Unterschrift besser zu erkennen ist?',
        answer:
          'Am besten schreibst du auf einem weißen Zettel mit einem möglichst kontrastreichen (z.B. blau/schwarz) und dickeren Stift.',
      },
      name: {
        question: 'Wofür steht Lara?',
        answer:
          'Lara hat seinen Namen von dem schwedischen Wort lära [˅læːra] bekommen, was für lernen oder auch das “Dasein” eines Azubis steht.',
      },
      features: {
        question: 'Was kann das Berichtsheft Tool?',
        answer:
          'Mit Lara kannst du deine Berichtshefte, welche Teil der dualen Berufsausbildung sind, schreiben und digital an deinen Ausbilder/ deine Ausbilderin übergeben. Dann können sie von ihm/ihr überprüft werden und bei Änderungswünschen an dich zurückgegeben werden oder direkt in dein Archiv verschoben und gespeichert werden.',
      },
      timetable: {
        question: 'Kann ich meinen Stundenplan hochladen?',
        answer: 'Noch kannst du deinen Stundenplan nicht hochladen, das Feature ist allerdings  bereits geplant!',
      },
      schoolReport: {
        question: 'Kann ich meine Zeugnisse hochladen?',
        answer:
          'Noch kannst du deine Zeugnisse nicht hochladen, diese Feature ist allerdings für die Zukunft von Lara geplant!',
      },
      handoverMistake: {
        question: 'Ich habe mein Berichtsheft versehentlich gesendet. Was dann?',
        answer:
          'Setze dich mit deiner Ausbilderin/ deinem Ausbilder in Kontakt. Diese können dir das bereits abgesendete Berichtsheft wieder zurückgeben und du kannst erneut Änderungen vornehmen.',
      },
      bug: {
        question: 'Wen kontaktiere ich bei Bugs, Problemen oder sonstigen Anregungen?',
        answer: 'Sende uns gerne eine E-mail an {0} bei Problemen. Wir melden uns bei dir!',
      },
      exportTime: {
        question: 'Wie lange dauert ein Massenexport?',
        answer:
          'Grundsätzlich dauert ein Export nicht lange. Plane trotzdem genügend Zeit ein, wenn du mehrere Berichtshefte auf einmal exportieren möchtest.',
      },
      autoSave: {
        question: 'Werden meine Einträge automatisch gespeichert?	',
        answer:
          'Sobald du eine Tätigkeit eingetragen hast (und diese mit Enter bestätigst) ist dein Eintrag automatisch gespeichert und du kannst die Seite einfach verlassen ohne manuell speichern zu müssen.',
      },
      aboutUs: {
        question: 'Wer steckt hinter Lara?',
        answer:
          'Hinter Lara stecken Azubis und dualen Studenten von Accenture Song. Wir managen, designen und entwickeln Lara ständig weiter.',
      },
      darkmode: {
        question: 'Gibt es Lara auch im Darkmode?',
        answer: 'Klar! Du kannst unter {0} zwischen einem hellen und dunklen Erscheinungsbild wählen.',
        link: 'Einstellungen > Anwendung',
      },
      exportEmail: {
        question: 'Wie werden mir die Berichtshefte bei einem Massenexport zugestellt?',
        answer:
          'Lara hat seinen Namen von dem schwedischen Wort lära [˅læːra] bekommen, was für lernen oder auch das Dasein eines Azubis steht.',
      },
    },
  },
  navigation: {
    reports: 'Berichte',
    trainees: 'Auszubildende',
    trainer: 'Ausbilder',
    mentor: 'Ausbildungsbeauftragte',
    dashhboard: 'Dashboard',
    paper: 'Paper',
    archive: 'Archiv',
    settings: 'Einstellungen',
  },
  trainerReportOverview: {
    todo: 'Es ist noch {count} Berichtsheft in Arbeit',
    todos: 'Es sind noch {count} Berichtshefte in Arbeit',
    upToDate: 'Alles ist auf dem aktuellen Stand',
    reportHandoverSuccessTitle: 'Bericht erhalten',
    reportHandoverSuccess: '{name} hat dir einen Bericht übergeben.',
    reportCommentSuccessTitle: 'Kommentar hinzugefügt',
    reportCommentSuccess: 'Dein Kommentar wurde dem Bericht hinzugefügt.',
    reportDeclinedSuccessTitle: 'Bericht zurückgegeben',
    reportDeclinedSuccess: 'Du hast den Bericht zurückgegeben und die gewünschten Änderungen weitergeleitet.',
    reportToArchiveSuccessTitle: 'Bericht ins Archiv verschoben',
    reportToArchiveSuccess: 'Du hast den Bericht genehmigt und er befindet sich jetzt in dem Archiv.',
  },
  numerals: {
    first: 'Erstes',
    second: 'Zweites',
    third: 'Drittes',
    fourth: 'Viertes',
  },
  traineePlaceholders: {
    trainerPlaceholder: 'Auzubildender ist noch nicht zugeordnet',
    companyPlaceholder: 'Firma wurde noch nicht gewählt',
    yearPlaceholder: 'Startdatum wurde noch nicht gewählt',
    coursePlaceholder: 'Ausbildungsgang wurde noch nicht gewählt',
  },
  noUserPage: {
    title: 'Über Lara',
    description: 'Lara ermöglicht es Auszubildenden, Berichtshefte intuitiv und einfach zu schreiben.',
    featureReports: {
      title: 'Wochenberichte schreiben',
      description:
        'Behalte immer den Überblick und schreibe Wochenberichte mit unterstützenden Funktionen wie automatisierter Zeiterfassung und dynamischem Export.',
    },
    featureHandover: {
      title: 'Einfache Übergabe',
      description:
        'Reduziere den Aufwand für Feedbackprozesse durch eine einfache digitale Übermittlung an Ausbilder. Genehmigte Dokumente werden automatisch unterschrieben und können am Ende der Ausbildung ausgedruckt werden.',
    },
    featureReviews: {
      title: 'Stationsberichte',
      description:
        'Fasse deine Erfahrungen nach jeder Ausbildungsstation mit einem Rich-Text-Editor zusammen, der Medieninhalte, Syntaxhervorhebungen und Formeln unterstützt.',
    },
  },
  trainerReportsPage: {
    emptyState: {
      title: 'Dir sind aktuell keine Auszubildenden zugewiesen',
      caption: 'Du kannst dir welche auf der Auszubildenden Seite auswählen.',
    },
  },
  validation: {
    maxLength: 'Dieses Feld darf maximal {0} Zeichen lang sein',
    minLength: 'Dieses Feld muss mindestens {0} Zeichen lang sein',
    required: 'Dieses Feld muss ausgefüllt sein',
    dateBefore: 'Das Datum muss vor dem Enddatum liegen',
    dateAfter: 'Das Datum muss nach dem Startdatum liegen',
    startDateOutOfPeriod: 'Startdatum muss in den letzen 5 Jahren sein',
    endDateOutOfPeriod: 'Enddatum muss in den nächsten 5 Jahren sein',
  },
  createTrainee: {
    title: 'Neuer Auszubildender',
    description:
      'Trage hier die Daten des neuen Auszubildenden / der neuen Auszubildenden ein, damit er/sie sich anmelden kann. Die Daten können später noch überarbeitet werden.',
    success: 'Der/Die Auszubildende {0} wurde erfolgreich angelegt und kann den Account jetzt nutzen.',
  },
  createTrainer: {
    title: 'Neuer Ausbilder',
    description:
      'Trage hier die Daten des neuen Ausbilders / der neuen Ausbilderin ein, damit er/sie sich anmelden kann. Die Daten können später noch überarbeitet werden.',
    success: 'Der/Die Ausbilder:in {0} wurde erfolgreich angelegt und kann den Account jetzt nutzen.',
  },
  createMentor: {
    title: 'Neuer Ausbildungsbeauftragte',
    description:
      'Trage hier die Daten des neuen Ausbilders / der neuen Ausbilderin ein, damit er/sie sich anmelden kann. Die Daten können später noch überarbeitet werden.',
    success: 'Der/Die Ausbilder:in {0} wurde erfolgreich angelegt und kann den Account jetzt nutzen.',
  },
  deleteTrainer: {
    title: '{0} wirklich löschen?',
    description:
      'Wenn du den Benutzer löscht, wird der Account zunächst für 24 Stunden deaktiviert. Danach erhälst du eine E-mail mit der Möglichkeit den Account entgültig zu löschen. ',
    success: 'Du erhältst in Kürze eine E-mail mit der Option den Nutzer zu Löschen.',
  },
  deleteMentor: {
    title: '{0} wirklich löschen?',
    description:
      'Wenn du den Benutzer löscht, wird der Account zunächst für 24 Stunden deaktiviert. Danach erhälst du eine E-mail mit der Möglichkeit den Account entgültig zu löschen. ',
    success: 'Du erhältst in Kürze eine E-mail mit der Option den Nutzer zu Löschen.',
  },
  admin: {
    marking: 'Markiert zur Löschung',
  },
  userDelete: {
    title: 'Nutzer deaktiviert',
    description: 'Du erhältst in Kürze eine E-mail mit der Option den Nutzer zu Löschen. ',
  },
}

export default germanTranslation
