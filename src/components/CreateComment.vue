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
  <form @submit="commentFormHandler" class="comment-form">
    <input type="hidden" v-model="commentData.bug_id" />
    <label class="comment-input">
      <input
        type="text"
        v-model="commentData.comment"
        placeholder="Можно упомянуть пользователя, написав @a... (появятся предложения)"
      />
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
    <label class="files-input-wrapper">
      <div>
        <span>{{ commentData.files.length || '+' }}</span>
      </div>
      <input type="file" multiple @change="uploadFiles" />
    </label>
    <button type="submit" class="button button-green">Отправить</button>
  </form>
</template>

<style scoped>
.comment-form {
  display: flex;
  gap: 1rem;
}

.comment-input {
  max-width: 600px;
  width: 100%;
  position: relative;
}

.comment-input > input {
  width: 100%;
  padding: 0.5rem;
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

.files-input-wrapper {
  width: 100%;
  max-width: 35px;
  height: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}

.files-input-wrapper > input {
  display: none;
}

.files-input-wrapper > div {
  width: 100%;
  height: 100%;
  border: 1px solid black;
  border-radius: 3px;
}

.files-input-wrapper > div > span {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>
