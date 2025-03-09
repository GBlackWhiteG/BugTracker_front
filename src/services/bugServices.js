import { instance } from './api'

class BugService {
  async getBugs() {
    return await instance
      .get('/bugs')
      .then((res) => res.data)
      .catch((err) => err.response)
  }

  async getBug(id) {
    return await instance
      .get(`/bugs/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response)
  }

  async createBug(data) {
    return await instance
      .post('/bugs', data, {
        headers: { 'Content-Type': 'mutlipart/form-data' },
      })
      .then((res) => res)
      .catch((err) => err.response)
  }

  async deleteBug(id) {
    return await instance
      .delete(`/bugs/${id}`)
      .then((res) => res)
      .catch((err) => err.response)
  }
}

export const bugService = new BugService()
