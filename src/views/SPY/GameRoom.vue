<template>
  
  <GameLayout nameGame="Шпіон">
  <div class="mainContainer">

    <div class="creatorInfo"> Кімнату створив {{ room.name }} для {{ room.required_players }}-x гравців</div>
      <div  v-if="gameState === 'GameCanBeStart'">
        <h2> {{ cur_world }}</h2>
        <table class="formCreate">
          <thead>
            <tr>
              <th></th>
            
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in room.players" :key="i.id" class="formElement">
              <td class="tableElement"> {{ i.name }}</td>
              
            </tr>
            
          </tbody>
        </table>

        <div class="spyDiv" v-if="isSpy === true">
        <div>
          <ul v-for="i in room.theme" :key="i.id">
            <li>{{ i }}</li>
          </ul>
        </div>
        
        
        </div>

        <van-count-down class="timer"
          ref="countDown"
          millisecond
          :time=time_game 
          :auto-start="true"
          format="mm:ss"
          @finish="onFinish"
        />

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


{{eventType}}
    
   
  </div>
 
</div>
</GameLayout>
</template>


<script setup>
import {onBeforeMount, ref, reactive} from 'vue'
import { useRoute } from 'vue-router';
import QrcodeVue from 'qrcode.vue'
import GameLayout from '../GameLayout.vue';



let isSpy = ref(false)
let time_game = ref(0)
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
  show.value = false

  
}

let cur_world = ref("w")

websocket.onmessage = function (event){
  const message = JSON.parse(event.data);

  const eventType = message.event;
  if (message.hash){
    localStorage.setItem("hash", message.hash)
  }

  
  // TODO:
  if (eventType === "GameCanBeStart"){
    gameState.value = "GameCanBeStart"
    cur_world = message.world_spy
    console.log(message)
    time_game = parseInt(message.room.time_game) * 60000
    alert(time_game)
    

  }
  else if (["you_spy"].includes(eventType)){
    gameState.value = "GameCanBeStart"
    time_game = parseInt(message.room.time_game) * 60000
    choiseGet.value = true
    isSpy.value =true
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