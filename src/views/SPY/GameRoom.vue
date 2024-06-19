<template>
  <GameLayout nameGame="Шпіон">
    <div class="mainContainer">
      <div class="creatorInfo"> Кімнату створив {{ room.name }} для {{ room.required_players }}-x гравців</div>
      
      <div v-if="gameState === 'GameCanBeStart'">
        <h2>{{ cur_world }}</h2>
        <table class="formCreate">
          <thead>
            <tr>
              <th>Гравці</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in room.players" :key="i.id" class="formElement">
              <td class="tableElement">{{ i.name }}</td>
            </tr>
          </tbody>
        </table>

        <TimerFizi :timeInSeconds="time_game" />

        <div class="spyDiv" v-if="isSpy">
          <div>
            <ul v-for="i in all_words" :key="i">
              <li>{{ i }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="gameState === 'WaitPlayers'">
        <div class="waiting">Очікуємо на гравців</div>
        <TelegramShareButton :url="qrCodeValue" text="Давай грати в Шпіона" />
      </div>
    </div>
  </GameLayout>
</template>

<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router';
import GameLayout from '../GameLayout.vue';
import TelegramShareButton from '@/components/TelegramShareButton.vue';
import TimerFizi from '@/components/TimerFizi.vue';

const isSpy = ref(false)
const time_game = ref(0)
const pName = localStorage.getItem('playerName')
const route = useRoute()
const gameState = ref('WaitPlayers')
const cur_world = ref('w')
const all_words = ref([])
const room = reactive({
  name: "",
  players: [],
})
const qrCodeValue = `http://localhost:8080/connect/${route.params.id}`
const userHash = localStorage.getItem("hash")
let websocket

const initializeWebSocket = () => {
  if (userHash) {
    websocket = new WebSocket(`ws://127.0.0.1:7000/start/${route.params.id}?name=${pName}&player_hash=${userHash}`)
  } else {
    websocket = new WebSocket(`ws://127.0.0.1:7000/start/${route.params.id}?name=${pName}`)
  }

  websocket.onopen = () => {
    console.log('WebSocket connected')
  }

  websocket.onmessage = function (event) {
    const message = JSON.parse(event.data)
    console.log('Received message:', message)
    const eventType = message.event
    if (message.hash) {
      localStorage.setItem("hash", message.hash)
    }

    if (eventType === "GameCanBeStart") {
      gameState.value = "GameCanBeStart"
      cur_world.value = message.world_spy
      time_game.value = parseInt(message.room.time_game) * 60
      console.log('Game started:', message)
    } else if (eventType === "YouAreSpy") {
      gameState.value = "GameCanBeStart"
      time_game.value = parseInt(message.room.time_game) * 60
      isSpy.value = true
      all_words.value = message.all_words
      console.log('You are the spy:', message)
    } else if (eventType === "ConnectedToRoom" || eventType === "NewPlayerConnected") {
      Object.assign(room, message.room)
      if (room.players.length >= room.required_players) {
        gameState.value = "GameCanBeStart"
      }
      console.log('Room updated:', room)
    }
  }

  websocket.onclose = (event) => {
    console.log('WebSocket closed:', event)
  }

  websocket.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
}

onBeforeMount(() => {
  initializeWebSocket()
})
</script>

<style scoped>
.creatorInfo {
  font-size: 25px;
}

.tableElement {
  font-size: 40px;
}

.groupButtonCont {
  display: flex;
  background-color: none;
}

.spyDiv {
  margin-top: 20px;
}
</style>
