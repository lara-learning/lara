<!-- deprecated -->

# Technical Information

This page contains information about the techstack used for this frontend prohject. Further, there are links to corresponding documenation.

## Webpack (Module Bundler)

To compile this project and to provide a developer-friendly environment we use webpack as a module bundler. There are two configuration files for wepack:

1. `webpack.config.js`: The configuration for the devserver and build process
2. `webpack.patternplate.js`: This is the configuration to ensure compatibility of patternplate and our techstack.

### Commands

- `yarn start`: Starts the webpack dev server on port `:8080`.
- `yarn patternplate`: Starts a webpack compiler in watcher mode and serves patternplate via `:1337`.
- `yarn build`: Builds the application for static use.

### Proxy

All requests to `/api` are redirected to `http://localhost:3000/`. Note that the `api` prefix is missing at the redirected url!

## React

React is used as main frontend library for this project. The styling is done with styled-components.

### Apollo GraphQL

The graphql library used to query the graphql endpoint at our api. Uses an local state management to update ui based on request data.
