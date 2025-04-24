<script setup>
import { onMounted, ref } from 'vue'
import { authService } from './services/authServices'

const isAuth = ref(false)
const id = ref(null)

onMounted(async () => {
  try {
    const response = await authService.me().then((res) => res.data)
    id.value = response.id
    isAuth.value = !!response.id
  } catch (err) {
    id.value = null
    isAuth.value = false
  }
})

const logout = () => {
  id.value = ''
  authService.logout()
}
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="nav">
        <RouterLink :to="{ name: 'home' }">Главная</RouterLink>
        <RouterLink v-if="isAuth" :to="{ name: 'profile', params: { id } }">Профиль</RouterLink>
        <RouterLink :to="{ name: 'auth' }" v-if="!isAuth">Auth</RouterLink>
        <button v-if="isAuth" @click="logout">Выход</button>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.nav {
  max-width: 750px;
  display: flex;
  justify-content: center;
  gap: 2rem;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
  padding: 0.5rem;
  margin: 0 auto;
}

.nav > a,
.nav > button {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.nav > button {
  font-size: 15px;
  background-color: transparent;
  border: none;
  padding: 0;
}
</style>
