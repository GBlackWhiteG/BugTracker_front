<script setup>
import { commentService } from '@/services/commentServices'
import { onMounted, reactive, ref, watch } from 'vue'
import DOMPurify from 'dompurify'
import { authService } from '@/services/authServices'

const props = defineProps({ comment: Object })

const updateData = reactive({
  comment: '',
  files: [],
})

const auth_user_id = ref()

onMounted(async () => {
  const response = await authService.me().then((res) => res)
  auth_user_id.value = response.data.id
})

watch(
  () => props.comment,
  (newComment) => {
    updateData.comment = newComment.comment
  },
  { immediate: true }
)

const isEditMode = ref(false)
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value

  if (isEditMode.value) {
    updateData.comment = props.comment.comment
  }
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

  const response = commentService.updateComment(id, formData)
}

const deleteHandler = async (id) => {
  const response = await commentService.deleteComment(id)
}

const deleteFileHandler = async (id) => {
  const response = await commentService.deleteCommentFile(id)
}
</script>

<template>
  <li class="comment">
    <div v-if="!isEditMode">
      <b>{{ comment.user.name }}</b>
      <p v-html="DOMPurify.sanitize(comment.comment)"></p>
    </div>
    <form v-if="isEditMode" @submit.prevent="updateHandler(comment.id)">
      <textarea cols="30" rows="10" v-model="updateData.comment"></textarea>
      <input type="file" multiple @change="uploadFiles" />
      <button type="submit">Сохранить</button>
    </form>
    <div v-for="file in comment.files" :key="file.id">
      <a :href="file.file_url" target="_blank">Файл</a>
      <form v-if="isEditMode" @submit.prevent="deleteFileHandler(file.id)">
        <button type="submit">Удалить</button>
      </form>
    </div>
    <button v-if="comment.user_id === auth_user_id" @click="toggleEditMode">Редактировать</button>
    <form v-if="comment.user_id === auth_user_id" @submit.prevent="deleteHandler(comment.id)">
      <button type="submit">Удалить</button>
    </form>
  </li>
</template>

<style scoped>
.comment {
  border: 1px solid #000000;
  border-radius: 0.25rem;
  padding: 1rem;
}
</style>