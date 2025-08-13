import { App } from './app'
import { createRoot, Root } from 'react-dom/client'

declare global {
  interface Window {
    __root?: Root
  }
}

const rootElement = document.getElementById('app')
if (rootElement) {
  if (!window.__root) {
    window.__root = createRoot(rootElement)
  }
  window.__root.render(<App />)
}

if (module.hot && ENVIRONMENT.debug) {
  module.hot.accept()
}
