<template>
    <input :value="modelValue" 
    @input="updateInput" 
    :placeholder="placeholder" 
    :class="['input', {'no-scale': disableScale}]"
     type="text">
</template>

<script>
const image = "/src/components/icons/calendar.png";
export default {
    name: 'my-input',
    props: {
        modelValue: [String, Number],
        placeholder: {
            type: String,
            default: 'Поиск'
        },
        disableScale: {
            type: Boolean,
            default: false
        } 
    },
    methods: {
        updateInput(event) {
            this.$emit('update:modelValue', event.target.value)
        }
    }
    }
</script>

<style scoped>
    .input {
    width: 100%;
    border: 1px solid teal;
    padding: 10px 15px 10px 40px; 
    margin-top: 15px;
    font-size: 1.2rem;
    background-image: url('/src/components/icons/search.png'); 
    background-repeat: no-repeat;
    background-size: 20px 20px;
    background-position: 10px center;
}

.input:focus {
        border: 2px solid #eaf4e8;
        outline: none; 
        background-color: #dce7da; 
        color: #2d4132;
        font-size: 1.2rem;
}
.input:hover:not(.no-scale),
.input:focus:not(.no-scale) {
    transform: scale(1.05);
}

</style>