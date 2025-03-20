<script setup>
import { bugService } from '@/services/bugServices'
import { reactive, ref, watch } from 'vue'
import { userService } from '@/services/userServices'

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

const responsibleUser = ref('')
const suggestions = ref([])

const selectSuggestion = (user) => {
  responsibleUser.value = user.nickname
  data.responsible_user_id = user.id
  suggestions.value = []
}

const findUserSuggestions = async (query) => {
  if (query == '') {
    suggestions.value = []
    data.responsible_user_id = ''
    return
  }

  if (data.responsible_user_id !== '') return

  const response = await userService.getUserSuggestions(query).then((res) => res.data)
  suggestions.value = response.data
}

let timeout
watch(responsibleUser, () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => findUserSuggestions(responsibleUser.value), 500)
})

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
    <label class="responsible-input">
      <input type="text" v-model="responsibleUser" placeholder="Ответственный (Никнейм)" />
      <ul v-if="suggestions.length" class="suggestions">
        <li
          v-for="sug in suggestions"
          :key="sug.id"
          class="suggestions-item"
          @click="selectSuggestion(sug)"
        >
          <div class="suggestions-item-content">
            <span>{{ sug.name }}</span>
            <span>{{ sug.nickname }}</span>
          </div>
        </li>
      </ul>
    </label>
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

.responsible-input {
  position: relative;
}

.responsible-input > input {
  width: 100%;
}

.suggestions {
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid #000000;
  border-radius: 0.25rem;
  background-color: #ffffff;
  padding: 1rem;
  position: absolute;
  bottom: 0;
  left: 50%;
  translate: -50% 110%;
}

.suggestions-item {
  border-bottom: 1px solid #000000;
  padding: 0.25rem;
  cursor: pointer;
}

.suggestions-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.suggestions-item-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>