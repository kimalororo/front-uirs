<template>
  <div class="profile-page">
    <!-- Шапка профиля -->
    <div class="profile-header glass">
      <div class="header-left">
        <img src="../components/icons/mater.png" alt="Avatar" class="avatar" />
        <div>
          <h1 class="name">{{ user.name || user.login }}</h1>
          <p class="subtitle">{{ user.email }}</p>
        </div>
      </div>
      <div class="header-right">
        <MyButton variant="outline" color="dark" @click="toggleLoginForm">Изменить логин</MyButton>
        <MyButton variant="outline" color="dark" @click="togglePasswordForm">Сменить пароль</MyButton>
        <MyButton variant="outline" color="danger" @click="logout">Выйти</MyButton>
        <MyButton variant="filled" color="danger" @click="deleteUser">Удалить аккаунт</MyButton>
      </div>
    </div>

    <!-- Формы редактирования -->
    <transition name="fade">
      <div v-if="showLoginForm" class="form glass">
        <h2>Изменить логин</h2>
        <input v-model="newLogin" placeholder="Новый логин" />
        <div class="form-actions">
          <MyButton variant="outline" color="dark" @click="updateLogin">Сохранить</MyButton>
          <MyButton variant="outline" color="danger" @click="cancelForms">Отмена</MyButton>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="showPasswordForm" class="form glass">
        <h2>Сменить пароль</h2>
        <input v-model="currentPassword" type="password" placeholder="Старый пароль" />
        <input v-model="newPassword" type="password" placeholder="Новый пароль" />
        <div class="form-actions">
          <MyButton variant="outline" color="dark" @click="changePassword">Сменить</MyButton>
          <MyButton variant="outline" color="danger" @click="cancelForms">Отмена</MyButton>
        </div>
      </div>
    </transition>

    <!-- Статистика рецептов -->
    <div class="stats glass">
      <div class="stat">
        <div class="stat-value">{{ stats.published }}</div>
        <div class="stat-label">рецептов опубликовано</div>
      </div>
      <div class="stat">
        <div class="stat-value">{{ stats.liked }}</div>
        <div class="stat-label">рецептов понравилось</div>
      </div>
      <div class="stat">
        <div class="stat-value">{{ stats.drafts }}</div>
        <div class="stat-label">черновиков рецептов</div>
      </div>
    </div>

    <section class="projects">
  <h2><strong>Рецепты</strong></h2>

  <!-- Новые разделы -->
  <div class="recipe-overview">
    <div class="overview-card" @click="$router.push('/likedList')">
      <img src="../components/icons/savedRecipes.jpg" alt="Сохраненные рецепты" />
      <div class="overview-title">Сохранённые рецепты</div>
    </div> 
    <div class="overview-card" @click="$router.push('/createdList')">
      <img src="../components/icons/createdRecipes.jpg" alt="Созданные рецепты" />
      <div class="overview-title">Созданные рецепты</div>
    </div>
  </div>
  </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const token = localStorage.getItem('token')

// Данные пользователя и формы
const user = ref({})
const showLoginForm = ref(false)
const showPasswordForm = ref(false)
const newLogin = ref('')
const currentPassword = ref('')
const newPassword = ref('')

// Рецепты и статистика
const stats = ref({ published: 0, liked: 0, drafts: 0 })

// Axios-инстансы
const api = axios.create({ baseURL: 'https://mandrikov-ad.ru:8443/api/v1/user', headers: { Authorization: token } })
const updLoginApi = axios.create({ baseURL: 'https://mandrikov-ad.ru:8443/api/v1/user', headers: { 'Content-Type': 'multipart/form-data', Authorization: token } })
const updPasswordApi = axios.create({ baseURL: 'https://mandrikov-ad.ru:8443/api/v1/user/change-password', headers: { Authorization: token } })
const apiMyRecipes = axios.create({ baseURL: 'https://mandrikov-ad.ru:8443/api/v1/recipe/my', headers: { Authorization: token }})
const apiAllRecipes = axios.create({ baseURL: 'https://mandrikov-ad.ru:8443/api/v1/recipe', headers: { Authorization: token }})

const fetchUser = async () => {
  try {
    const { data } = await api.get('')
    user.value = data
  } catch (e) {
    console.error('Ошибка загрузки пользователя:', e)
  }
}

async function fetchStats() {
  try {
    // 1) Опубликованные рецепты пользователя
    const resPub = await apiMyRecipes.get('', {
      params: { is_published: true, page: 1, limit: 10 }
    })
    stats.value.published = resPub.data.results
    
    // 2) Черновики пользователя
    const resDraft = await apiMyRecipes.get('', {
      params: { is_published: false, page: 1, limit: 1 }
    })
    stats.value.drafts = resDraft.data.results
    
    // 3) Понравившиеся (все рецепты, которые лайкнул пользователь)
    const resLiked = await apiAllRecipes.get('', {
      params: { liked: true, page: 1, limit: 1 }
    })
    stats.value.liked =resLiked.data.results
  } catch (e) {
    console.error('Не удалось получить статистику рецептов:', e)
  }
}


