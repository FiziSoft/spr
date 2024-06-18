<template>
  <GameLayout nameGame="Правда або Дія">
    <div class="containerFormCreate">
      
      <div v-if="receivedData" class="formCreate">
        <div class="name_button">{{ receivedData.title }}</div>
        <div><p>{{ receivedData.name }}</p></div>
        <div><p>{{ receivedData.body }}</p></div>
      </div>
      <pre v-else>No data received yet</pre>
    </div>
    <ShareButton @share="handleShare" :url="todViewLink" text="Слідкуй за грою онлайн"/>
   
   
  </GameLayout>
</template>

<script setup>
import { ref, onMounted, watch, defineExpose } from 'vue';
import { useRoute } from 'vue-router';
import ShareButton from '@/components/ShareButton.vue';
import GameLayout from '@/views/GameLayout.vue';
import WebSocketComponent from '@/components/WebSocketComponent.vue';

const receivedData = ref(null);
const websocketComponent = ref(null);
const route = useRoute();
const roomId = ref(route.params.roomId || localStorage.getItem('room_id'));
const todViewLink = ref(localStorage.getItem('tod_url_view') || '');

const cur_player = ref({
  name: "Player",
  // Add default properties to avoid undefined errors
});
const share_info = ref("Default body content");
const cur_title = ref("Default title");

const setupSocket = (roomId) => {
  const socket = new WebSocket(`ws://localhost:8001/ws/${roomId}`);
  socket.addEventListener('open', () => {
    console.log('WebSocket соединение установлено.');
  });
  socket.addEventListener('message', (event) => {
    receivedData.value = JSON.parse(event.data);
    console.log('Получено сообщение:', event.data);
  });
  socket.addEventListener('close', () => {
    console.log('WebSocket соединение закрыто.');
  });
  socket.addEventListener('error', (event) => {
    console.error('Ошибка WebSocket:', event);
  });
};

const triggerSendMessage = () => {
  if (websocketComponent.value) {
    websocketComponent.value.sendMessage();
  } else {
    console.error('WebSocketComponent не найден.');
  }
};

onMounted(() => {
  if (roomId.value) {
    setupSocket(roomId.value);
    todViewLink.value = `http://localhost:8080/tod-view/${roomId.value}`;
    localStorage.setItem('tod_url_view', todViewLink.value);
  }
});

watch(roomId, (newRoomId) => {
  if (newRoomId) {
    todViewLink.value = `http://localhost:8080/tod-view/${newRoomId}`;
    localStorage.setItem('tod_url_view', todViewLink.value);
  }
});

defineExpose({ triggerSendMessage, roomId, todViewLink });
</script>
