<template>
 <div v-if="posts.length > 0">
    <h3> Список постов </h3>
    <post-item
     v-for="post in posts"
     :post="post"
     :key="post.id"
     @remove="$emit('remove', post)"
     />
 </div>
 <h3 v-else style="color:red">Error</h3>
</template>

<script>
import PostItem from './PostItem.vue';
export default {
    components: {PostItem},
    props: {
        posts: {
            type: Array,
            required: true
        }
    }                           
}
</script>
  
<style scoped>
</style>   
