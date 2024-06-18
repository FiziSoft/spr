<template>
<GameLayout nameGame="Шпіон">
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
  

  <div class="formElement">
            
    <label class="btn-gradient-1" for="">Time game:</label>
    <input v-model="time_game" type="text" id="" class="input-gradient">
                    
  </div>

  <div class="formElement">
            
            <label class="btn-gradient-1" for="">Вибрати тему:</label>
            <van-dropdown-menu  class="foo">
              <van-dropdown-item v-model="themes" :options="themes.value" :label="themes.value"/>
            </van-dropdown-menu>
                            
  </div>
  
        <!-- <div>
          <select v-model="theme_str">
            <option  v-for="(theme, i) in themes" v-bind:key="i" value = {{ theme }} >{{ theme }}</option>
          </select>
        </div>
           -->
    <div>
      <select v-model="theme_str">
        <option selected disabled value="">Choose</option>
        <option v-for="(result, index) in themes" v-bind:key="index" :value="result">{{ result }}</option>
      </select>
      
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
import {ref, computed, onMounted} from "vue";
import {router} from "../../router.js";
import GameLayout from "../GameLayout.vue";

const playerName = ref(localStorage.getItem('playerName'))
const roomName = playerName.value;
const numPlayers = ref(null);
const time_game = ref(null)
const theme_str = ref(null)

const value2 = ref('');
const option2 = [
      { text: 'тематика', value: '' },
      { text: 'Option B', value: 'b' },
      { text: 'Option C', value: 'c' },
    ];

const themes = ref([])

const getPosts=()=>{
  return axios.get("http://127.0.0.1:7000/getThemes")
    .then((res)=>themes.value=res.data)
    .catch((error)=>console.log(error))
}


onMounted(()=>{
  getPosts();
  
})




const isButtonActive = computed(()=>{
  return playerName.value &&  numPlayers.value && time_game.value && theme_str.value
})

const sendCreateRoomRequest = async () => {
  const response = await axios.post(
      "http://127.0.0.1:7000/create_room",
      null,
      {
        params: {
          name: roomName,
          req_players: numPlayers.value,
          time_game: time_game.value,
          theme_str: theme_str.value
        },
      }
  )
  
  
  const roomId = response.data.id 
  localStorage.setItem('playerName', playerName.value )
  router.push({name: 'spyGameRoom', params:{id:roomId}})
}
</script>

<style>

</style>