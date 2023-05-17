import { EmailPayload } from '@lara/api'
import { compile } from 'handlebars'
import http, { RequestListener } from 'http'
import { generateEmailTemplate } from './mail-template'

export const DUMMY_DATA: EmailPayload = {
  emailType: 'acceptReport',
  userData: {
    receiverEmail: 'reciver-mail@exampleCompany.com',
    receiverName: 'FirstName',
    trainer: 'TrainerName',
    buttonLink: 'www.lara.exampleCompany.com',
  },
  translations: {
    hello: 'Hallo',
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
        'im Anhang findest du das Briefing-PDF zu der Ausbildungsstation. Wir wünschen dir ganz viel Spaß damit.',
    },
    link: {
      archive: 'Zum Archive',
      report: 'Zum Report',
      paperBriefing: 'Zum Briefing',
      lara: 'Lara',
      settings: 'Einstellungen',
    },
  },
}

const host = 'localhost'
const port = 9001
const { translations } = DUMMY_DATA

const requestListener: RequestListener = (_req, res) => {
  const url = _req.url

  switch (url) {
    case '/error':
      res.writeHead(200)
      res.end(generateEmailTemplate('error', translations))
      break
    case '/reportExport':
      res.writeHead(200)
      res.end(compile(generateEmailTemplate('reportExport', translations))(DUMMY_DATA.userData))
      break
    case '/acceptReport':
      res.writeHead(200)
      res.end(generateEmailTemplate('acceptReport', translations))
      break
    case '/needChanges':
      res.writeHead(200)
      res.end(generateEmailTemplate('needChanges', translations))
      break
    case '/deleteYourTrainee':
      res.writeHead(200)
      res.end(generateEmailTemplate('deleteYourTrainee', translations))
      break
    case '/deleteAccount':
      res.writeHead(200)
      res.end(generateEmailTemplate('deleteAccount', translations))
      break
    case '/deleteUser':
      res.writeHead(200)
      res.end(generateEmailTemplate('deleteUser', translations))
      break
    case '/reportInReview':
      res.writeHead(200)
      res.end(generateEmailTemplate('reportInReview', translations))
      break
    case '/paperBriefing':
      res.writeHead(200)
      res.end(generateEmailTemplate('paperBriefing', translations))
      break
    default:
      res.writeHead(200)
      res.end(`<html>
                <h1>Overview Lara Email Notifications:</h1>
                <p>Temlates without personalisation. Fields like "{{ FIRSTNAME }}" will be replaced with user data.</p>
                <ul>
                  <li><a href="/error">error</a></li>
                  <li><a href="/reportExport">reportExport</a></li>
                  <li><a href="/acceptReport">acceptReport</a></li>
                  <li><a href="/needChanges">needChanges</a></li>
                  <li><a href="/deleteYourTrainee">deleteYourTrainee</a></li>
                  <li><a href="/deleteAccount">deleteAccount</a></li>
                  <li><a href="/deleteUser">deleteUser</a></li>
                  <li><a href="/reportInReview">reportInReview</a></li>
                  <li><a href="/paperBriefing">paperBriefing</a></li>
                </ul>
              </html>`)
      break
  }
}

const server = http.createServer(requestListener)
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`)
})
