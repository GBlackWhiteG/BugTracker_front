<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { authService } from './services/authServices'

const logout = () => {
  authService.logout()
}
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/auth">Auth</RouterLink>
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