// Действия пользователей
const toggleLoginForm    = () => { showLoginForm.value = !showLoginForm.value; showPasswordForm.value = false }
const togglePasswordForm = () => { showPasswordForm.value = !showPasswordForm.value; showLoginForm.value = false }
const cancelForms        = () => { showLoginForm.value = false; showPasswordForm.value = false; newLogin.value = ''; currentPassword.value = ''; newPassword.value = '' }

const updateLogin = async () => {
  const login = newLogin.value && newLogin.value.trim() 
  if (login) {
    try {
      await updLoginApi.patch('', { login: newLogin.value })
      await fetchUser()
      cancelForms()
    } catch (e) {
      console.error('Ошибка изменения логина:', e)
    }
  }
  else
  window.alert("Нельзя оставить логин пустым")
}

const changePassword = async () => {
  try {
    await updPasswordApi.post('', null, { params: { current_password: currentPassword.value, new_password: newPassword.value } })
    cancelForms()
  } catch (e) {
    console.error('Ошибка смены пароля:', e)
  }
}

const deleteUser = async () => {
  try {
    await api.delete('')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  } catch (e) {
    console.error('Ошибка удаления аккаунта:', e)
  }
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/auth')
}

onMounted(async() => {
  if (token) {
    await fetchStats()
    await fetchUser()
  }
  else {
    router.push('/auth')
  }
})
</script>

<style scoped>
.profile-page {
  --glass-bg: rgba(255, 255, 255, 0.2);
  --glass-border: rgba(255, 255, 255, 0.3);
  --glass-shadow: rgba(0, 0, 0, 0.2);
  --btn-gray: #7f8c8d;
  --btn-gray-hover: #666;
  --btn-danger: #e74c3c;
  --btn-danger-hover: #c0392b;
  --btn-yellow: #f39c12;
  --btn-yellow-hover: #d35400;

  max-width: 1200px;
  margin: 15px auto;
  padding: 0 20px;
  color: black;
  font-family: Arial, sans-serif;
}

.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  box-shadow: 0 8px 30px var(--glass-shadow);
}

/* Шапка профиля */
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-bottom: 20px;
}
.header-left {
  display: flex;
  align-items: center;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  margin-right: 16px;
}
.name {
  font-size: 28px;
  margin: 0;
}
.subtitle {
  font-size: 14px;
  margin: 4px 0 8px;
  opacity: 0.8;
}

/* Кнопки в шапке в строку */
.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
  overflow: visible;
}
.header-right button,
.header-right MyButton {
  margin: 0;
  font-size: 1rem;
}

/* Формы */
.form {
  padding: 20px;
  margin: 20px 0;
}
.form h2 {
  margin-bottom: 12px;
  font-size: 18px;
}
.form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 6px;
  outline: none;
  font-size: 14px;
}
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
  
  overflow: visible;
}
.form-actions button {
  display: flex;
  flex: 1;
  font-size: 1rem;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.form-actions .gray {
  background: var(--btn-gray);
  color: black;
}
.form-actions .gray:hover {
  background: var(--btn-gray-hover);
}

/* Статистика */
.stats {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  margin: 24px 0;
}
.stat {
  text-align: center;
}
.stat-value {
  font-size: 24px;
  font-weight: bold;
}
.stat-label {
  font-size: 14px;
  opacity: 0.8;
}

/* Сетка рецептов */
.projects {
  margin-bottom: 40px;
}
.projects h2 {
  color: #333;
  margin-bottom: 4px;
}
.projects-subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
}
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.project-img {
  width: 100%;
  display: block;
  transition: transform 0.3s;
}

.icon {
  font-size: 18px;
}

/* Переходы */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Блок с двумя разделами */
.recipe-overview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 16px 0 24px;
}

.overview-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 500px; 
  margin-bottom: 40px;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}

.overview-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .3s;
}

.overview-card:hover img {
  transform: scale(1.05);
}

.overview-title {
  position: absolute;
  top: 16px;
  left: 16px;
  color: #fff;
  font-size: 20px;
  text-shadow: 0 2px 6px rgba(0,0,0,0.6);
}

.overview-card {
  box-shadow:
    0 8px 12px rgba(0, 0, 0, 0.15),
    0 3px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;

}
.overview-card:hover {
  box-shadow:
    0 10px 14px rgba(0, 0, 0, 0.18),
    0 5px 6px rgba(0, 0, 0, 0.12);
    transform: translateY(-5px);
}

.overview-card::before,
.project-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40%; /* высота затемнения: 40% от высоты карточки */
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  pointer-events: none; /* чтобы не мешать кликам */
  z-index: 2;
}

.overview-title {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 3;
  color: #fff;
}

</style>
