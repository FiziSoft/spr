<template>

<div class="mainContainer mainPage">
    <div>Main Page</div> 

    <div  class="name_game">
       <a :href="network_url+'/CreateRoom'"><h1 class=""><span>PRS GAME</span></h1></a>
    </div>
    <div  class="name_game">
       <a :href="network_url+'/spy/CreateRoom'"><h1 class=""><span>SPYYYYYY GAME</span></h1></a>
    </div>

    <div  class="name_game">
       <a :href="network_url+'/tod' "><h1 class=""><span>Правда або Дія</span></h1></a>
    </div>


<h5>PRS - Create Game</h5>


<br>

<h2>{{ ti_me }}</h2>


</div>
</template>

<script setup>
import { ref } from 'vue';

let ti_me = Date();

// const network_url = ref('http://192.168.0.105:8080')
const network_url = ref('http://localhost:8080')



</script>
<style lang="sass">

.name_game
  border: 1px solid
  padding: 20px
  border-radius: 12px 
  margin: 20px
</style>