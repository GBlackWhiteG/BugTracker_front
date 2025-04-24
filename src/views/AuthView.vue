<script setup>
import { reactive } from 'vue'
import { authService } from '../services/authServices'
import { useToast } from 'vue-toast-notification'

const $toast = useToast()

const loginData = reactive({
  email: '',
  password: '',
})

const registerData = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const loginHandler = async (e) => {
  e.preventDefault()
  const response = await authService.login(loginData).then((res) => {
    if (res.status === 200) {
      $toast.success('Успешно')
      return
    }

    $toast.error(res.data.error)
  })
}

const registerHandler = async (e) => {
  e.preventDefault()

  const data = await authService.register(registerData).then((res) => {
    if (res.status === 200) {
      $toast.success('Успешно')
      return
    }

    let errorMessage = ''
    for (const [field, error] of Object.entries(JSON.parse(res.data))) {
      errorMessage += `${field}: ${error}\n`
    }

    $toast.error(errorMessage)
  })
}
</script>

<template>
  <main class="center-main">
    <section class="auth">
      <div class="login">
        <h2>Вход</h2>
        <form @submit="loginHandler">
          <input type="email" v-model="loginData.email" placeholder="Email" />
          <input type="password" v-model="loginData.password" placeholder="Пароль" />
          <button type="submit" class="button button-blue">Войти</button>
        </form>
        <router-link :to="'/forgot-password'">Забыли пароль?</router-link>
      </div>
      <div class="register">
        <h2>Регистрация</h2>
        <form @submit="registerHandler">
          <input type="text" v-model="registerData.name" placeholder="Имя" />
          <input type="email" v-model="registerData.email" placeholder="Email" />
          <input type="password" v-model="registerData.password" placeholder="Пароль" />
          <input
            type="password"
            v-model="registerData.password_confirmation"
            placeholder="Подтвердите пароль"
          />
          <button type="submit" class="button button-green">Зарегистрироваться</button>
        </form>
      </div>
    </section>
  </main>
</template>

<style scoped>
.center-main {
  display: flex;
  height: 80vh;
  align-items: center;
  justify-content: center;
}

.auth {
  display: grid;
  grid-template-columns: repeat(2, 250px);
  gap: 2rem;
}

.login > form,
.register > form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login > form > input,
.register > form > input {
  padding: 0.25rem 0.5rem;
}
</style>
