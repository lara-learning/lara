import crypto from 'crypto'

import { User } from '@lara/api'

import { isDebug } from '../permissions'

const { OLD_COMPANY_NAME, NEW_COMPANY_NAME, AVATAR_URL } = process.env

// TODO REMOVE THIS WITH AN OWN AVATAR UPLOAD
const getAvatarURL = (emailHash: string, size?: number): string => {
  return size ? `${AVATAR_URL}${emailHash}?s=${size}` : `${AVATAR_URL}${emailHash}`
}

/**
 * Creates the username from the first and lastname
 * @param user User to generate username
 * @returns username string
 */
export const username = (user: Pick<User, 'firstName' | 'lastName'>): string =>
  `${user.firstName.slice(0, 3)}${user.lastName.slice(0, 3)}`.toLowerCase()

/**
 * Creates the company avatar url
 * @param user User to get avatar from
 * @returns URL of the avatar
 */
export const avatar = (user: Pick<User, 'email'>): string => {
  if (isDebug() || !AVATAR_URL) {
    return `https://api.dicebear.com/9.x/identicon/svg?seed=${user.email}.`
  }

  const email =
    OLD_COMPANY_NAME && NEW_COMPANY_NAME
      ? user.email.toLowerCase().replace(OLD_COMPANY_NAME, NEW_COMPANY_NAME)
      : user.email.toLowerCase()
  const emailHash = crypto.createHash('md5').update(email).digest('hex').toLowerCase()

  return getAvatarURL(emailHash, 300)
}
