import { instance } from './api'

class ProfileService {
  async getProfile(id) {
    return await instance
      .get(`/profile/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response)
  }
}

export const profileService = new ProfileService()
