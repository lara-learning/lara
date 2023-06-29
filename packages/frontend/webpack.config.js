// @ts-check

/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, no-undef */
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default
const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')
/* eslint-enable @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, no-undef */

// eslint-disable-next-line no-undef
const { GOOGLE_CLIENT_ID, USE_GOOGLE_LOGIN, DEBUG, AUTH_HEADER, BACKEND_URL, MODE, ENVIRONMENT_NAME, SUPPORT_MAIL } = process.env

const DEFAULT_ENVIRONMENT = 'development'
const DEFAULT_MODE = 'development'

/** @returns { { name: string; mode: string; debug: boolean; googleClientID: string; useGoogleLogin: boolean, authHeader: string; backendUrl: string; supportMail: string; } }} */
const getEnvironmentConfig = () => {
  // eslint-disable-next-line no-undef
  const name = ENVIRONMENT_NAME ?? DEFAULT_ENVIRONMENT

  // For local development we load the variables from .env file
  // eslint-disable-next-line no-undef
  const envVarsPath = path.resolve(__dirname, '../../.env')
  const { parsed } = dotenv.config({ path: envVarsPath })
  if (parsed) {
    return {
      name,
      mode: parsed.MODE,
      googleClientID: parsed.GOOGLE_CLIENT_ID,
      useGoogleLogin: parsed.USE_GOOGLE_LOGIN === 'false',
      debug: parsed.DEBUG === 'true',
      authHeader: parsed.AUTH_HEADER,
      backendUrl: parsed.BACKEND_URL,
      supportMail: parsed.SUPPORT_MAIL,
    }
  }

  // if running in CI/CD we load the variables from process.env.
  // The values are injected by Gitlab
  return {
    name,
    mode: MODE,
    googleClientID: GOOGLE_CLIENT_ID,
    useGoogleLogin: USE_GOOGLE_LOGIN === 'false',
    debug: DEBUG === 'true',
    authHeader: AUTH_HEADER,
    backendUrl: BACKEND_URL,
    supportMail: SUPPORT_MAIL,
  }
}

const tsLoaderOptions = {
  getCustomTransformers: () => ({ before: [createStyledComponentsTransformer()] }),
}

/**
 * @typedef {import('webpack').Configuration} WebPackConfiguration
 * @typedef {WebPackConfiguration & {devServer: {historyApiFallback: boolean}}} CustomWebPackConfiguration
 * @returns CustomWebPackConfiguration
 * */
const webpackConfig = () => {
  const environmentConfig = getEnvironmentConfig()

  return {
    mode: /** @type {"development" | "production" | "none"} */ (environmentConfig.mode) || DEFAULT_MODE,
    entry: './src/frontend.tsx',
    output: {
      filename: 'bundle.js',
      publicPath: '/',
    },
    resolve: {
      mainFields: ['browser', 'main', 'module'],
      extensions: ['.ts', '.tsx', '.js'],
    },
    devtool: 'source-map',
    devServer: {
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader'],
        },
        {
          test: /\.(tsx|ts)?$/,
          use: { loader: 'ts-loader', options: tsLoaderOptions },
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          loader: 'url-loader',
        },
        {
          test: /\.svg$/,
          loader: 'raw-loader',
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        ENVIRONMENT: JSON.stringify(getEnvironmentConfig()),
        // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
        REVISION: JSON.stringify(require(__dirname + '/scripts/get-revision')()),
        // eslint-disable-next-line no-undef
        TAG: JSON.stringify(process.env.LARA_VERSION),
        BUILD_DATE: JSON.stringify(new Date()),
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: './src/index.html',
        favicon: './src/favicon.png',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
  }
}

// eslint-disable-next-line no-undef
module.exports = webpackConfig
