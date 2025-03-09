<script setup>
import { authService } from '@/services/authServices'
import { ref } from 'vue'

const email = ref('')

const formHandler = async () => {
  const response = authService.forgotPassword(email.value)
}
</script>

<template>
  <main>
    <section>
      <h1>Забыли пароль?</h1>
      <form @submit.prevent="formHandler">
        <input type="email" v-model="email" />
        <button type="submit">Сбросить пароль</button>
      </form>
    </section>
  </main>
</template>

<style scoped></style>