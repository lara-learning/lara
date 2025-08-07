import { createBrowserHistory, History } from 'history'

class AppHistory {
  public static getInstance(): History {
    if (!AppHistory.history) {
      AppHistory.history = createBrowserHistory()
    }
    return AppHistory.history
  }

  private static history: History
}

export default AppHistory
