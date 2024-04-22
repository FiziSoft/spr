<template>
    {{ $route.params.id }}
<div>
    Game Room
</div>
<div>
    {{ pName }}
</div>
<div>
    <h2 v-if="currentState === 'WaitPlayers'">Waiting players</h2>
    <h2 v-else-if="currentState === 'Game can be started'">Game can be started</h2>
    <h2 v-else-if="currentState === 'WaitChoice'">WaitChoice</h2>
    <h2>{{ currentState }}</h2>

    <button v-if="currentState"></button>
</div>
</template>


<script setup>
import {onBeforeMount} from 'vue'
import { useRoute } from 'vue-router';

const pName = localStorage.getItem('playerName')
const route = useRoute()

let currentState = 'WaitPlayers';

onBeforeMount(() => {
  
alert(currentState)
  const websocket = new WebSocket(`ws://127.0.0.1:7000/start/${route.params.id}?name=${pName}`);
  websocket.onmessage = (event) => {}
  websocket.onmessage = function (event){
    const message = event.data;
    if (currentState === "WaitPlayers" && message === "Game can be started"){

      currentState = "WaitChoice"
      alert(currentState)
    }
    
  }
})


</script>