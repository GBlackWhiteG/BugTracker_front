<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { userService } from '../services/userServices'

const route = useRoute()
const id = route.params.id

const profile = ref({})

onMounted(async () => {
  const profileData = await userService.getProfile(id).then((res) => res.data)
  profile.value = profileData
})
</script>

<template>
  <section class="profile">
    <div class="container">
      <h1>{{ profile.name }}</h1>
      <span>{{ profile.nickname }}</span>
    </div>
  </section>
</template>

<style scoped></style>