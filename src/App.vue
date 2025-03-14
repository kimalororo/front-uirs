<template>
    <Header />
    <div class="app">
        <Navbar v-if="!hideNav"/>
        <div class="content">
            <router-view/>
        </div>
    </div>
</template>

<script>
import Navbar from "@/components/Navbar"
import Header from "@/components/Header"
export default {
    components: {
        Navbar,
        Header
    },
    computed: {
        hideNav() {
            return this.$route.path === "/auth"
        }
    }
}
</script>

<style>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        overflow: hidden;
    }
.app {
    position: relative;
    display: flex;
    height: calc(100vh - 160px);
}

.app::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/src/components/icons/paper.jpg');
    background-color: #f4fdf2; 
    background-blend-mode: multiply; 
    background-size: cover;
    background-position: center;
    z-index: -1;
}

    .content {
        flex-grow: 1; /* Контент занимает всю оставшуюся ширину */
        margin-left: 50px;
        margin-top: 50px;
        overflow: auto;
        max-width: 75%;
    }
</style>
