<template>
  <li v-if="comment" class="comment-item">
    <div class="comment-header">
      <div class="left">
        <template v-if="comment.author">
          <strong>{{ comment.author.login }}</strong>
          <span class="stars-inline">
            <span v-for="star in comment.rating" :key="star" class="star">⭐</span>
          </span>
        </template>
        <strong v-else>Удалённый пользователь</strong>
      </div>

      <div class="right" v-if="isAuthor(comment)">
        <span class="icon" @click="$emit('edit', comment)">✏️</span>
        <span class="icon" @click="$emit('delete', comment.id)">🗑️</span>
      </div>
    </div>

    <div v-if="editingComment?.id === comment.id">
      <div class="star-rating">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{ filled: star <= editingComment.rating }"
          @click="editingComment.rating = star"
        >★</span>
      </div>
      <textarea v-model="editingComment.text" rows="3" />
      <div class="edit-actions">
        <button @click="$emit('save', editingComment)">Сохранить</button>
        <button @click="$emit('cancel')">Отмена</button>
      </div>
    </div>
    <p v-else>{{ comment.text }}</p>

    <div v-if="comment.author" class="comment-actions">
      <button @click="toggleReplyForm">{{ showReplyForm ? 'Отмена' : 'Ответить' }}</button>
    </div>

    <div v-if="showReplyForm" class="reply-form">
      <div class="star-rating">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{ filled: star <= replyRating }"
          @click="replyRating = star"
        >★</span>
      </div>
      <textarea v-model="replyText" rows="2" placeholder="Ваш ответ..." />
      <button @click="submitReply">Отправить</button>
    </div>

    <ul v-if="getChildren(comment.id).length">
      <CommentItem
        v-for="child in getChildren(comment.id)"
        :key="child.id"
        :comment="child"
        :get-children="getChildren"
        :is-author="isAuthor"
        :format-date="formatDate"
        :editing-comment="editingComment"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @reply="$emit('reply', $event)"
        @save="$emit('save', $event)"
        @cancel="$emit('cancel')"
      />
    </ul>
  </li>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  comment: Object,
  getChildren: Function,
  isAuthor: Function,
  formatDate: Function,
  editingComment: Object
})

const emit = defineEmits(['edit', 'delete', 'reply', 'save', 'cancel'])

const showReplyForm = ref(false)
const replyText = ref('')
const replyRating = ref(5)

const toggleReplyForm = () => {
  showReplyForm.value = !showReplyForm.value
  replyText.value = ''
  replyRating.value = 5
}

const submitReply = () => {
  if (!replyText.value.trim()) return
  emit('reply', {
    reply_to: props.comment.id,
    text: replyText.value,
    rating: replyRating.value
  })
  toggleReplyForm()
}
</script>

<style scoped>
.comment-item {
  margin: 8px 0;
  padding-left: 10px;
  border-left: 1px solid #ccc;
}
.comment-header {
  display: flex;
  justify-content: space-between;
}
.icon {
  cursor: pointer;
  margin-left: 6px;
}
.stars-inline {
  margin-left: 6px;
  font-size: 1em;
}
.star.filled {
  color: gold;
}
.star {
  color: #ccc;
}
.edit-actions button {
  margin-right: 8px;
}
.comment-actions {
  margin-top: 4px;
}
.reply-form {
  margin-top: 8px;
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
