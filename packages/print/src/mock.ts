import http, { RequestListener } from 'http'

import { PrintData } from '@lara/api'

import { createPage } from './create-pdf'

export const DUMMY_DATA: PrintData = {
  reportsData: [
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
  },
  emailTranslations: {
    hello: 'Hallo {{ USER }},',
    comment: 'Zu dieser Woche gibt es einen Kommentar.',
    comment_plural: 'Zu dieser Woche gibt es {{ COUNT }} Kommentare.',
    subject: {
      error: 'Fehler bei der pdf Generierung',
      reportExport: 'Dein Lara Export',
      acceptReport: 'Dein Bericht wurde genehmigt',
      needChangesNoComment: 'Bericht zurückgegeben',
      needChangesComment: 'Bericht zurückgegeben',
      deleteYourTrainee: 'Dein Azubi wird bald gelöscht',
      deleteAccount: 'Dein Account wird bald gelöscht',
      deleteUser: 'Ein Benutzer wird bald gelöscht',
      reportInReview: 'Ein Bericht wurde abgegeben',
      alexa: 'Deine Accounts wurden verknüpft',
    },
    headline: {
      export: 'Dein Lara-Export!',
      accepted: 'Report genehmigt!',
      needChangesNoComment: 'Änderungen erforderlich!',
      needChangesComment: 'Änderungen erforderlich!',
      deleteTrainee: 'Dein Azubi wird bald gelöscht',
      deleteAccount: 'Dein Account wird bald gelöscht',
      deleteUser: 'Ein Benutzer wird bald gelöscht',
      handOver: 'Ein Bericht wurde übergeben',
      alexa: 'Lara wurde mit Amazon Alexa verknüpft!',
    },
    message: {
      error: 'etwas ist schiefgegangen. Bitte wende dich an einen Lara Admin oder Entwickler.',
      success: 'im Anhang findest du deinen Lara-Export. Wir wünschen dir ganz viel Spaß damit.',
      accepted: '{{ trainer }} hat dein Berichtsheft erhalten und genehmigt',
      needChangesComment:
        '{{ trainer }} hat dein Berichtsheft erhalten und es zurückgegeben. Zu dieser Woche gibt es einen Kommentar.',
      needChangesNoComment: '{{ trainer }} hat dein Berichtsheft erhalten und es zurückgegeben.',
      deleteTrainee:
        'Dein Auszubildener {{ trainee }} wird in 3 Monaten gelöscht. Sollte dies ein Fehler sein kannst du dich mit deinem Admin in Verbindung setzen, damit er die Löschung abbricht.',
      deleteAccount:
        'Dein Account bei Lara wird in 3 Monaten gelöscht. Sollte dies ein Fehler sein kannst du dich mit deinem Admin in Verbindung setzen, damit er die Löschung abbricht.',
      deleteUser:
        'Der Benutzer {{ user }} wird in 3 Monaten gelöscht. Sollte dies ein Fehler sein kannst du über den Button, in die Einstellungen gehen und dort die Löschung abbrechen.',
      handOver: 'dein Azubi {{ trainee }} hat KW {{ week }} seines Berichtsheft zur Überprüfung abgegeben.',
      alexa:
        'Dein Lara Account wurde mit deinem Amazon Alexa Account verknüpft. Sollte dies ein Fehler sein bitte öffne deine Lara Einstellungen und löse die Verknüpfung wieder auf. Außerdem solltest du dein Passwort ändern.',
    },
    link: {
      archive: 'Zum Archive',
      report: 'Zum Report',
      lara: 'Lara',
      settings: 'Einstellungen',
    },
  },
}

const host = 'localhost'
const port = 9000
const { reportsData, userData, printTranslations } = DUMMY_DATA

const requestListener: RequestListener = (_req, res) => {
  res.writeHead(200)
  res.end(createPage(reportsData[0], userData, printTranslations))
}

const server = http.createServer(requestListener)
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`)
})
