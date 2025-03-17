import { axiosClassic, instance } from './api'
import router from '@/router'

class AuthService {
  async login({ email, password }) {
    return await axiosClassic
      .post('/auth/login', { email, password })
      .then((res) => {
        localStorage.setItem('token', res.data.access_token)
        router.push('/')
        return res
      })
      .catch((err) => err.response)
  }

  async register({ name, email, password, password_confirmation }) {
    return await axiosClassic
      .post('/auth/register', { name, email, password, password_confirmation })
      .then((res) => res)
      .catch((err) => err.response)
  }

  async logout() {
    return await instance
      .post('/auth/logout')
      .then(() => {
        localStorage.removeItem('token')
        router.push('/auth')
      })
      .catch((err) => err.response)
  }

  async forgotPassword(email) {
    console.log(email)
    return await axiosClassic
      .post('/auth/forgot-password', { email })
      .then((res) => res)
      .catch((err) => err.response)
  }

  async resetPassword({ email, token, password, password_confirmation }) {
    return await axiosClassic
      .post('/auth/reset-password', { email, token, password, password_confirmation })
      .then((res) => res)
      .catch((err) => err.response)
  }

  async verifyEmail(id, hash) {
    return await axiosClassic
      .get(`/email/verify/${id}/${hash}`)
      .then((res) => res)
      .catch((err) => err.response)
  }
}

export const authService = new AuthService()
