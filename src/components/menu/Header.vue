<template>
    <div class="header" style="position: sticky;"> 
        <div class="header_el">
            <div class="logo">
                <img
                src="../icons/logo.png"
                alt="Лого"
                />
            </div>
            <my-input v-if="!hideNav"
            style="margin-left: 15%; margin-top: 0; width: 40%; height: 51px; border-radius: 10px;">
            </my-input> 
            <div v-if="!hideNav && user" class="profile" style="margin-left: 10%;">
                <div class="pict">
                    <img src="../icons/mater.png" alt="">
                </div>
                <h2 @click="$router.push('/userInfo')" style="margin-left: 20px;">
                    {{ user.username }}
                </h2>
                <div class="pict" style="margin-left: 10px; height: 80%;">
                    <img src="../icons/logout.png" alt="Выйти" @click="logout">
                </div>
            </div>
            <div v-else-if="!hideNav" @click="$router.push('/auth')" class="alternative">
                <h1>Войти</h1>
            </div>
            <div v-else @click="$router.push('/')" class="centered-div">
                <h1>На главную</h1>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const hideNav = computed(() => route.path === '/auth')

const user = ref(null)

onMounted(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
        user.value = JSON.parse(savedUser) 
    }
})

const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    user.value = null 
    console.log('Выход выполнен')
}
</script>

<style scoped>
.header {
    height: 140px;
    width: 100%;
    background-image: url("//i.pinimg.com/736x/8e/78/c2/8e78c27751af455ae0e543b980e2864c.jpg");
    opacity: 0.98;  
    box-shadow: 2px 2px 4px gray;
    display: flex;
    align-items: center;
    justify-items: center;
    padding: 0 15px;
    margin-left: auto;
}
.header_el {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;
    width: 100%;
}
.profile {
    display: flex;
    width: 25%;
    height: 90px;
    border: 3px solid #b6d1b2;
    border-radius: 10px;
    align-items: center;
    justify-content: space-between;
}

.alternative{
    margin-left: 15%;
    margin-right: 3%;
    display: flex;
    width: 15%;
    height: 90px;
    border: 3px solid #b6d1b2;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    color: #dce7da;
}

.centered-div {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 15%;
    height: 90px;
    border: 3px solid #b6d1b2;
    border-radius: 10px;
    display: flex; 
    align-items: center; 
    justify-content: center; 
    text-align: center;
    color: #dce7da;
}
.profile h2{
    max-width: 60%;
    font-size: 1.8rem;
    color: #dce7da;
}

.pict{
    height: 90%; 
    aspect-ratio: 1 / 1; 
    border-radius: 50%; 
    margin-left: 10px;
    align-items: center;
    justify-content: center;
    display: flex;
}
.logo{
    margin-left: 40px;
    width: 20%;
}
.logo img {
    height: 100px; 
    width: auto; 
    box-shadow: 2px 2px 6px #3c5339; 
    transition: transform 0.2s ease-in-out;
    border-radius: 10px; 
}
.logo img:hover {
    transform: scale(1.05);
}

</style>
