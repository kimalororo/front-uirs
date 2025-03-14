<template>
    <div class="header" style="position: sticky;"> 
        <div class="header_el">
            <div class="logo">
                <img
                src="../components/icons/logo.png"
                alt="Лого"
                />
            </div>
            <my-input v-if="!hideNav"
            style="margin-left: 15%; margin-top: 0; width: 40%; 
            height: 51px; border-radius: 10px;">
                
            </my-input> 
            <div v-if="!hideNav" class="profile" style="margin-left: 10%;">
                <div class="pict">
                    picture
                </div>
                <h2 style="margin-left: 20px;">
                    Nickname
                </h2>
                <div class="pict" style="margin-left: 10px; background-color:crimson;">
                     LogOut
                </div>
            </div>
            <div v-else style="margin-left: 20%;">
                <my-button @click="$router.push('/')">
                    <template #icon><img src="./icons/home.png" alt="Главная"></template>
                    Главная
                </my-button>
            </div>
        </div>
    </div>
</template>

<script>
export default{
computed: {
    hideNav() {
            return this.$route.path === "/auth"
        }
}
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
    width: 22%;
    height: 90px;
    border: 2px solid #b6d1b2;
    border-radius: 10px;
    align-items: center;
    justify-content: flex-start;
}

.profile h2{
    max-width: 55%;
    font-size: 1.8rem;
    color: #dce7da;
}

.pict{
    height: 75%; 
    aspect-ratio: 1 / 1; 
    border-radius: 50%; 
    border-color: black;
    border: 1px; 
    background-color: teal;
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