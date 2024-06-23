<template>
    <button class="btn-grad" @click="goToHome">Завершити гру</button>
  </template>
  
  <script>
  export default {
    methods: {
      goToHome() {
        this.$router.push({ name: 'Main' });
      }
    }
  }
  </script>
  
  <style scoped>
  .styled-button {
    background-color: #90549c; /* Зеленый */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px; /* Слегка скругленные углы */
    transition: background-color 0.3s ease; /* Плавный переход цвета фона */
  }
  
  .styled-button:hover {
    background-color: #45a049; /* Темно-зеленый при наведении */
  }
  </style>
  