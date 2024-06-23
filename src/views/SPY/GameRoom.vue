<template>
  <GameLayout nameGame="Шпіон">
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-if="gameState === 'WaitPlayers'">
        <div class="waiting">Очікуємо на гравців</div>
        <TelegramShareButton :url="qrCodeValue" text="Давай грати в Шпіона" />
      </div>
      <div v-else-if="gameState === 'GameCanBeStart'">
        <h1 v-if="isSpy" class="spy-notice">Ви шпіон!</h1>
        <h2 v-if="!isSpy">{{ cur_world }}</h2>
        <table class="formCreate">
          <thead>
            <tr>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in room.players" :key="i.id" class="formElement">
              <td class="tableElement">{{ i.name }}</td>
            </tr>
            <TimerFizi :timeInSeconds="time_game" />
          </tbody>
        </table>
        <div class="spyDiv" v-if="isSpy">
          <div>
            <ul>
              <li v-for="i in room.theme" :key="i">{{ i }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </GameLayout>
</template>

<script setup>
import axios from 'axios';
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GameLayout from '../GameLayout.vue';
import TimerFizi from '@/components/TimerFizi.vue';
import TelegramShareButton from '@/components/TelegramShareButton.vue';

const loading = ref(true);
const gameState = ref('WaitPlayers');
const isSpy = ref(false);
const cur_world = ref('');
const time_game = ref(0);
const errorMessage = ref('');
const route = useRoute();
const router = useRouter();
const room = reactive({ name: '', players: [], theme: [] });
const qrCodeValue = ref('');

const connectToWebSocket = (roomId, playerName, playerHash) => {
  const websocket = new WebSocket(`ws://127.0.0.1:7000/start/${roomId}?name=${encodeURIComponent(playerName)}&player_hash=${playerHash || ''}`);

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
      isSpy.value = false; // Обнуляем значение
    } else if (eventType === 'YouAreSpy') {
      gameState.value = 'GameCanBeStart';
      time_game.value = parseInt(message.room.time_game) * 60;
      isSpy.value = true;
      cur_world.value = ''; // Очистим текущее слово
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

const checkRoomExists = async (roomId) => {
  try {
    const response = await axios.get(`http://127.0.0.1:7000/rooms/${roomId}`);
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

const playerName = ref(localStorage.getItem('spyPlayerName') || '');

const isButtonActive = computed(() => {
  return playerName.value.trim().length > 0;
});

const redirectToRoomPage = async () => {
  const roomId = route.params.id;
  const exists = await checkRoomExists(roomId);
  if (exists) {
    localStorage.setItem('spyPlayerName', playerName.value);
    localStorage.setItem('spyRoomId', roomId);
    router.push({ name: 'spyGameRoom', params: { id: roomId } }).then(() => {
      window.location.reload(); // Перезагружаем страницу для повторного подключения
    });
  }
};

onMounted(async () => {
  const playerNameFromStorage = localStorage.getItem('spyPlayerName');
  const roomId = route.params.id;
  const playerHash = localStorage.getItem('spyPlayerHash');

  if (!playerNameFromStorage || !roomId) {
    router.push('/');
    return;
  }

  const exists = await checkRoomExists(roomId);
  if (exists) {
    playerName.value = playerNameFromStorage;
    qrCodeValue.value = `http://localhost:8080/spy/room/${roomId}`;
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
.spy-notice {
  color: red;
  font-size: 2em;
}
</style>
