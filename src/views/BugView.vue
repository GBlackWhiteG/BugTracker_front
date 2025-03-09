<script setup>
import router from '@/router'
import { bugService } from '@/services/bugServices'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { criticalityLabels } from '../utils/labels'
import { statusLabels } from '../utils/labels'
import { priorityLabels } from '../utils/labels'
import Comment from '../components/Comment.vue'
import { commentService } from '../services/commentServices'

const route = useRoute()
const id = route.params.id

const bug = ref({})
onMounted(async () => {
  bug.value = await bugService.getBug(id).then((res) => res.data)
})

const deleteHandler = async (id) => {
  const response = await bugService.deleteBug(id).then((res) => {
    if (res.status === 200) {
      router.push('/')
    }
  })
}

const commentData = reactive({
  bug_id: id,
  comment: '',
})

const commentFormHandler = async (e) => {
  e.preventDefault()
  const response = commentService.addComment(commentData)
}
</script>

<template>
  <main>
    <section>
      <h1>{{ bug.title }}</h1>
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
      <div class="card-images-wrapper">
        <div v-for="file in bug.files" :key="file.id">
          <a :href="file.file_url">Файл</a>
        </div>
      </div>
      <button @click="deleteHandler(bug.id)">Удалить</button>
    </section>
    <section class="comments">
      <h4>Добавить комментарий</h4>
      <form @submit="commentFormHandler">
        <input type="hidden" v-model="commentData.bug_id" />
        <input type="text" v-model="commentData.comment" />
        <button type="submit">Отправить</button>
      </form>
      <h4>Комментарии:</h4>
      <ul class="comments-list" v-for="comment in bug.comments" :key="comment.id">
        <Comment :comment="comment" />
      </ul>
    </section>
  </main>
</template>

<style scoped>
</style>