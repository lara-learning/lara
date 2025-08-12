import { App } from './app'
import { createRoot } from 'react-dom/client'

const rootElement = document.getElementById('app')
if (rootElement) {
  const root = createRoot(rootElement)
  if (window.location.hash === '') {
    root.render(<App />)
  }
}

if (module.hot && ENVIRONMENT.debug) {
  module.hot.accept()
}
