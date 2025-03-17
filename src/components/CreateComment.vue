<script setup>
import { reactive, watch } from 'vue'
import { commentService } from '../services/commentServices'

const props = defineProps({ bug_id: Number })

const commentData = reactive({
  bug_id: props.bug_id,
  comment: '',
  files: [],
})

watch(
  () => props.bug_id,
  (newBugId) => {
    commentData.bug_id = newBugId
  }
)

const uploadFiles = (e) => {
  commentData.files = Array.from(e.target.files)
}

const commentFormHandler = async (e) => {
  e.preventDefault()
  const formData = new FormData()
  Object.entries(commentData).forEach(([key, item]) => {
    if (key === 'files') {
      item.forEach((file, index) => {
        formData.append(`files[${index}]`, file)
      })
    } else {
      formData.append(key, item)
    }
  })

  const response = commentService.addComment(formData)
}
</script>

<template>
  <form @submit="commentFormHandler">
    <input type="hidden" v-model="commentData.bug_id" />
    <input type="text" v-model="commentData.comment" />
    <input type="file" multiple @change="uploadFiles" />
    <button type="submit">Отправить</button>
  </form>
</template>

<style scoped></style>
