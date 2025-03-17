import { instance } from './api'

class BugService {
  async getBugs() {
    return await instance
      .get('/search')
      .then((res) => res.data)
      .catch((err) => err.response)
  }

  async searchBugs(query, filters) {
    const params = new URLSearchParams()

    if (query) params.append('query', query)

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value)
      }
    })
    return await instance
      .get(`/search?${params.toString()}`)
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

  async updateBug(id, data) {
    return await instance
      .post(`/bugs/${id}`, data, {
        headers: { 'Content-Type': 'mulipart/form-data' },
      })
      .then((res) => res)
      .catch((err) => err.response)
  }

  async updateBugsField(id, data) {
    return await instance
      .post(`/bugs/fields/${id}`, data)
      .then((res) => res)
      .catch((err) => err.response)
  }

  async deleteBug(id) {
    return await instance
      .delete(`/bugs/${id}`)
      .then((res) => res)
      .catch((err) => err.response)
  }

  async deleteBugsFile(id) {
    return await instance
      .delete(`/bugs/file/${id}`)
      .then((res) => res)
      .catch((err) => err.response)
  }
}

export const bugService = new BugService()
