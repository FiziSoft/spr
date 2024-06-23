<template>
    <div class="modal">
      <h2>Выберите загаданное слово</h2>
      <button
        v-for="word in words"
        :key="word"
        @click="guess(word)"
      >
        {{ word }}
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      words: Array
    },
    methods: {
      guess(word) {
        this.$emit('guess', word);
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
  