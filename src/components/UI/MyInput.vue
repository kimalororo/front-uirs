<template>
    <input :value="modelValue" @input="updateInput" class="input" type="text">
</template>

<script>
export default {
    name: 'my-input',
    props: {
        modelValue: [String, Number]
    },
    methods: {
        updateInput(event) {
            this.$emit('update:modelValue', event.target.value)
        }
    }
    }
</script>

<style scoped>
    .input{
        width: 100%;
        border: 1px solid teal;
        padding: 10px 15px;
        margin-top: 15px;
    }
    .input:hover{
        transform: scale(1.05);
    }
    input:focus {
    transform: scale(1.05);
    border: 2px solid #eaf4e8;
    outline: none; 
    background-color: #dce7da; 
    color: #2d4132;
    font-size: 1.2rem;
    }

</style>