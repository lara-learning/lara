import fetch from 'node-fetch'

const { GOOGLE_API_KEY } = process.env
if (!GOOGLE_API_KEY) {
  throw new Error("Missing Environment Variable: 'GOOGLE_API_KEY'")
}

export const validateToken = async (token: string): Promise<string> => {
  const url = 'https://www.googleapis.com/oauth2/v2/tokeninfo'
  const params = `?key=${GOOGLE_API_KEY}&access_token=${token}`

  return fetch(url + params)
    .then((res) => res.json())
    .then((json) => json.email)
}
