<script setup>
import { bugService } from '@/services/bugServices'
import { reactive } from 'vue'

const data = reactive({
  title: '',
  description: '',
  criticality: 'low',
  priority: 'low',
  status: 'new',
  steps: '',
  responsible_user_id: '',
  files: [],
})

const uploadFiles = (e) => {
  data.files = Array.from(e.target.files)
}

const formHandler = async (e) => {
  e.preventDefault()
  const formData = new FormData()
  Object.entries(data).forEach(([key, item]) => {
    if (key === 'files') {
      item.forEach((file, index) => {
        formData.append(`files[${index}]`, file)
      })
    } else {
      formData.append(key, item)
    }
  })

  const response = await bugService
    .createBug(formData)
    .then((res) => res)
    .catch((err) => err.response)
}
</script>

<template>
  <form @submit="formHandler" class="form">
    <input type="text" v-model="data.title" />
    <textarea v-model="data.description" cols="30" rows="10"></textarea>
    <select v-model="data.criticality">
      <option value="low">Низкая</option>
      <option value="medium">Средняя</option>
      <option value="high">Высокая</option>
      <option value="blocker">Блокирующая</option>
      <option value="critical">Критичная</option>
    </select>
    <select v-model="data.priority">
      <option value="low">Низкая</option>
      <option value="medium">Средняя</option>
      <option value="high">Высокая</option>
    </select>
    <select v-model="data.status">
      <option value="new">Новая</option>
      <option value="work">В работе</option>
      <option value="test">На тестировании</option>
      <option value="closed">Завершена</option>
    </select>
    <textarea v-model="data.steps" cols="30" rows="10"></textarea>
    <input type="file" multiple @change="uploadFiles" />
    <input type="number" v-model="data.responsible_user_id" />

    <button type="submit">Создать</button>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: start;
}
</style>