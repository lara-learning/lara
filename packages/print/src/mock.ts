import http, { RequestListener } from 'http'

import { PrintData, PrintPaperData } from '@lara/api'

import { createPaperPage } from './create-pdf'

export const DUMMY_DATA: PrintData = {
  data: [
    {
      filename: 'file.pdf',
      reportPeriod: '01.01.2001 - 01.01.2002',
      apprenticeYear: 1,
      report: {
        days: [
          {
            entries: [
              { orderId: 1, text: 'Prepared to do list for vacation', time: 120 },
              { orderId: 2, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 3, text: 'Harvested alien babies', time: 120 },
              { orderId: 4, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 3, text: 'Harvested alien babies', time: 120 },
              { orderId: 4, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 1, text: 'Prepared to do list for vacation ', time: 480 },
              { orderId: 2, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 3, text: 'Harvested alien babies', time: 120 },
              { orderId: 4, text: "Made an amazing presentation for client's project", time: 120 },
            ],
            status: 'work',
          },
          {
            entries: [
              { orderId: 1, text: 'Prepared to do list for vacation ', time: 480 },
              { orderId: 2, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 3, text: 'Harvested alien babies', time: 120 },
              { orderId: 4, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 5, text: 'Prepared to do list for vacation ', time: 480 },
              { orderId: 6, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 7, text: 'Harvested alien babies', time: 120 },
              { orderId: 8, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 9, text: 'Prepared to do list for vacation ', time: 480 },
              { orderId: 10, text: "Made an amazing presentation for client's project", time: 120 },
            ],
            status: 'work',
          },
          {
            entries: [],
            status: 'vacation',
          },
          {
            entries: [
              { orderId: 2, text: 'Prepared to do list for vacation ', time: 480 },
              { orderId: 2, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 3, text: 'Harvested alien babies', time: 120 },
              { orderId: 4, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 3, text: 'Harvested alien babies', time: 120 },
              { orderId: 4, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 1, text: 'Prepared to do list for vacation ', time: 480 },
              { orderId: 2, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 3, text: 'Harvested alien babies', time: 120 },
              { orderId: 4, text: "Made an amazing presentation for client's project", time: 120 },
            ],
            status: 'work',
          },
          {
            entries: [
              { orderId: 3, text: 'Prepared to do list for vacation', time: 240 },
              { orderId: 1, text: "Made an amazing presentation for client's project", time: 240 },
              { orderId: 2, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 3, text: 'Harvested alien babies', time: 120 },
              { orderId: 4, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 3, text: 'Harvested alien babies', time: 120 },
              { orderId: 4, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 1, text: 'Prepared to do list for vacation ', time: 480 },
              { orderId: 2, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 3, text: 'Harvested alien babies', time: 120 },
              { orderId: 4, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 3, text: 'Harvested alien babies', time: 120 },
              { orderId: 4, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 1, text: 'Prepared to do list for vacation ', time: 480 },
              { orderId: 2, text: "Made an amazing presentation for client's project", time: 120 },
              { orderId: 3, text: 'Harvested alien babies', time: 120 },
              { orderId: 4, text: "Made an amazing presentation for client's project", time: 120 },
            ],
            status: 'work',
          },
        ],
        department: 'Design',
        summary: 'neu hier',
      },
      signatureDate: '01.02.2020',
    },
  ],
  userData: {
    receiverEmail: 'test@test.com',
    firstName: 'testName',
    course: 'Mediengestalter Digital und Print',
    lastName: 'Trainee Trainee',
    traineeSignature: 'TRAINEE',
    trainerSignature: 'TRAINER',
  },
  printTranslations: {
    name: 'Name',
    apprenticeCourse: 'Ausbildungsgang',
    department: 'Abteilung',
    apprenticeYear: 'Ausbildungsjahr',
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
    briefing: 'Briefing',
  },
  emailTranslations: {
    hello: 'Hallo {{ USER }},',
    comment: 'Zu dieser Woche gibt es einen Kommentar.',
    comment_plural: 'Zu dieser Woche gibt es {{ COUNT }} Kommentare.',
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
      paperBriefingMail: 'Dein Paper Briefing',
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
      paperBriefing: 'Paper Briefing',
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
        'Dein Lara Account wurde mit deinem Amazon Alexa Account verknüpft. Sollte dies ein Fehler sein bitte öffne deine Lara Einstellungen und löse die Verknüpfung wieder auf. Außerdem solltest du dein Passwort ändern.',
      paperBriefing:
        'im Anhang findest du das Briefing-PDF zu der Ausbildungsstation von Anna. Wir wünschen dir ganz viel Spaß damit.',
    },
    link: {
      archive: 'Zum Archive',
      paperBriefing: 'Zum Paper',
      report: 'Zum Report',
      lara: 'Lara',
      settings: 'Einstellungen',
    },
  },
}

