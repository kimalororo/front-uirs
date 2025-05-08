<template>
  <div class="comments-section">
    <h3>Комментарии</h3>

    <div class="comment-form" v-if="!editingComment">
      <h4>Добавить комментарий</h4>

      <!-- Блок рейтинга -->
      <div class="star-rating">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{ filled: star <= commentRating }"
          @click="commentRating = star"
        >★</span>
      </div>

      <textarea v-model="commentContent" rows="3" placeholder="Ваш комментарий..." />
      <button @click="submitComment">Отправить</button>
    </div>

    <div v-if="comments.length === 0">
      <p>Пока нет комментариев. Будьте первым!</p>
    </div>

    <ul class="comment-list">
      <CommentItem
        v-for="comment in rootComments"
        :key="comment.id"
        :comment="comment"
        :get-children="getChildComments"
        :is-author="isAuthor"
        :format-date="formatDate"
        :editing-comment="editingComment"
        @edit="startEditing"
        @delete="deleteComment"
        @reply="handleReply"
        @save="submitEdit"
        @cancel="cancelEditing"
      />
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import CommentItem from './CommentItem.vue'

const props = defineProps({ recipeId: Number })

const comments = ref([])
const commentContent = ref('')
const commentRating = ref(5)
const editingComment = ref(null)
const user = ref(null)

const API_HOST = 'https://mandrikov-ad.ru:8443'
const api = axios.create({
  baseURL: `${API_HOST}/api/v1/comment`,
  headers: {
    Authorization: `${localStorage.getItem('token')}`
  }
})

onMounted(() => {
  fetchComments()
  const savedUser = localStorage.getItem('user')
  if (savedUser) user.value = JSON.parse(savedUser)
})

const fetchComments = async () => {
  try {
    const res = await api.get(`/${props.recipeId}`)
    comments.value = res.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  } catch (e) {
    console.error('Ошибка загрузки комментариев:', e)
  }
}

const submitComment = async () => {
  if (!commentContent.value.trim() || commentRating.value < 1 || commentRating.value > 5) return
  try {
    await api.post(`/${props.recipeId}/`, {
      text: commentContent.value,
      rating: commentRating.value
    })
    commentContent.value = ''
    commentRating.value = 5
    await fetchComments()
  } catch (e) {
    console.error('Ошибка при отправке комментария:', e)
  }
}

const submitEdit = async (comment) => {
  try {
    await api.patch(`/${comment.id}`, {
      text: comment.text,
      rating: comment.rating
    })
    editingComment.value = null
    await fetchComments()
  } catch (e) {
    console.error('Ошибка при сохранении комментария:', e)
  }
}

const deleteComment = async (id) => {
  try {
    await api.delete(`/${id}`)
    await fetchComments()
  } catch (e) {
    console.error('Ошибка при удалении комментария:', e)
  }
}

const startEditing = (comment) => {
  editingComment.value = { ...comment }
}

const cancelEditing = () => {
  editingComment.value = null
}

const handleReply = async ({ reply_to, text, rating }) => {
  try {
    await api.post(`/${props.recipeId}/`, {
      text,
      rating,
      reply_to
    })
    await fetchComments()
  } catch (e) {
    console.error('Ошибка при отправке ответа:', e)
  }
}

const isAuthor = (comment) => {
  return user.value && comment.author?.login === user.value.username
}

const formatDate = (dateString) => new Date(dateString).toLocaleString('ru-RU', {
  day: 'numeric', month: 'long', year: 'numeric',
  hour: '2-digit', minute: '2-digit'
})

const getChildComments = (parentId) => {
  return comments.value.filter(c => c.reply_to === parentId)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
}

const rootComments = computed(() =>
  comments.value.filter(c => !c.reply_to)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
)
</script>

<style scoped>
.star-rating {
  margin-bottom: 0.5em;
}
.star {
  font-size: 1.5em;
  cursor: pointer;
  user-select: none;
  color: rgba(75, 75, 76, 0.534);
}
.star.filled {
  color: gold;
}
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
  font-size: 14px;
  transition: border 0.2s ease;
}

textarea:focus {
  border-color: #007BFF;
  outline: none;
}

button {
  margin-top: 6px;
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

</style>
