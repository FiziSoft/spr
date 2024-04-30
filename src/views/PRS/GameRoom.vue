<template>
  <div class="h-screen flex flex-col items-center justify-center bg-slate-700">

    <h2> Кімната: {{ room.name }} для {{ room.required_players }} гравців</h2>
    <div >
      <table class="steelBlueCols">
        <thead>
          <tr>
            <th>Нікнейм</th>
            <th>Бали</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in room.players" :key="i.id">
            <td > {{ i.name }}</td>
            <td > {{ i.score }}</td>
          </tr>
          
        </tbody>
        </table>
    </div>
  <br>  
  <div>
    <a href="/connect/{{ room.id }}"> http://localhost:8080/connect/{{ room.id }}</a>
    <br>  
    <br>  
    <br>  
    <button>  http://localhost:8080/connect/{{ room.id }} </button>
  </div>
    

  <div v-if="gameState === 'GameCanBeStart'">
  <!-- <div> -->

    <div>
    </div>
    <button class="btn_rock" value="rock"></button>
    <button class="btn_sci" value="scissor"></button>
    <button class="btn_paper" value="paper"></button>

  </div>
    <!-- <div>
      {{ room.name }}
      {{ room.players.length }}
    </div> -->

    <!-- <div v-for="i in room.players" :key="i.id">
      {{ i.name }}
    </div> -->


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

let gameState = ref("WaitPlayers");

websocket.onmessage = function (event){
  const message = JSON.parse(event.data);

  const eventType = message.event;
  if (message.hash){
    localStorage.setItem("hash", message.hash)
  }

  // TODO:
  if (eventType === "GameCanBeStart"){


    gameState.value = "GameCanBeStart"

    alert(gameState.value)
  }
  // TODO:
  // else if (eventType == "BBB"){doBBB}


  Object.assign(room, message["room"])  /// что єто?
}


</script>


<style>




table.steelBlueCols {
  font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
  border: 10px solid #555555;
  background-color: #555555;
  width: 400px;
  text-align: center;
  border-collapse: collapse;
}
table.steelBlueCols td, table.steelBlueCols th {
  border: 10px solid #555555;
  padding: 5px 10px;
}
table.steelBlueCols tbody td {
  font-size: 13px;
  color: #FFFFFF;
}
table.steelBlueCols thead {
  background: #398AA4;
  border-bottom: 10px solid #398AA4;
}
table.steelBlueCols thead th {
  font-size: 15px;
  font-weight: normal;
  color: #FFFFFF;
  text-align: left;
  border-left: 2px solid #398AA4;
}
table.steelBlueCols thead th:first-child {
  border-left: none;
}

table.steelBlueCols tfoot td {
  font-size: 13px;
}
table.steelBlueCols tfoot .links {
  text-align: right;
}
table.steelBlueCols tfoot .links a{
  display: inline-block;
  background: #FFFFFF;
  color: #398AA4;
  padding: 2px 8px;
  border-radius: 5px;
}
</style>