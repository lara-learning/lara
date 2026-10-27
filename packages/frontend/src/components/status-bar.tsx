import React, { useState } from 'react'

import { StyledStatusBar } from '@lara/components'

const StatusBar: React.FunctionComponent = () => {
  const [hoverVisible, setHoverVisible] = useState(false)

  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'instant',
      })
    }, 100)
  }

  const handleMouseEnter = () => {
    scrollToBottom()
    setHoverVisible(true)
  }

  return (
    <StyledStatusBar
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHoverVisible(false)}
      open={hoverVisible}
      id="status-bar"
    >
      {ENVIRONMENT.name} @ {TAG} {REVISION} ({BUILD_DATE})
    </StyledStatusBar>
  )
}

export default StatusBar
