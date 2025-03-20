<script setup>
import { ref, onMounted, watch } from 'vue'
import { bugHistoryService } from '../services/bugHistoryServices'
import { criticalityLabels } from '../utils/labels'
import { statusLabels } from '../utils/labels'
import { priorityLabels } from '../utils/labels'

const props = defineProps({ bug_id: Number })

const bugHistory = ref([])

const filedNames = {
  criticality: ['Критичность', criticalityLabels],
  status: ['Статус', statusLabels],
  priority: ['Приоритетность', priorityLabels],
}

watch(
  () => props.bug_id,
  async () => {
    const response = await bugHistoryService.getBugHistory(props.bug_id).then((res) => res.data)
    bugHistory.value = response.data
  }
)
</script>

<template>
  <ul class="bug-history">
    <li v-for="history in bugHistory" :key="history.id">
      <div>
        <div class="author">
          <span>{{ history.user.name }}</span>
          <span>{{ history.user.nickname }}</span>
        </div>
        <span>{{ filedNames[history.field][0] }}</span>
      </div>
      <div class="history-value-wrapper">
        <div class="history-value">
          <span>Было</span>
          <span>{{ filedNames[history.field][1][history.old_value] }}</span>
        </div>
        <div class="history-value">
          <span>Стало</span>
          <span>{{ filedNames[history.field][1][history.new_value] }}</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.bug-history {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.bug-history > li {
  display: flex;
  justify-content: space-between;
}

.bug-history > li > div {
  border: 1px solid #000000;
  padding: 0.5rem;
}

.author {
  display: flex;
  gap: 1rem;
}

.history-value-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 150px);
}

.history-value {
  display: flex;
  flex-direction: column;
}
</style>