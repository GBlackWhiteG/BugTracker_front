<script setup>
import { onMounted, getCurrentInstance, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { authService } from './services/authServices'

const id = ref()

onMounted(async () => {
  const response = await authService.me().then((res) => res.data)
  id.value = response.id
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
        <RouterLink :to="{ name: 'home' }">Home</RouterLink>
        <RouterLink v-if="id" :to="{ name: 'profile', params: { id } }">Profile</RouterLink>
        <RouterLink :to="{ name: 'auth' }">Auth</RouterLink>
        <button @click="logout">Выход</button>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.nav {
  display: flex;
  gap: 10px;
}
</style>
