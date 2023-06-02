import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './app'

ReactDOM.render(<App />, document.getElementById('app'))

if (module.hot && ENVIRONMENT.debug) {
  module.hot.accept()
}
