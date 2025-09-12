import { User } from '@lara/api'

/**
 * Creates the username from the first and lastname
 * @param user User to generate username
 * @returns username string
 */
export const username = (user: Pick<User, 'firstName' | 'lastName'>): string =>
  `${user.firstName.slice(0, 3)}${user.lastName.slice(0, 3)}`.toLowerCase()
