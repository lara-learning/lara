import { Translations } from '.'

export const GermanTranslations: Translations = {
  errors: {
    startDateInFuture: 'Startdatum muss in der Vergangenheit liegen',
    startDateOutOfPeriod: 'Startdatum muss in den letzen 5 Jahren sein',
    endDateInPast: 'Enddatum muss in der Zukunft liegen',
    endDateBeforeStartDate: 'Enddatum muss nach dem Startdatum seind',
    endDateOutOfPeriod: 'Enddatum muss in den nächsten 5 Jahren sein',
    periodTooLong: 'Die Ausbildungsdauer darf nicht länger als 5 Jahre sein',
    missingTokens: 'Tokens konnten nicht generiert werden',
    missingUser: 'Benutzer konnte nicht gefunden werden',
    missingReport: 'Bericht konnte nicht gefunden werden',
    missingDay: 'Tag konnte nicht gefunden werden',
    missingEntry: 'Eintrag konnte nicht gefunden werden',
    wrongReportStatus: 'Der Bericht hat den falschen Status',
    wrongDayStatus: 'Der Tag hat den falschen Status',
    userAlreadyExists: 'Ein Benutzer mit dieser Email existiert bereits',
    userNotClaimed: 'Der Benutzer ist dir nicht zugeordnet',
    userAlreadyClaimed: 'Der Benutzer ist schon einem Ausbilder zugeteilt',
    dayTimeLimit: 'Der Tag überschreitet das Zeit maximum',
    missingStartDate: 'Der Ausbildungszeitraum fehlt',
    missingCommentable: 'Kommentierbarer Gegenstand konnte nicht gefunden werden',
    wrongUserType: 'Du besitzt den falschen Nutzer Typen um dies zu tun',
    reportIncomplete: 'Der Bericht ist nicht vollständig',
    missingPeriod: 'Die Ausbildungsperiode fehlt',
  },
  email: {
    hello: 'Hallo',
    comment: 'Zu dieser Woche gibt es einen Kommentar.',
    comment_plural: 'Zu dieser Woche gibt es {{ count }} Kommentare.',
    subject: {
      error: 'Fehler bei der pdf Generierung',
      reportExport: 'Dein Lara Export',
      acceptReport: 'Dein Bericht wurde genehmigt',
      needChanges: 'Bericht zurückgegeben',
      deleteYourTrainee: 'Dein Azubi wird bald gelöscht',
      deleteAccount: 'Dein Account wird bald gelöscht',
      deleteUser: 'Ein Benutzer wird bald gelöscht',
      reportInReview: 'Ein Bericht wurde abgegeben',
      alexa: 'Deine Accounts wurden verknüpft',
      paperBriefing: 'Dein Paper Briefing',
      paperBriefingMail: 'Dein Paper Briefing'
    },
    headline: {
      export: 'Dein Lara-Export!',
      accepted: 'Report genehmigt!',
      needChanges: 'Änderungen erforderlich!',
      deleteTrainee: 'Dein Azubi wird bald gelöscht',
      deleteAccount: 'Dein Account wird bald gelöscht',
      deleteUser: 'Ein Benutzer wird bald gelöscht',
      handOver: 'Ein Bericht wurde übergeben',
      alexa: 'Lara wurde mit Amazon Alexa verknüpft!',
      paperBriefing: 'Paper Briefing'
    },
    message: {
      error: 'etwas ist schiefgegangen. Bitte wende dich an einen Lara Admin oder Entwickler.',
      success: 'im Anhang findest du deinen Lara-Export. Wir wünschen dir ganz viel Spaß damit.',
      accepted: '{{ trainer }} hat dein Berichtsheft erhalten und genehmigt',
      needChanges:
        '{{ trainer }} hat dein Berichtsheft erhalten und es zurückgegeben. Zu dieser Woche gibt es einen Kommentar.',
      deleteTrainee:
        'Dein Auszubildener {{ trainee }} wird in 3 Monaten gelöscht. Sollte dies ein Fehler sein kannst du dich mit deinem Admin in Verbindung setzen, damit er die Löschung abbricht.',
      deleteAccount:
        'Dein Account bei Lara wird in 3 Monaten gelöscht. Sollte dies ein Fehler sein kannst du dich mit deinem Admin in Verbindung setzen, damit er die Löschung abbricht.',
      deleteUser:
        'Der Benutzer {{ user }} wird in 3 Monaten gelöscht. Sollte dies ein Fehler sein kannst du über den Button, in die Einstellungen gehen und dort die Löschung abbrechen.',
      handOver: 'dein Azubi {{ trainee }} hat KW {{ week }} seines Berichtsheft zur Überprüfung abgegeben.',
      alexa:
        'Dein Lara Account wurde mit deinem Amazon Alexa Account verknüpft. Sollte dies ein Fehler sein bitte öffne deine Lara Einstellungen und löse die Verknüpfung wieder auf. Außerdem solltest du dein Lara Passwort ändern.',
      paperBriefing: 'im Anhang findest du das Briefing-PDF zu der Ausbildungsstation. Wir wünschen dir ganz viel Spaß damit.'
    },
    link: {
      archive: 'zum Archiv',
      paperBriefing: 'zum Paper',
      report: 'zum Bericht',
      lara: 'zu Lara',
      settings: 'Einstellungen',
    },
  },
  print: {
    name: 'Name',
    department: 'Abteilung',
    apprenticeYear: 'Ausbildungssjahr',
    apprenticeCourse: 'Ausbildungsgang',
    period: 'Zeitraum',
    description: 'Beschreibung',
    duration: 'Dauer',
    holiday: 'Feiertag',
    sick: 'Krank',
    vacation: 'Urlaub',
    total: 'Gesamt',
    totalWeek: 'Wochenstunden',
    date: 'DATUM',
    signatureTrainee: 'UNTERSCHRIFT AUSZUBILDENDE/R',
    signatureTrainer: 'UNTERSCHRIFT AUSBILDER/IN',
    monday: 'Montag',
    tuesday: 'Dienstag',
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag',
    hello: 'Hallo',
    client: 'Kunde',
    mentor: 'Ausbildungsbeauftragter',
    trainer: 'Ausbilder',
    trainee: 'Auszubildender',
    briefing: 'Briefing'
  },
}
