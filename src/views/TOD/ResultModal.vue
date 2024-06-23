<template>
    <div class="modal">
      <h2>Результат игры</h2>
      <p>{{ result }}</p>
      <button @click="close">Закрыть</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      result: String
    },
    methods: {
      close() {
        this.$emit('close');
      }
    }
  }
  </script>
  
  <style scoped>
  .modal {
    /* ваши стили для модального окна */
  }
  button {
    /* ваши стили для кнопок */
  }
  </style>
  