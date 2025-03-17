import axios from 'axios'
import router from '@/router'

const options = {
  baseURL: 'http://localhost:8876/api',
  withCredentials: true,
}

export const axiosClassic = axios.create(options)

export const instance = axios.create(options)

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (config.headers && token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const response = await instance.post('/auth/refresh').then((res) => res)
        localStorage.setItem('token', response.data.access_token)
        return instance(error.response.request)
      } catch (error) {
        localStorage.removeItem('token')
        router.push('/auth')
        return Promise.reject(error)
      }
    }
  },
)
