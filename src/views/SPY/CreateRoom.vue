<template>
  <GameLayout nameGame="Шпіон">
    <div class="containerFormCreate">
      <form class="formCreate">
        <div class="formElement">
          <label class="btn-gradient-1" for="playerName">Ваше ім'я:</label>
          <input v-model="playerName" type="text" id="playerName" class="input-gradient">
        </div>

        <div class="formElement">
          <label class="btn-gradient-1" for="numPlayers">Кількість гравців:</label>
          <input v-model="numPlayers" type="number" id="numPlayers" class="input-gradient">
        </div>

        <div class="formElement">
          <label class="btn-gradient-1" for="timeGame">Час на гру:</label>
          <input v-model="timeGame" type="number" id="timeGame" class="input-gradient">
        </div>

        <div class="formElement">
          <Dropdown_my :items="themes" v-model="themeStr" label="Тема гри:" />
        </div>

        <div class="btnDiv">
          <button :disabled="!isFormValid" type="button" @click="createRoom" class="btn-grad">Почати гру</button>
        </div>
      </form>
    </div>
  </GameLayout>
</template>

<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import GameLayout from '../GameLayout.vue';
import Dropdown_my from '/src/components/Dropdown_my.vue';

const router = useRouter();

const playerName = ref(localStorage.getItem('playerName') || '');
const numPlayers = ref(null);
const timeGame = ref(null);
const themeStr = ref(null);
const themes = ref([]);

const fetchThemes = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:7000/getThemes');
    themes.value = response.data;
  } catch (error) {
    console.error('Error fetching themes:', error);
  }
};

onMounted(fetchThemes);

const isFormValid = computed(() => playerName.value && numPlayers.value && timeGame.value && themeStr.value);

const createRoom = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:7000/create_room', null, {
      params: {
        name: playerName.value,
        req_players: numPlayers.value,
        time_game: timeGame.value,
        theme_str: themeStr.value
      }
    });

    const roomId = response.data.id;
    localStorage.setItem('playerName', playerName.value);
    router.push({ name: 'spyGameRoom', params: { id: roomId } });
  } catch (error) {
    console.error('Error creating room:', error);
  }
};
</script>

<style scoped>
/* Добавьте ваши стили здесь */
</style>
