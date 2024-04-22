<template>
  <div>
    {{ room.name }}
    {{ room.players.length }}
  </div>

  <div v-for="i in room.players" :key="i.id">
    {{ i.name }}
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

websocket.onmessage = function (event){
  const message = JSON.parse(event.data);

  if (message.hash){
    localStorage.setItem("hash", message.hash)
  }

  Object.assign(room, message["room"])
}


</script>