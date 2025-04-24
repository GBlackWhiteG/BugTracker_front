<script setup>
import { criticalityLabels } from '../utils/labels'
import { statusLabels } from '../utils/labels'
import { priorityLabels } from '../utils/labels'

const props = defineProps({ bug: Object })
</script>

<template>
  <router-link class="card-router" :to="`/bugs/${bug._id ?? bug._source.id}`">
    <div class="bug-card">
      <h4 class="title">{{ bug._source.title }}</h4>
      <p class="description">{{ bug._source.description }}</p>
      <div class="card-info-wrapper">
        <div class="card-info">
          <span>Критичность:</span>
          <span>{{ criticalityLabels[bug._source.criticality] }}</span>
        </div>
        <div class="card-info">
          <span>Статус:</span>
          <span>{{ statusLabels[bug._source.status] }}</span>
        </div>
        <div class="card-info">
          <span>Приоритетность:</span>
          <span>{{ priorityLabels[bug._source.priority] }}</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.card-router {
  color: #000;
  height: 100%;
  display: block;
  text-decoration: none;
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -moz-box;
  -moz-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-clamp: 1;
  box-orient: vertical;
}

.description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -moz-box;
  -moz-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  box-orient: vertical;
}

.bug-card {
  height: 100%;
  padding: 1rem;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
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