export const DUMMY_PAPER_DATA: PrintData = {
  data: [
    {
      filename: 'paperBriefingFile.pdf',
      paper: {
        status: 'InProgress',
        briefing: [
          {
            id: '1',
            questionId: '1',
            answer: 'Test Antwort',
            question: 'Gegenstand der Arbeit',
            hint: 'Nenne hier bitte kurz die allgemeine Tätigkeit/Aufgabe, welche Inhalt der Projektstation ist.',
          },
          {
            id: '2',
            questionId: '1',
            answer: 'Test Antwort',
            question: 'Gegenstand der Arbeit',
            hint: 'Nenne hier bitte kurz die allgemeine Tätigkeit/Aufgabe, welche Inhalt der Projektstation ist.',
          },
          {
            id: '3',
            questionId: '1',
            answer: 'Test Antwort',
            question: 'Gegenstand der Arbeit',
            hint: 'Nenne hier bitte kurz die allgemeine Tätigkeit/Aufgabe, welche Inhalt der Projektstation ist.',
          },
          {
            id: '1',
            questionId: '2',
            answer: 'Test Antwort',
            question: 'Vorgehen',
            hint: 'Nenne hier bitte unter welchen Rahmenbedingungen die Projektstation für den Azubi aufgebaut sein soll.',
          },
          {
            id: '2',
            questionId: '2',
            answer: 'Test Antwort',
            question: 'Vorgehen',
            hint: 'Nenne hier bitte unter welchen Rahmenbedingungen die Projektstation für den Azubi aufgebaut sein soll.',
          },
          {
            id: '1',
            questionId: '3',
            answer: 'Test Antwort',
            question: 'Lerninhalte Station',
            hint: 'Nenne hier welche allgemeinen Inhalte dem Azubi während dem Projekt Zeitraum vermittelt werden sollen.',
          },
          {
            id: '1',
            questionId: '4',
            answer: 'Test Antwort',
            question: 'Rahmenplan Lerninhalte',
            hint: 'Ergänze hier (falls gewollt) zusätzliche Punkte aus dem Rahmenplan, welche du als besonders wichtig erachtest, dass diese im Briefing erwähnt werden.',
          },
          {
            id: '2',
            questionId: '4',
            answer: 'Test Antwort',
            question: 'Rahmenplan Lerninhalte',
            hint: 'Ergänze hier (falls gewollt) zusätzliche Punkte aus dem Rahmenplan, welche du als besonders wichtig erachtest, dass diese im Briefing erwähnt werden.',
          },
          {
            id: '3',
            questionId: '4',
            answer: 'Test Antwort',
            question: 'Test Frage',
            hint: 'Test Hinweis',
          },
        ],
        client: 'Kunde',
        periodStart: '2022-08-07T05:14:28.000Z',
        periodEnd: '2025-08-07T05:14:28.000Z',
        schoolPeriodStart: '2022-08-07T05:14:28.000Z',
        schoolPeriodEnd: '2025-08-07T05:14:28.000Z',
        subject: 'Entwicklung',
      },
    },
  ],
  userData: {
    receiverEmail: 'test@test.com',
    firstName: 'testName',
    course: 'Mediengestalter Digital und Print',
    lastName: 'Trainee Trainee',
    traineeSignature: 'TRAINEE',
    trainerSignature: 'TRAINER',
  },
  printTranslations: {
    name: 'Name',
    apprenticeCourse: 'Ausbildungsgang',
    department: 'Abteilung',
    apprenticeYear: 'Ausbildungsjahr',
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
    briefing: 'Briefing',
  },
  emailTranslations: {
    hello: 'Hallo {{ USER }},',
    comment: 'Zu dieser Woche gibt es einen Kommentar.',
    comment_plural: 'Zu dieser Woche gibt es {{ COUNT }} Kommentare.',
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
      paperBriefingMail: 'Dein Paper Briefing',
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
      paperBriefing: 'Paper Briefing',
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
        'Dein Lara Account wurde mit deinem Amazon Alexa Account verknüpft. Sollte dies ein Fehler sein bitte öffne deine Lara Einstellungen und löse die Verknüpfung wieder auf. Außerdem solltest du dein Passwort ändern.',
      paperBriefing:
        'im Anhang findest du das Briefing-PDF zu der Ausbildungsstation von Anna. Wir wünschen dir ganz viel Spaß damit.',
    },
    link: {
      archive: 'Zum Archive',
      paperBriefing: 'Zum Paper',
      report: 'Zum Report',
      lara: 'Lara',
      settings: 'Einstellungen',
    },
  },
}

const host = 'localhost'
const port = 9000
const { data, userData, printTranslations } = DUMMY_PAPER_DATA

const requestListener: RequestListener = (_req, res) => {
  res.writeHead(200)
  res.end(createPaperPage(data[0] as PrintPaperData, userData, printTranslations))
}

const server = http.createServer(requestListener)
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`)
})
