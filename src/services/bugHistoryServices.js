import { instance } from './api'

class BugHistory {
  async getBugHistory(id) {
    return instance
      .get(`/bug-history/${id}`)
      .then((res) => res)
      .catch((err) => err.response)
  }
}

export const bugHistoryService = new BugHistory()
