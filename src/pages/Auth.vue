<template>
    <div class="container" :class="{ active: isRegistering }">
      <div class="form-box login">
        <form @submit.prevent="handleLogin">
          <h1>Вход</h1>
          <div class="input-box">
            <input v-model="loginUsername" type="text" placeholder="Логин" required />
            <i class="bx bxs-user"></i>
          </div>
          <div class="input-box">
            <input v-model="loginPassword" type="password" placeholder="Пароль" required />
            <i class="bx bxs-lock-alt"></i>
          </div>
          <button type="submit" class="btn">Войти</button>
          <div class="forgot-link">
            <br>
            <a href="#">Забыли пароль?</a>
          </div>
        </form>
      </div>
  
      <div class="form-box register">
        <form @submit.prevent="handleRegister"> 
          <h1>Регистрация</h1>
          <div class="input-box">
            <input v-model="registerLogin" type="text" placeholder="Логин" required />
            <i class="bx bxs-user"></i>
          </div>
          <div class="input-box">
            <input v-model="email" type="email" placeholder="Email" required />
            <i class="bx bxs-envelope"></i>
          </div>
          <div class="input-box">
            <input v-model="registerPassword" type="password" placeholder="Пароль" required />
            <i class="bx bxs-lock-alt"></i>
          </div>
          <button type="submit" class="btn">Зарегистрироваться</button>
        </form>
      </div>
  
      <div class="toggle-box">
        <div class="toggle-panel toggle-left">
          <h1>Привет, давно не виделись!</h1>
          <p>Еще нет аккаунта?</p>
          <button class="btn switch-btn" @click="isRegistering = true">Регистрация</button>
        </div>
  
        <div class="toggle-panel toggle-right">
          <h1>Добро пожаловать!</h1>
          <p>Уже есть аккаунт</p>
          <button class="btn switch-btn" @click="isRegistering = false">Войти</button>
        </div>
      </div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const isRegistering = ref(false);
  const successMessage = ref('');
  const errorMessage = ref('');
  
  const apiRegister = axios.create({
    baseURL: 'https://petmeet.space:8443/api/v1',
    headers: { 'Content-Type': 'application/json' }
  });
  const apiLogin = axios.create({
    baseURL: 'https://petmeet.space:8443/api/v1',
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  //Регистрация
  const registerLogin = ref('');
  const email = ref('');
  const registerPassword = ref('');
  //Авторизация
  const loginUsername = ref('');
  const loginPassword = ref('');
  const token = ref('');

  const handleLogin = async () => {
    try {
    const response = await apiLogin.post('/auth/token', {
      username: loginUsername.value,
      password: loginPassword.value
    });
    console.log(loginUsername, loginPassword)
    token.value = response.data.token_type + ' '  + response.data.access_token;
    successMessage.value = 'Вход выполнен успешно!';
    errorMessage.value = '';
    console.log('Token:', token.value);
  } catch (error) {
    console.log(error);
  }
  };
  
  const handleRegister = async () => {
    try {
      const response = await apiRegister.post('/user/sign-up', {
      login: registerLogin.value,
      password: registerPassword.value
    });
      successMessage.value = response.data.message || 'Регистрация успешна!';
      errorMessage.value = '';
      console.log('Register Response:', response.data);
    } catch (error) {
      errorMessage.value = error.response?.data?.message || 'Ошибка регистрации';
    }
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;400;600;700&display=swap');
  
  * {
    justify-content: center;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Poppins", sans-serif;
  }
  
  body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(90deg, #e2e2e2, #c9d6ff);
  margin: 0;
}

.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 850px;
  height: 550px;
  background: #fff;
  border-radius: 30px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}
  
  .container h1 {
    text-align: center;
    font-size: 36px;
    margin: -5px 0;
  }
  
  .container p {
    font-size: 16px;
    margin: 15px 0;
  }
  
  .form-box {
    position: absolute;
    right: 0;
    width: 50%;
    height: 100%;
    background: #fff;
    display: flex;
    align-items: center;
    color: #333;
    text-align: center;
    padding: 40px;
    z-index: 1;
    transition: .6s ease-in-out 1.2s, visibility 0s 1s;
  }
  
  .container.active .form-box {
    right: 50%;
  }
  
  .form-box.register {
    visibility: hidden;
  }
  
  .container.active .form-box.register {
    visibility: visible;
  }
  
  .input-box {
    position: relative;
    margin: 30px 0;
  }
  
  .input-box input {
    width: 100%;
    padding: 13px 50px 13px 20px;
    background: #eee;
    border-radius: 8px;
    border: none;
    outline: none;
    font-size: 16px;
    color: #333;
    font-weight: 500;
  }
  
  .input-box i {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
  }
  
  .btn {
    width: 100%;
    height: 48px;
    background: #487e57;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #fff;
    font-weight: 600;
    border-color: white;
  }

  .switch-btn {
    border-color: #333;
  }
  
  .forgot-link{ margin: -15px 0 15px; }
    .forgot-link a{
        font-size: 16px;
        color: #333;
        text-decoration: none;
    }

  .toggle-box {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .toggle-box::before {
    content: '';
    position: absolute;
    left: -250%;
    width: 300%;
    height: 100%;
    background-image: url("//i.pinimg.com/736x/8e/78/c2/8e78c27751af455ae0e543b980e2864c.jpg");
    opacity: 0.98;
    border-radius: 150px;
    z-index: 2;
    transition: 1.8s ease-in-out;
  }
  
  .container.active .toggle-box::before {
    left: 50%;
  }
  
  .toggle-panel {
    position: absolute;
    width: 50%;
    height: 100%;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 2;
    transition: .6s ease-in-out;
  }
  .toggle-panel .btn{
        width: 160px;
        height: 46px;
        background: transparent;
        border: 2px solid #fff;
        box-shadow: none;
  }
  .toggle-panel.toggle-left {
    left: 0;
    transition-delay: 1.2s;
  }
  
  .container.active .toggle-panel.toggle-left {
    left: -50%;
    transition-delay: .6s;
  }
  
  .toggle-panel.toggle-right {
    right: -50%;
    transition-delay: .6s;
  }
  
  .container.active .toggle-panel.toggle-right {
    right: 0;
    transition-delay: 1.2s;
  }

  .success-message {
  color: green;
  text-align: center;
  margin-top: 10px;
}
.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}
  </style>
  