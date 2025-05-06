<script setup>
import { ref, watch } from 'vue'
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

const getBugHistory = async () => {
  const response = await bugHistoryService.getBugHistory(props.bug_id).then((res) => res.data)
  bugHistory.value = response.data
}

watch(() => props.bug_id, getBugHistory)

defineExpose({ getBugHistory })
</script>

<template>
  <ul class="bug-history">
    <li v-for="history in bugHistory" :key="history.id">
      <div>
        <div class="author">
          <p>
            {{ history.user.name }} (@{{ history.user.nickname }}) изменил(-а)
            {{ filedNames[history.field][0] }}
          </p>
        </div>
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
  gap: 0.5rem;
  margin-top: 1rem;
}

.bug-history > li {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
  padding: 1rem 1.5rem;
}

.history-value-wrapper {
  display: flex;
  justify-content: space-between;
}

.history-value {
  display: flex;
  flex-direction: column;
}
</style>