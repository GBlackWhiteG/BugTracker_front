<script setup>
import { onMounted, ref } from 'vue'
import { bugService } from '../services/bugServices'
import CreateBug from '@/components/CreateBug.vue'
import Bug from '../components/Bug.vue'

const bugs = ref([])

onMounted(async () => {
  const bugsData = await bugService.getBugs().then((res) => res)
  bugs.value = bugsData.data
})
</script>

<template>
  <main>
    <section class="bugs">
      <div>
        <h3>Создать баг</h3>
        <CreateBug />
      </div>
      <div>
        <h3>Список багов</h3>
        <ul class="bugs-list">
          <li v-for="bug in bugs" :key="bug.id">
            <Bug :bug="bug" />
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<style>
.bugs-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
</style>
