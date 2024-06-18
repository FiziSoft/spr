<template>
<GameLayout nameGame="Камінь Ножиці Бумага">
<div class="containerFormCreate">
  <form class="formCreate">


    <div class="formElement">
            
      <label class="btn-gradient-1" for="">Ваше ім'я:</label>
      <input v-model="playerName" type="text" id="" class="input-gradient">
              
    </div>

  <div class="formElement">
    <label class="">
        Кількість гравців:
    </label>
    <input v-model="numPlayers"
      class="input-gradient"
      placeholder=" " />
      
    
  </div>
  
  <div class="btnDiv">
        <button :disabled="!isButtonActive" type="button" @click="sendCreateRoomRequest" class="btn-grad"> Почати гру </button>
  </div>
    </form>
 
  

</div>
</GameLayout>


  
</template>

<script setup>

import axios from "axios";
import {ref, computed} from "vue";
import {router} from "../../router.js";
import GameLayout from "../GameLayout.vue";

const playerName = ref(localStorage.getItem('playerName'))
const roomName = playerName.value;
const numPlayers = ref(null);

const isButtonActive = computed(()=>{
  return playerName.value &&  numPlayers.value
})

const sendCreateRoomRequest = async () => {
  const response = await axios.post(
      "http://127.0.0.1:7000/create_room",
      null,
      {
        params: {
          name: roomName,
          req_players: numPlayers.value
         
        },
      }
  )
  
  
  const roomId = response.data.id 
  localStorage.setItem('playerName', playerName.value )
  router.push({name: 'GameRoom', params:{id:roomId}})
}
</script>

<style>

</style>