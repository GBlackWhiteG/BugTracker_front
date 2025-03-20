import { instance } from './api'

class UserService {
  async getProfile(id) {
    return await instance
      .get(`/profile/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response)
  }

  async getUserSuggestions(query) {
    return await instance
      .get(`/user-suggestions?query=${query}`)
      .then((res) => res)
      .catch((err) => err)
  }
}

export const userService = new UserService()
