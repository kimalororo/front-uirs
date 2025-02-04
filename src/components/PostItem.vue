<template>
    <div class="post">
        <div>
            <div><strong>Name: </strong> {{ post.title }}</div>
            <div><strong>Description: </strong> {{ post.body }}</div>
        </div>
        <div class="post__btns"> 
            <my-button
            @click="$emit('remove', post)"
            >Удалить</my-button>
        </div>
</div>
</template>

<script>
import MyButton from "@/components/UI/MyButton.vue"
export default {
    components:{
    MyButton
    },
    props: {
        post: {
            type: Object,
            required: true,
       }
    }
}
</script>

<style scoped>
    .post{
        padding: 15px;
        border: 2px solid teal;
        margin-top: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>