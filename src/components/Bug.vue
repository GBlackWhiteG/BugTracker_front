<script setup>
import { criticalityLabels } from '../utils/labels'
import { statusLabels } from '../utils/labels'
import { priorityLabels } from '../utils/labels'

const props = defineProps({ bug: Object })
</script>

<template>
  <router-link class="card-router" :to="`/bugs/${bug.id}`">
    <div class="bug-card">
      <h4>{{ bug.title }}</h4>
      <p>{{ bug.description }}</p>
      <div class="card-info-wrapper">
        <div class="card-info">
          <span>Критичность:</span>
          <span>{{ criticalityLabels[bug.criticality] }}</span>
        </div>
        <div class="card-info">
          <span>Статус:</span>
          <span>{{ statusLabels[bug.status] }}</span>
        </div>
        <div class="card-info">
          <span>Приоритетность:</span>
          <span>{{ priorityLabels[bug.priority] }}</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.card-router {
  color: #000;
  text-decoration: none;
}

.bug-card {
  padding: 1rem;
  border: 1px solid #000000;
  border-radius: 0.25rem;
}

.card-info-wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.card-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>