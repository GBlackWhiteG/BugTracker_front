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
  <main class="center-main">
    <section class="auth">
      <div class="login">
        <h2>Вход</h2>
        <form @submit="loginHandler">
          <input type="email" v-model="loginData.email" placeholder="Email" />
          <input type="password" v-model="loginData.password" placeholder="Пароль" />
          <button type="submit">Войти</button>
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
          <button type="submit">Зарегистрироваться</button>
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
</style>
