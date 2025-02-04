<template>
    <Header />
    <div class="app">
        <Navbar />
        <div class="content">
            <router-view />
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
    }
}
</script>

<style>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    .app {
        display: flex;
        height: calc(100vh - 160px); /* 100% высоты минус высота header */
    }
    .navbar {
        width: 20%;
        height: 100%;
    }
    .content {
        flex-grow: 1; /* Контент занимает всю оставшуюся ширину */
        margin-left: 50px;
        margin-top: 50px;
    }
</style>
