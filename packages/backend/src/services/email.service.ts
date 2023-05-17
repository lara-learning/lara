import { Admin, EmailPayload, EmailTranslations, Mentor, Report, Trainee, Trainer, User } from '@lara/api'
import { invokeLambda } from '../aws/lambda'

import { t } from '../i18n'
import { isTrainee, isTrainer } from '../permissions'
import { allAdmins } from '../repositories/admin.repo'
import { traineeById } from '../repositories/trainee.repo'
import { trainerById } from '../repositories/trainer.repo'

const { STAGE, URL_ORIGIN } = process.env

const translations = (user: User): EmailTranslations =>
  t('email', user.language, {
    interpolation: {
      prefix: 'turnOff',
      suffix: 'turnOff',
    },
  })

const envLink = (path: string) => {
  const envDomain = STAGE === 'staging' ? 'staging.' : ''

  return `https://${envDomain}${URL_ORIGIN}${path}`
}

const trainerNotificationMailPayload = (receiver: Trainer, sender: Trainee, report: Report): EmailPayload => ({
  emailType: 'reportInReview',
  userData: {
    receiverEmail: receiver.email,
    receiverName: receiver.firstName,
    trainee: sender.firstName,
    buttonLink: envLink(`/reports/${sender.id}/${report.year}/${report.week}`),
    week: report.week.toString(),
  },
  translations: translations(receiver),
})

const traineeNoficationMailPayload = (receiver: Trainee, sender: Trainer, report: Report): EmailPayload => ({
  emailType: report.status === 'archived' ? 'acceptReport' : 'needChanges',
  userData: {
    receiverEmail: receiver.email,
    receiverName: receiver.firstName,
    trainer: sender.firstName,
    buttonLink: envLink(`/report/${report.year}/${report.week}`),
  },
  translations: translations(receiver),
})
/**
 * Sends notification by email depending on the status of a report
 * @param report
 * @param sender
 * @returns void
 */
export const sendNotificationMail = async (report: Report, sender: User): Promise<void> => {
  if (isTrainee(sender) && report.status === 'review') {
    const receiver = sender.trainerId && (await trainerById(sender.trainerId))
    if (!receiver || !receiver.notification) return

    await invokeLambda({
      payload: trainerNotificationMailPayload(receiver, sender, report),
      functionName: 'email',
    })
  }

  if (isTrainer(sender) && (report.status === 'reopened' || report.status === 'archived')) {
    const receiver = await traineeById(report.traineeId)
    if (!receiver || !receiver.notification) return

    await invokeLambda({
      payload: traineeNoficationMailPayload(receiver, sender, report),
      functionName: 'email',
    })
  }
}

// creates Payload for admin if a user will be deleted
export const adminDeletionMailPayload = (admin: Admin, user: Trainee | Trainer | Mentor): EmailPayload => {
  const link = isTrainee(user) ? envLink(`/trainees/${user.id}`) : envLink(`/trainer/${user.id}`)
  return {
    emailType: 'deleteUser',
    userData: {
      receiverEmail: admin.email,
      receiverName: admin.firstName,
      user: user.firstName + ' ' + user.lastName,
      buttonLink: link,
    },
    translations: translations(admin),
  }
}

// creates Payload for the trainer of the trainee that will be deleted
export const trainerDeletionMailPayload = (trainer: Trainer, user: Trainee): EmailPayload => {
  return {
    emailType: 'deleteYourTrainee',
    userData: {
      receiverEmail: trainer.email,
      receiverName: trainer.firstName,
      trainee: user.firstName + ' ' + user.lastName,
      buttonLink: envLink('/'),
    },
    translations: translations(trainer),
  }
}

// creates Payload for the user that will be deleted
export const userToDeleteDeletionMailPayload = (userToDelete: Trainee | Trainer | Mentor): EmailPayload => {
  return {
    emailType: 'deleteAccount',
    userData: {
      receiverEmail: userToDelete.email,
      receiverName: userToDelete.firstName,
      buttonLink: envLink('/'),
    },
    translations: translations(userToDelete),
  }
}

/**
 * Sends notification by mail to Admins and UserToDelete.
 * If UserToDelete is a Trainee the Trainer will be notified too.
 * @param userToDelete
 */
export const sendDeletionMail = async (userToDelete: Trainee | Mentor | Trainer): Promise<void> => {
  const admins = await allAdmins()

  // notify admins
  await Promise.all(
    admins.map((admin) => {
      return invokeLambda({
        payload: adminDeletionMailPayload(admin, userToDelete),
        functionName: 'email',
      })
    })
  )

  // notify trainer of trainee
  if (isTrainee(userToDelete)) {
    const trainer = userToDelete.trainerId && (await trainerById(userToDelete.trainerId))
    if (!trainer) {
      return
    }

    await invokeLambda({
      payload: trainerDeletionMailPayload(trainer, userToDelete),
      functionName: 'email',
    })
  }

  // notify user that will be deleted
  await invokeLambda({
    payload: userToDeleteDeletionMailPayload(userToDelete),
    functionName: 'email',
  })
}

/**
 * Sends notification by mail if a user activetes alexa account linking
 * @param user account that has been linked
 */
export const sendAlexaNotificationMail = async (user: User): Promise<void> => {
  if (!user.notification) {
    return
  }

  await invokeLambda({
    functionName: 'email',
    payload: {
      emailType: 'alexa',
      translations: translations(user),
      userData: {
        buttonLink: envLink('/settings'),
        receiverEmail: user.email,
        receiverName: user.firstName,
      },
    },
  })
}
