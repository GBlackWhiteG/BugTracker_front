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
    <input type="text" v-model="data.title" placeholder="Заголовок" />
    <textarea v-model="data.description" cols="30" rows="5" placeholder="Описание"></textarea>
    <div class="properties">
      <label>
        <span>Критичность</span>
        <select v-model="data.criticality">
          <option value="low">Низкая</option>
          <option value="medium">Средняя</option>
          <option value="high">Высокая</option>
          <option value="blocker">Блокирующая</option>
          <option value="critical">Критичная</option>
        </select>
      </label>
      <label>
        <span>Статус</span>
        <select v-model="data.status">
          <option value="new">Новая</option>
          <option value="work">В работе</option>
          <option value="test">Тестирование</option>
          <option value="closed">Завершена</option>
        </select>
      </label>
      <label>
        <span>Приоритет</span>
        <select v-model="data.priority">
          <option value="low">Низкая</option>
          <option value="medium">Средняя</option>
          <option value="high">Высокая</option>
        </select>
      </label>
    </div>
    <textarea v-model="data.steps" cols="30" rows="5" placeholder="Шаги воспроизведения"></textarea>
    <input type="number" v-model="data.responsible_user_id" placeholder="Ответственный" />
    <input type="file" multiple @change="uploadFiles" />

    <button type="submit">Создать</button>
  </form>
</template>

<style scoped>
.form {
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form input,
.form textarea,
form button {
  padding: 0.5rem 0.75rem;
}

.form textarea {
  resize: vertical;
}

.properties {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.25rem;
}

.properties select {
  width: 100%;
  font-size: 10px;
  padding: 0.25rem 0.5rem;
}
</style>