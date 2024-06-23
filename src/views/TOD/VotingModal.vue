<template>
    <div class="modal">
      <h2>Выберите шпиона</h2>
      <button
        v-for="player in players"
        :key="player.id"
        @click="vote(player.id)"
      >
        {{ player.name }}
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      players: Array
    },
    methods: {
      vote(playerId) {
        this.$emit('vote', playerId);
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
  