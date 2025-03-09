<script setup>
import { authService } from '@/services/authServices'
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const token = route.query.token
const email = route.query.email

const resetFormData = reactive({
  email: email || '',
  token: token || '',
  password: '',
  password_confirmation: '',
})

const formHandler = async () => {
  const response = await authService.resetPassword(resetFormData)
}
</script>

<template>
  <main>
    <section>
      <h1>Сбросить пароль</h1>
      <form @submit.prevent="formHandler">
        <input type="password" v-model="resetFormData.password" />
        <input type="password" v-model="resetFormData.password_confirmation" />
        <button type="submit">Сбросить пароль</button>
      </form>
    </section>
  </main>
</template>

<style scoped></style>