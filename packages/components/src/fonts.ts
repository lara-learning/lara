import { createGlobalStyle } from 'styled-components'

export const Fonts = {
  primary:
    '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  secondary: '"Inter",sans-serif',
}

export const createGlobaleFonts = (inter: string) => {
  return createGlobalStyle`
    @font-face {
      font-family: Inter;
      src: url('${inter}') format('woff2');
    }

    * {
      font-family: ${Fonts.primary}
    }

    html {
      font-size: 62.5%;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `
}
