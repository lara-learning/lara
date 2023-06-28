import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './app'
if (window.location.hash !== ''){
  console.log("hash found" + window.location.hash);
}
else
{
  ReactDOM.render(<App/>, document.getElementById('app'))
}

if (module.hot && ENVIRONMENT.debug) {
  module.hot.accept()
}
