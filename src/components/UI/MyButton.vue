<template>
    <button class="btn">
        <span class="icon"><slot name="icon"></slot></span>
        <span class="text"><slot></slot></span>
    </button>
</template>

<script>
export default {
    name: 'my-button'
}
</script>

<style scoped>
.btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 15px; /* Отступ между иконкой и текстом */
    padding: 10px 15px;
    background: none;
    color: #4F4B4B;
    border: 1.4px solid black;
    border-radius: 10px;
    background-color: #FFFCF8;
    box-shadow: 0px 4px 4px 0px #00000040;
    width: 100%;
    min-height: 80px; /* Фиксируем высоту кнопок */
    max-height: 100px;
}

.icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px; /* Фиксируем размер иконки */
    height: 40px;
    flex-shrink: 0; /* Запрещаем уменьшение */
}

.text {
    flex-grow: 1; /* Позволяет тексту занимать доступное пространство */
    font-family: Inter;
    font-size: 25px;
    font-weight: 400;
    line-height: 36.31px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    display: flex;
    align-items: center;
}
</style>
