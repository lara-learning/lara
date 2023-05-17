import { Page } from 'puppeteer-core'
import React from 'react'
import ReactServerDOM from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'

import { PrintPaperData, PrintReportData, PrintTranslations, PrintUserData } from '@lara/api'

import { PaperTemplate, Template } from './template'

export const renderComponent = (component: JSX.Element, styleSheet?: ServerStyleSheet): string => {
  let element = component

  if (styleSheet) {
    element = styleSheet.collectStyles(component)
  }

  return ReactServerDOM.renderToString(element)
}

export const createPage = (
  reportData: PrintReportData,
  userData: PrintUserData,
  translations: PrintTranslations
): string => {
  const styleSheet = new ServerStyleSheet()
  const htmlBody = renderComponent(<Template {...reportData} userData={userData} i18n={translations} />, styleSheet)

  return `<html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
      ${styleSheet.getStyleTags()}
    </head>

    ${htmlBody}
  </html>`
}

export const createPaperPage = (
  paperData: PrintPaperData,
  userData: PrintUserData,
  translations: PrintTranslations
): string => {
  const styleSheet = new ServerStyleSheet()
  const htmlBody = renderComponent(<PaperTemplate {...paperData} userData={userData} i18n={translations} />, styleSheet)

  return `<html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
      ${styleSheet.getStyleTags()}
    </head>

    ${htmlBody}
  </html>`
}

export const createPDF = async (
  reportData: PrintReportData,
  userData: PrintUserData,
  translations: PrintTranslations,
  page: Page
): Promise<Buffer | undefined> => {
  const templateString = createPage(reportData, userData, translations)

  await page.setContent(templateString, {
    waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
    timeout: 30000,
  })

  return page.pdf({ format: 'a4', printBackground: true })
}

export const createPaperPDF = async (
  paperData: PrintPaperData,
  userData: PrintUserData,
  translations: PrintTranslations,
  page: Page
): Promise<Buffer | undefined> => {
  const templateString = createPaperPage(paperData, userData, translations)

  await page.setContent(templateString, {
    waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
    timeout: 30000,
  })

  return page.pdf({ format: 'a4', printBackground: true })
}
