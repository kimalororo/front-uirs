<template>
    <div>
        <h1>UserRecipes</h1>
        <div class="app__btns">
            <my-button
                @click="ShowDialoge"
                >Create Post
            </my-button>
            <MySelect
            v-model="selectedSort"
            :options="sortOptions"
            />
        </div>
        <my-dialoge v-model:show="dialogeVisible">
            <post-form
            @create="createPost"
            />
        </my-dialoge>   
       <post-list
       :posts="posts"
       @remove="removePost"
       v-if="isPostLoading!=true"
       />
       <div v-else> Loading... </div>
    </div>
    </template>
    
    <script>
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";
import MyButton from "@/components/UI/MyButton";
import axios from 'axios';
import MySelect from "@/components/UI/MySelect";
import MyInput from "@/components/UI/MyInput";
    export default{
        components: {
            MyInput,
            MySelect,
            MyButton,
            PostList, PostForm
        },
        data() {
            return{
                posts: [],
                dialogeVisible: false,
                isPostLoading: false,
                selectedSort: '',
                sortOptions: [
                    {value: 'title', name: 'Name'},
                    {value: 'body', name: 'Descriptions'}
                ]
            }
        },
        methods: {
            createPost(post) {
               this.posts.push(post);
               this.dialogeVisible = false;
            },
            removePost(post){
                this.posts = this.posts.filter(p => p.id !== post.id);
            },
            ShowDialoge(){
                this.dialogeVisible = true;
            },
            async fetchPosts() {
                try {
                    this.isPostLoading = true;
                    setTimeout( async() => {
                        const response = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=10')
                        this.posts = response.data;
                        this.isPostLoading = false;
                    }, 1000)
                } catch(e){
                    alert('Error')
                }
            }
        },
        mounted() {
            this.fetchPosts();
        }
    }
    </script>
    
    <style>
    </style>