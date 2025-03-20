<script setup>
import { onMounted, ref, watch } from 'vue'
import { bugService } from '../services/bugServices'
import { criticalityLabels } from '../utils/labels'
import { statusLabels } from '../utils/labels'
import { priorityLabels } from '../utils/labels'
import CreateBug from '@/components/CreateBug.vue'
import Bug from '../components/Bug.vue'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { authService } from '@/services/authServices'

const bugs = ref([])
const role = ref('')

window.Pusher = Pusher
window.Echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY || 'local',
  wsHost: import.meta.env.VITE_PUSHER_HOST || '127.0.0.1',
  wsPort: import.meta.env.VITE_PUSHER_PORT || 6001,
  forceTLS: false,
  disableStats: true,
  cluster: 'mt1',
  encrypted: false,
})

onMounted(async () => {
  role.value = authService.me().then((res) => res.data.role)
  const bugsData = await bugService
    .searchBugs(searchInput.value, { ...filters.value })
    .then((res) => res)

  bugs.value = bugsData.data.hits.hits

  window.Echo.channel('bugs').listen('BugCreated', (bug) => {
    bugs.value.unshift({ _source: bug })
  })
})

const searchInput = ref('')
const filters = ref({
  criticality: null,
  status: null,
  priority: null,
  created_at: 'desc',
})

const toggleCreatedSort = () => {
  filters.value.created_at = filters.value.created_at === 'desc' ? 'asc' : 'desc'
}

const searchBugs = async () => {
  const bugsData = await bugService
    .searchBugs(searchInput.value, { ...filters.value })
    .then((res) => res)

  bugs.value = bugsData.data.hits.hits
}

let timeout
watch(searchInput, () => {
  clearTimeout(timeout)
  timeout = setTimeout(searchBugs, 500)
})

watch(filters, searchBugs, { deep: true })
</script>

<template>
  <main>
    <section class="bugs">
      <div v-if="role === 'admin' || role === 'manager'">
        <h3>Создать баг</h3>
        <CreateBug />
      </div>
      <div>
        <h3>Список багов</h3>
        <div class="control-bar">
          <div class="search">
            <input type="search" v-model="searchInput" placeholder="Поиск" />
          </div>
          <div class="filters">
            <div class="filter-item">
              <span>Критичность</span>
              <select v-model="filters.criticality">
                <option v-for="(value, key) in criticalityLabels" :value="key" :key="key">
                  {{ value }}
                </option>
              </select>
            </div>
            <div class="filter-item">
              <span>Статус</span>
              <select v-model="filters.status">
                <option v-for="(value, key) in statusLabels" :value="key" :key="key">
                  {{ value }}
                </option>
              </select>
            </div>
            <div class="filter-item">
              <span>Приоритетность</span>
              <select v-model="filters.priority">
                <option v-for="(value, key) in priorityLabels" :value="key" :key="key">
                  {{ value }}
                </option>
              </select>
            </div>
            <button @click="toggleCreatedSort">Дата создания</button>
          </div>
        </div>
        <ul class="bugs-list">
          <li v-for="bug in bugs" :key="bug._id" class="bug">
            <Bug :bug="bug" />
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<style>
.bugs {
  display: flex;
  gap: 2rem;
}

.bugs-list {
  max-width: 750px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.control-bar {
  width: 100%;
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.control-bar input {
  width: 100%;
  padding: 0.5rem 0.75rem;
}

.filters {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  position: relative;
}

.filter-item > select {
  height: 100%;
}

.filter-item > span {
  position: absolute;
  top: -25px;
}

.bug {
  max-height: 186px;
  height: 100%;
}
</style>
