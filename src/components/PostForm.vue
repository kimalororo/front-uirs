<template>
 <form @submit.prevent>
            <h4>Create new post</h4>
            <my-input 
            v-model="post.title"
            type="text" 
            placeholder="Name"
            ></my-input>
            <my-input
            v-model="post.body"
            type="text" 
            placeholder="Description"
            ></my-input>
            <my-button 
            class="btn"
            style="align-self: flex-end; margin-top: 15px;"
            @click="createPost"
             >
             Create
            </my-button>
        </form>
       
</template>

<script>
export default {
    data() {

        return {
            post: {
                title: '',
                body:'',
            }
        }
    },
    methods: {
        createPost(){
            this.post.id = Date.now();
            this.$emit('create', this.post)
            this.post = { //после добавления объекта очищаем текущий объект
                title: '',
                body: ''
        }
    }
    }
}
</script>

<style scoped>
form{
        display: flex;
        flex-direction: column ;
    }
</style>    