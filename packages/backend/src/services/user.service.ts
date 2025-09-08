import crypto from 'crypto'

import { User } from '@lara/api'

async function hashEmail(email: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(email.toLowerCase().trim()) // normalize
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
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
export const avatar = async (user: Pick<User, 'email'>): Promise<string> => {
  return `https://api.dicebear.com/9.x/identicon/svg?seed=${await hashEmail(user.email)}.`
}
