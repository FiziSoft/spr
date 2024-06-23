<template>
  <GameLayout nameGame="Шпіон">
    <div class="containerFormCreate">
      <form class="formCreate">
        <div class="formElement">
          <label class="btn-gradient-1" for="playerName">Ваше ім'я:</label>
          <input v-model="playerName" type="text" id="playerName" class="input-gradient">
        </div>
        <div class="formElement">
          <label class="">Кількість гравців:</label>
          <input v-model="numPlayers" class="input-gradient" placeholder=" " type="number" />
        </div>
        <div class="formElement">
          <label class="btn-gradient-1" for="time_game">Час на гру:</label>
          <input v-model="time_game" type="text" id="time_game" class="input-gradient">
        </div>
        <div class="formElement">
          <Dropdown_my :items="themes" v-model="theme_str" label="Тема гри:" />
        </div>
        <div class="btnDiv">
          <button :disabled="!isButtonActive" type="button" @click="sendCreateRoomRequest" class="btn-grad">Почати гру</button>
        </div>
      </form>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </GameLayout>
</template>

<script setup charset="utf-8">
import axios from "axios";
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import GameLayout from "../GameLayout.vue";
import Dropdown_my from "/src/components/Dropdown_my.vue";
import TimerFizi from '@/components/TimerFizi.vue';
import TelegramShareButton from '@/components/TelegramShareButton.vue';
import network_url from "@/views/MainPage.vue"


const router = useRouter();
const route = useRoute();
const playerName = ref(localStorage.getItem('spyPlayerName') || '');
const numPlayers = ref(null);
const time_game = ref(null);
const theme_str = ref(null);
const themes = ref([]);
const errorMessage = ref('');
const gameState = ref('WaitPlayers');
const isSpy = ref(false);
const cur_world = ref('');
const room = reactive({ name: '', players: [], theme: [] });
const loading = ref(true);
const qrCodeValue = ref('');
const url_serv = "127.0.0.1:7000"

const getThemes = async () => {
  try {
    const res = await axios.get(`http://${url_serv}/getThemes`);
    themes.value = res.data;
  } catch (error) {
    console.log('Error fetching themes:', error);
  }
};

onMounted(() => {
  getThemes();
});

const isButtonActive = computed(() => {
  return playerName.value.trim().length > 0 && numPlayers.value && time_game.value && theme_str.value;
});

const checkRoomExists = async (roomId) => {
  try {
    const response = await axios.get(`http://${url_serv}/rooms/${roomId}`);
    return response.status === 200 && response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = "Комната не существует. Пожалуйста, проверьте ID комнаты и попробуйте снова.";
    } else {
      console.error('Error checking room:', error);
      errorMessage.value = "Произошла ошибка. Пожалуйста, попробуйте снова позже.";
    }
    return false;
  }
};

const connectToWebSocket = (roomId, playerName, playerHash) => {
  const websocket = new WebSocket(`ws://${url_serv}/start/${roomId}?name=${encodeURIComponent(playerName)}&player_hash=${playerHash || ''}`);

  websocket.onopen = () => {
    console.log('WebSocket connected');
    loading.value = false;
  };

  websocket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.hash) {
      localStorage.setItem('spyPlayerHash', message.hash);
    }

    const eventType = message.event;
    if (eventType === 'GameCanBeStart') {
      gameState.value = 'GameCanBeStart';
      cur_world.value = message.world_spy;
      time_game.value = parseInt(message.room.time_game) * 60;
    } else if (eventType === 'YouAreSpy') {
      gameState.value = 'GameCanBeStart';
      time_game.value = parseInt(message.room.time_game) * 60;
      isSpy.value = true;
    }

    Object.assign(room, message.room);
  };

  websocket.onclose = (event) => {
    console.log('WebSocket closed:', event);
  };

  websocket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
};

const sendCreateRoomRequest = async () => {
  try {
    const roomName = playerName.value;
    const encodedThemeStr = encodeURIComponent(theme_str.value); // Кодируем строку

    console.log('Creating room with params:', {
      name: roomName,
      req_players: numPlayers.value,
      time_game: time_game.value,
      theme_str: encodedThemeStr
    });

    const response = await axios.post(
      `http://${url_serv}/create_room`,
      null,
      {
        params: {
          name: roomName,
          req_players: numPlayers.value,
          time_game: time_game.value,
          theme_str: encodedThemeStr // Используем закодированную строку
        },
      }
    );

    const roomId = response.data.id;
    console.log('Room created with ID:', roomId);
    localStorage.setItem('spyPlayerName', playerName.value);
    localStorage.setItem('spyRoomId', roomId);
    router.push({ name: 'spyGameRoom', params: { id: roomId } }).then(() => {
      window.location.reload(); // Перезагружаем страницу для повторного подключения
    });
  } catch (error) {
    console.error('Error creating room:', error);
    errorMessage.value = "Произошла ошибка при создании комнаты. Пожалуйста, попробуйте снова.";
  }
};


onMounted(async () => {
  const playerNameFromStorage = localStorage.getItem('spyPlayerName');
  const roomId = route.params.id;
  const playerHash = localStorage.getItem('spyPlayerHash');
  localStorage.removeItem('spyTimerTimeLeft');
  localStorage.removeItem('spyIsRunning');


  if (!playerNameFromStorage || !roomId) {
    return;
  }

  const exists = await checkRoomExists(roomId);
  if (exists) {
    playerName.value = playerNameFromStorage;
    qrCodeValue.value = `${network_url}/spy/room/${roomId}`;
    connectToWebSocket(roomId, playerNameFromStorage, playerHash);
  } else {
    router.push('/');
  }
});
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
}
</style>
