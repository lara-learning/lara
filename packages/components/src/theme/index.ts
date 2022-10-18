import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    // Basics
    header: string
    surface: string
    background: string
    supportIcon: string
    progressBar: string
    overlay: string
    faq: string

    // Fonts
    darkFont: string
    mediumFont: string
    lightFont: string
    blueFont: string
    placeholder: string
    headerFont: string

    buttonPrimaryFont: string

    buttonSecondaryDefault: string
    buttonSecondaryDisabled: string
    buttonSecondaryHovered: string
    buttonSecondaryPressed: string

    buttonSecondaryDangerDefault: string
    buttonSecondaryDangerHovered: string
    buttonSecondaryDangerPressed: string

    buttonSecondaryGhostDefault: string
    buttonSecondaryGhostDisabled: string
    buttonSecondaryGhostHovered: string
    buttonSecondaryGhostPressed: string

    buttonSecondaryDangerGhostDefault: string
    buttonSecondaryDangerGhostHoverd: string
    buttonSecondaryDangerGhostPressed: string

    // Buttons
    primaryDefault: string
    primaryDisabled: string
    primaryHovered: string
    primaryPressed: string

    primaryDangerDefault: string
    primaryDangerDisabled: string
    primaryDangerHovered: string
    primaryDangerPressed: string

    buttonSecondaryFont: string

    secondaryDefault: string
    secondaryDisabled: string
    secondaryHovered: string
    secondaryPressed: string

    buttonSecondaryDangerFont: string

    secondaryDangerDefault: string
    secondaryDangerDisabled: string
    secondaryDangerHovered: string
    secondaryDangerPressed: string

    // Inputs
    inputBackground: string
    inputBorderEmpty: string
    inputBorderError: string
    inputBorderActive: string
    inputBorderSaved: string

    // Icons
    iconWhite: string
    iconLightGrey: string
    iconDarkGrey: string
    iconBlue: string
    greenDark: string
    greenTransparent: string
    redDark: string
    redTransparent: string

    // Signal
    successGreen: string
    successNotificationBackgroundGreen: string
    errorRed: string
    errorNotificationBackgroundRed: string

    // Logo
    logoBlack: string
    logoWhite: string
    logoPurple: string
    logoPink: string
    logoWhiteTransparent: string

    // Report
    reportGrey: string

    //Suggestion
    activeSuggestionBackground: string

    // Dev only
    warningYellow: string
  }
}
export * from './dark-theme'
export * from './light-theme'
