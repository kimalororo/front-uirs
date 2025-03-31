<template>
 <div v-if="user">
    <h1>Инфа о пользователе {{ user.login }}</h1>
    <button @click="deleteUser">Удалить пользователя</button>
    <my-input v-model="newLogin"/>
    <button @click="updateLogin">Обновить логин</button>
    <my-input v-model="currentPassword" placeholder = "старый пароль"/>
    <my-input v-model="newPassword" placeholder = "новый пароль"/>
    <button @click="changePassword">обновить пароль</button>
  </div>
  <div v-else>
    <p>Загрузка информации...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router';
const router = useRouter();

const newLogin = ref('')

const currentPassword = ref('')
const newPassword = ref('')

const user = ref(null)
const token = localStorage.getItem('token')

const api = axios.create({
    baseURL: 'https://petmeet.space:8443/api/v1/user',
    headers: { Authorization: token }
});

const updLoginApi = axios.create({
    baseURL: 'https://petmeet.space:8443/api/v1/user',
    headers: { 'Content-Type': 'multipart/form-data',
                Authorization: token }
});

const updPasswordApi = axios.create({
    baseURL: 'https://petmeet.space:8443/api/v1/user/change-password',
    headers: {Authorization: token}
});


const fetchUser = async () => {
  try {
    const response = await api.get('') // <--- исправлено
    console.log('Загруженные данные после обновления:', response.data)
    user.value = response.data
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error)
  }
}

const deleteUser = async () => {
  try {
    await api.delete('') 
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    user.value = null
    router.push('/').then(() => {
            window.location.reload();
    });
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error)
  }
}

const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    user.value = null 
    console.log('Выход выполнен')
}

const updateLogin = async () => {
    try {
        const response = await updLoginApi.patch('', {
            login: newLogin.value
        });
        console.log('Изменение логина успешно: ', response.data);
        await fetchUser();
        localStorage.setItem('user', JSON.stringify({
            username: response.data.login
    }));
        user.value.login = response.data.login
        logout()
        router.push('/auth').then(() => {
            window.location.reload();
        });
    }catch(error){
        console.error('Ошибка при изменении пользователя: ', error)
    }
}

const changePassword = async () => {
  try {
    const response = await updPasswordApi.post('', null, {
      params: {
        current_password: currentPassword.value,
        new_password: newPassword.value
      }
    });

    console.log('Пароль успешно изменён:', response.data);
  } catch (error) {
    console.error('Ошибка при смене пароля:', error.response?.data || error.message);
  }
};


onMounted(() => {
  if (token) {
    fetchUser()
  }
})
</script>

<style scoped>

</style>