<template>
  
  <GameLayout nameGame="Камінь Ножиці Бумага">
  <div class="mainContainer">

    <div class="creatorInfo"> Кімнату створив {{ room.name }} для {{ room.required_players }}-x гравців</div>
      <div  v-if="gameState === 'GameCanBeStart'">
        <table class="formCreate">
          <thead>
            <tr>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in room.players" :key="i.id" class="formElement">
              <td class="tableElement"> {{ i.name }}</td>
              <td class="tableElement"> {{ i.score }}</td>
            </tr>
            
          </tbody>
        </table>
      </div>
  <br>  
    <div v-if="gameState === 'WaitPlayers'">
    <!-- <a href='`https://t.me/share/url?url={ http://localhost:8080/connect/{{ room.id }}}&text={someText fejfhkwjfjwkefkgewkw}`'>23333333333333</a> -->
      <div class="waiting">Очікуємо на гравців</div>
      <br>  
      <br>  
      <br>
      <a href="/connect/{{ room.id }}"> http://localhost:8080/connect/{{ room.id }}</a>
      <br>  
      <br>  
      <br>
      <qrcode-vue :value="qrCodeValue" :size="200" level="L" />
    </div>
    

  <div v-if="gameState === 'GameCanBeStart'">
  <!-- <div> -->


  <van-cell title="Зробити вибір" is-link @click="showPopup" />
  <van-popup v-model:show="show" :style="{ padding: '64px' }">
    <div>Роби свій вибір </div>
    <div class="groupButtonCont" v-if="choiseGet" >
      <div><button @click="()=> sendPlayerChoiceToServer('rock')" class="btn_rock activeButton" value="rock"></button></div>
      <div><button @click="()=> sendPlayerChoiceToServer('scissors')" class="btn_sci activeButton" value="scissor"></button></div>
      <div><button @click="()=> sendPlayerChoiceToServer('paper')" class="btn_paper activeButton" value="paper"></button></div>
    </div>
  
  </van-popup>
    
   
  </div>
    <!-- <div>
      {{ room.name }}
      {{ room.players.length }}
    </div> -->

    <!-- <div v-for="i in room.players" :key="i.id">
      {{ i.name }}
    </div> -->


</div>
</GameLayout>
</template>


<script setup>
import {onBeforeMount, ref, reactive} from 'vue'
import { useRoute } from 'vue-router';
import QrcodeVue from 'qrcode.vue'
import GameLayout from '../GameLayout.vue';





const pName = localStorage.getItem('playerName')
const route = useRoute()
let choiseGet = ref(true)
let currentState = ref('WaitPlayers');
const room = reactive({
  name: "",
  players: [],
})


const show = ref(false);
    const showPopup = () => {
      show.value = true;
    };



const qrCodeValue = `http://localhost:8080/connect/${route.params.id}`

const userHash = localStorage.getItem("hash")
let websocket;

if (userHash){
  websocket = new WebSocket(`ws://127.0.0.1:7000/start/${route.params.id}?name=${pName}&player_hash=${userHash}`);
} else {
  websocket = new WebSocket(`ws://127.0.0.1:7000/start/${route.params.id}?name=${pName}`);
}

let gameState = ref("WaitPlayers");

const sendPlayerChoiceToServer = (choice) => {
  websocket.send(choice)
  choiseGet = false

  
}


websocket.onmessage = function (event){
  const message = JSON.parse(event.data);

  const eventType = message.event;
  if (message.hash){
    localStorage.setItem("hash", message.hash)
  }

  // TODO:
  if (eventType === "GameCanBeStart"){
    gameState.value = "GameCanBeStart"
    showPopup()
    alert(gameState.value)
  }
  else if (["Win", "Draw", "Lose"].includes(eventType)){
    choiseGet = true
    alert(eventType)
  }
  // TODO:
  // else if (eventType == "BBB"){doBBB}

  Object.assign(room, message["room"])  /// что єто?
}


</script>


<style lang="sass" scoped>

.activeButton


  &:hover
    background-color: #334225

.creatorInfo
  font-size: 25px

.tableElement
  font-size: 40px

.groupButtonCont
  display: flex  
  background-color: none
</style>