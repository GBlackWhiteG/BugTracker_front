<script setup>
const props = defineProps({ comment: Object })
</script>

<template>
  <li>
    <p>{{ comment.comment }}</p>
  </li>
</template>

<style scoped>
</style>