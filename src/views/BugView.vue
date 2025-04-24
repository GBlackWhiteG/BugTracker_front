<script setup>
import router from '@/router'
import { bugService } from '@/services/bugServices'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { criticalityLabels } from '../utils/labels'
import { statusLabels } from '../utils/labels'
import { priorityLabels } from '../utils/labels'
import Comment from '../components/Comment.vue'
import CreateComment from '../components/CreateComment.vue'
import BugHistory from '@/components/BugHistory.vue'
import { authService } from '@/services/authServices'
import { useToast } from 'vue-toast-notification'
import { File } from 'lucide-vue-next'

const $toast = useToast()
const route = useRoute()
const id = route.params.id

const bug = ref({})
const role = ref('')
onMounted(async () => {
  bug.value = await bugService.getBug(id).then((res) => res.data)
  role.value = await authService.me().then((res) => res.data.role)
})

const updateData = reactive({
  title: '',
  description: '',
  steps: '',
  files: [],
})

const selectedCriticality = ref('')
const selectedStatus = ref('')
const selectedPriority = ref('')

watch(bug, (newBug) => {
  selectedCriticality.value = newBug.criticality
  selectedStatus.value = newBug.status
  selectedPriority.value = newBug.priority
})

const isEditMode = ref(false)
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
  updateData.title = bug.value.title
  updateData.description = bug.value.description
  updateData.steps = bug.value.steps
}

const uploadFiles = (e) => {
  updateData.files = Array.from(e.target.files)
}

const updateHandler = async (id) => {
  const formData = new FormData()
  Object.entries(updateData).forEach(([key, item]) => {
    if (key === 'files') {
      item.forEach((file, index) => {
        formData.append(`files[${index}]`, file)
      })
    } else {
      formData.append(key, item)
    }
  })

  const response = bugService.updateBug(id, formData)
}

const updateFieldHandler = async (id, changeField, newValue) => {
  const response = bugService
    .updateBugsField(id, {
      change_field: changeField,
      new_value: newValue,
    })
    .then((res) => {
      if (res.status === 200) {
        $toast.success('Успешно обновлено')
      } else {
        let errorMessage = ''
        for (const [field, error] of Object.entries(JSON.parse(res.data))) {
          errorMessage += `${field}: ${error}\n`
        }

        $toast.error(errorMessage)
      }
    })
}

const deleteHandler = async (id) => {
  const response = await bugService.deleteBug(id).then((res) => {
    if (res.status === 200) {
      router.push('/')
      $toast.success('Успешно удалено')
    } else {
      let errorMessage = ''
      for (const [field, error] of Object.entries(JSON.parse(res.data))) {
        errorMessage += `${field}: ${error}\n`
      }

      $toast.error(errorMessage)
    }
  })
}

const deleteImageHandler = async (id) => {
  const response = await bugService.deleteBugsFile(id).then((res) => {
    if (res.status === 200) {
      router.push('/')
      $toast.success('Успешно удалено')
    } else {
      let errorMessage = ''
      for (const [field, error] of Object.entries(JSON.parse(res.data))) {
        errorMessage += `${field}: ${error}\n`
      }

      $toast.error(errorMessage)
    }
  })
}
</script>

<template>
  <main>
    <div class="bug-card">
      <section>
        <form v-if="isEditMode" @submit.prevent="updateHandler(bug.id)" class="bug-change-form">
          <input type="text" placeholder="Заголовок" v-model="updateData.title" />
          <textarea
            cols="30"
            rows="10"
            placeholder="Описание"
            v-model="updateData.description"
          ></textarea>
          <label class="bug-change-steps">
            <span>Шаги воспроизведения</span>
            <textarea cols="30" rows="10" v-model="updateData.steps"></textarea>
          </label>
          <input type="file" multiple @change="uploadFiles" />
          <button type="submit" class="button button-green">Сохранить</button>
        </form>
        <div v-if="!isEditMode" class="bug-info">
          <h1>{{ bug.title }}</h1>
          <p>{{ bug.description }}</p>
          <label>
            <span>Шаги воспроизведения:</span>
            <p>{{ bug.steps }}</p>
          </label>
        </div>
        <div class="card-files-wrapper">
          <div v-for="file in bug.files" :key="file.id" class="files">
            <a :href="file.file_url" target="_blank"><File />{{ file.name }}</a>
            <form @submit.prevent="deleteImageHandler(file.id)">
              <button v-if="isEditMode" type="submit">Удалить</button>
            </form>
          </div>
        </div>
        <div class="card-info-wrapper">
          <div class="card-info">
            <span>Критичность:</span>
            <select
              v-model="selectedCriticality"
              @change="updateFieldHandler(bug.id, 'criticality', selectedCriticality)"
            >
              <option v-for="(label, key) in criticalityLabels" :value="key" :key="key">
                {{ label }}
              </option>
            </select>
          </div>
          <div class="card-info">
            <span>Статус:</span>
            <select
              v-model="selectedStatus"
              @change="updateFieldHandler(bug.id, 'status', selectedStatus)"
            >
              <option v-for="(label, key) in statusLabels" :value="key" :key="key">
                {{ label }}
              </option>
            </select>
          </div>
          <div class="card-info">
            <span>Приоритетность:</span>
            <select
              v-model="selectedPriority"
              @change="updateFieldHandler(bug.id, 'priority', selectedPriority)"
            >
              <option v-for="(label, key) in priorityLabels" :value="key" :key="key">
                {{ label }}
              </option>
            </select>
          </div>
        </div>
        <div class="buttons">
          <button
            v-if="role === 'admin' || role === 'manager'"
            @click="toggleEditMode"
            class="button button-blue"
          >
            Изменить
          </button>
          <button
            v-if="role === 'admin' || role === 'manager'"
            @click="deleteHandler(bug.id)"
            class="button button-red"
          >
            Удалить
          </button>
        </div>
      </section>
      <section class="bug-history">
        <h4>История изменений (последние 3)</h4>
        <BugHistory :bug_id="bug.id" />
      </section>
    </div>
    <section class="comments">
      <h4>Добавить комментарий</h4>
      <CreateComment :bug_id="id" />
      <h4>Комментарии:</h4>
      <ul class="comments-list">
        <Comment v-for="comment in bug.comments" :key="comment.id" :comment="comment" />
      </ul>
    </section>
  </main>
</template>

<style scoped>
.bug-change-form,
.bug-change-steps {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bug-change-steps {
  gap: 0.25rem;
}

.bug-change-form input,
.bug-change-form textarea {
  padding: 0.5rem;
}

.bug-card {
  display: grid;
  grid-template-columns: 2fr 1fr;
  align-items: start;
  gap: 2rem;
  margin-top: 2rem;
}

.card-files-wrapper {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-info-wrapper {
  display: flex;
  gap: 2rem;
  margin: 1rem 0;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card-info > select {
  padding: 0.25rem 0.5rem;
}

.comments {
  margin-bottom: 3rem;
}

.comments > h4 {
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}

.bug-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.buttons {
  display: flex;
  gap: 1rem;
}
</style>