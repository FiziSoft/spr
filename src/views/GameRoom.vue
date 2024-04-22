<template>
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

const websocket = new WebSocket(`ws://127.0.0.1:7000/start/${route.params.id}?name=${pName}`);
websocket.onmessage = function (event){
  const message = JSON.parse(event.data);

  room.value = message["room"]

}


</script>