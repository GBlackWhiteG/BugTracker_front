<script setup>
import { reactive } from 'vue'
import { authService } from '../services/authServices'

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
  const response = await authService.login(loginData)
}

const registerHandler = async (e) => {
  e.preventDefault()
  const data = await authService.register(registerData)
}
</script>

<template>
  <main>
    <section>
      <div class="login">
        <h2>Вход</h2>
        <form @submit="loginHandler">
          <input type="email" v-model="loginData.email" />
          <input type="password" v-model="loginData.password" />
          <button type="submit">Войти</button>
        </form>
        <router-link :to="'/forgot-password'">Забыли пароль?</router-link>
      </div>
      <div class="register">
        <h2>Регистрация</h2>
        <form @submit="registerHandler">
          <input type="text" v-model="registerData.name" />
          <input type="email" v-model="registerData.email" />
          <input type="password" v-model="registerData.password" />
          <input type="password" v-model="registerData.password_confirmation" />
          <button type="submit">Зарегистрироваться</button>
        </form>
      </div>
    </section>
  </main>
</template>

<style scoped>
</style>
