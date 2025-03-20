<script setup>
import { userService } from '@/services/userServices'
import { reactive, ref, watch } from 'vue'
import { commentService } from '../services/commentServices'

const props = defineProps({ bug_id: Number })

const suggestions = ref([])

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

const findLastWord = () => {
  return commentData.comment.split(' ').pop()
}

const selectSuggestion = (nickname) => {
  const lastWord = findLastWord()
  commentData.comment = commentData.comment.replace(
    new RegExp(`${lastWord}(?!.*${lastWord})`),
    `@${nickname}`
  )
  suggestions.value = []
}

const regex = new RegExp('@[^ \t\n\r]+')
const findUserSuggestions = async () => {
  const lastWord = findLastWord()
  if (regex.test(lastWord)) {
    const response = await userService
      .getUserSuggestions(lastWord.substring(1))
      .then((res) => res.data)
    suggestions.value = response.data
  } else {
    suggestions.value = []
  }
}

let timeout
watch(
  commentData,
  () => {
    clearTimeout(timeout)
    timeout = setTimeout(findUserSuggestions, 500)
  },
  { deep: true }
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
    <label class="comment-input">
      <input type="text" v-model="commentData.comment" />
      <ul v-if="suggestions.length">
        <li
          v-for="sug in suggestions"
          :key="sug.id"
          @click="selectSuggestion(sug.nickname)"
          class="suggestions-item"
        >
          <div class="suggestions-item-content">
            <span>{{ sug.name }}</span>
            <span>{{ sug.nickname }}</span>
          </div>
        </li>
      </ul>
    </label>
    <input type="file" multiple @change="uploadFiles" />
    <button type="submit">Отправить</button>
  </form>
</template>

<style scoped>
.comment-input {
  position: relative;
}

.comment-input > ul {
  display: flex;
  flex-direction: column;
  position: absolute;
  background-color: #ffffff;
  border: 1px solid #000000;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  top: 100%;
  left: 0;
}

.suggestions-item {
  border-bottom: 1px solid #000000;
  padding: 0.5rem;
  cursor: pointer;
}

.suggestions-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.suggestions-item-content {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
</style>
