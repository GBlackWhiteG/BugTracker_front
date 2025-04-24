import { authService } from '../services/authServices'
import { registerData, $toast } from './AuthView.vue'

export const registerHandler = async (e) => {
  e.preventDefault()

  const data = await authService.register(registerData).then((res) => {
    console.log(res.data)
    if (res.status === 200) {
      $toast.success('Успешно')
      return
    }

    let errorMessage = ''
    // for (const [field, error] of Object.entries(res.data)) {
    //   console.log(field)
    //   console.log(error)
    //   errorMessage += `${field}: ${error}`
    // }
    $toast.error(errorMessage)
  })
}
