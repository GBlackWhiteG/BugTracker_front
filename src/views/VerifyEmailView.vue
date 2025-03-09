<script setup>
import { authService } from '@/services/authServices'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  const decodedUrl = decodeURIComponent(route.query.url)
  const match = decodedUrl.match(/\/email\/verify\/(\d+)\/([a-f0-9]+)/)

  if (!match) {
    console.error('Не удалось извлечь id и hash')
    return
  }

  const id = match[1]
  const hash = match[2]

  try {
    authService.verifyEmail(id, hash)
  } catch (error) {
    console.error(`Ошибка подтверждения, ${error}`)
  }
})
</script>

<template>
  <div></div>
</template>

<style scope>
</style>