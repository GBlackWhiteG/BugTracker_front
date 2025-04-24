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
const isModalOpen = ref(false)

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
  role.value = await authService.me().then((res) => res.data.role)
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
      <div
        v-if="role === 'admin' || role === 'manager'"
        class="create-bug"
        :class="{ 'show-create-bug': isModalOpen }"
      >
        <CreateBug />
        <div class="arrow-block-wrapper">
          <div
            class="arrow-wrapper"
            :class="{ 'rotate-arrow': isModalOpen }"
            @click="isModalOpen = !isModalOpen"
          >
            <span></span>
          </div>
        </div>
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
                <option value="">Не выбрано</option>
                <option v-for="(value, key) in criticalityLabels" :value="key" :key="key">
                  {{ value }}
                </option>
              </select>
            </div>
            <div class="filter-item">
              <span>Статус</span>
              <select v-model="filters.status">
                <option value="">Не выбрано</option>
                <option v-for="(value, key) in statusLabels" :value="key" :key="key">
                  {{ value }}
                </option>
              </select>
            </div>
            <div class="filter-item">
              <span>Приоритетность</span>
              <select v-model="filters.priority">
                <option value="">Не выбрано</option>
                <option v-for="(value, key) in priorityLabels" :value="key" :key="key">
                  {{ value }}
                </option>
              </select>
            </div>
            <button
              @click="toggleCreatedSort"
              class="button button-sort"
              :class="filters.created_at !== 'desc' ? 'sort-top' : ''"
            >
              Дата создания
            </button>
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
  margin-top: 2rem;
}

.create-bug {
  max-width: 450px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
  border-top-right-radius: 3rem;
  border-bottom-right-radius: 3rem;
  background-color: #ffffff;
  padding-left: 2rem;
  padding-right: 4rem;
  padding-bottom: 13.8rem;
  transition: 0.3s ease-in-out;
  position: absolute;
  top: 0;
  left: -390px;
  z-index: 999;
}

.show-create-bug {
  left: 0;
}

.arrow-block-wrapper {
  position: relative;
}

.arrow-wrapper {
  position: absolute;
  top: 50%;
  right: -90px;
  transform: translateY(-50%);
  cursor: pointer;
}

.arrow-wrapper > span {
  width: 60px;
  height: 60px;
  display: block;
  position: relative;
}

.arrow-wrapper > span::before,
.arrow-wrapper > span::after {
  content: '';
  width: 3px;
  height: 25px;
  background-color: #000000;
  position: absolute;
  top: 30%;
  left: 65%;
  transform: translateY(-50%);
}

.arrow-wrapper > span::before {
  rotate: -45deg;
}

.arrow-wrapper > span::after {
  rotate: 225deg;
}

.rotate-arrow > span::before {
  left: 45%;
  rotate: 45deg;
}

.rotate-arrow > span::after {
  left: 45%;
  rotate: 135deg;
}

.bugs-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

.search {
  max-width: 400px;
  width: 100%;
}

.button-sort {
  border: 1px solid black;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
  transition: 0.3s;
  padding-right: 2rem;
  position: relative;
}

.button-sort:after {
  content: '>';
  rotate: 90deg;
  position: absolute;
  top: 40%;
  right: 15px;
  transform: translateX(-50%);
}

.button-sort:hover {
  transform: translateY(-5px);
}

.button-sort:active {
  transform: translateY(2px);
}

.sort-top {
  box-shadow: none;
}

.sort-top:hover {
  transform: none;
}

.sort-top:after {
  content: '>';
  rotate: 270deg;
  position: absolute;
  top: 15%;
  right: 15px;
  transform: translateX(-50%);
}
</style>
