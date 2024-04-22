<template>
  <div v-for="player in room.players" :key="player.id">

  </div>

  <div>
    {{ room.name }}
    {{ room.players.length }}
  </div>
</template>


<script setup>
import {onBeforeMount, ref, reactive} from 'vue'
import { useRoute } from 'vue-router';

const pName = localStorage.getItem('playerName')
const route = useRoute()

let currentState = ref('WaitPlayers');
const room = reactive({
  name: "",
  players: [],
})

const userHash = localStorage.getItem("hash")
let websocket;

if (userHash){
  websocket = new WebSocket(`ws://127.0.0.1:7000/start/${route.params.id}?name=${pName}&player_hash=${userHash}`);
} else {
  websocket = new WebSocket(`ws://127.0.0.1:7000/start/${route.params.id}?name=${pName}`);
}

const gameState = ref("WaitPlayers");

websocket.onmessage = function (event){
  const message = JSON.parse(event.data);

  const eventType = message.event;

  if (message.hash){
    localStorage.setItem("hash", message.hash)
  }

  // TODO:
  if (eventType === "GameStarted"){
    gameState.value = "GameStarted"
  }
  // TODO:
  // else if (eventType == "BBB"){doBBB}


  Object.assign(room, message["room"])
}


</script>