<style lang="sass">
.nameCurPlayer
  font-size: 30px
  text-align: center
  padding-bottom: 40px  


  .fade-enter-active, .fade-leave-active 
    transition: opacity 0.5s

  .fade-enter-from, .fade-leave-to 
    opacity: 0

  button.disabled 
    cursor: not-allowed
    opacity: 0.5
    background-image: none
    background-color: transparent



.refresh_button
  margin-top: 20px
  font-size: 30px
  margin-right: 150px
</style>

<template>

<GameLayout nameGame="Правда або Дія">
  <WebSocketComponent :name="cur_player.name" :body="share_info" :title="cur_title" :roomId="roomId" ref="websocketComponent" />

    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/tod-view">TOD View</router-link>
    </nav>
    <router-view></router-view> <!-- Это для отображения маршрутов -->
    <div>{{ tod_url_view }}</div>
  <div class="container">
   
    
    <!-- <input v-if="isVisible('button3')" v-model.number="rotationDuration" type="number" placeholder="Время вращения (сек)" /> -->
    <!-- <button @click="resetState" class="button">Сброс</button> -->
  </div>  



    <div class="containerFormCreate">
    <div class="formCreate" v-if="choise_div===true">
      <!-- <div class="formCreate" > -->
        <div class="nameCurPlayer">  <h1>{{ cur_player.name }}</h1></div>
          <transition name="fade" >
        
          <button v-if="isVisible('button1')" ref="button1" v-show="truth_div===true" @click="go_truths()" class="btn-grad">Правда</button>
      </transition>
      <transition name="fade">
        <button v-if="isVisible('button2')" ref="button2"  v-show="dares_div===true" @click="go_dares()" class="btn-grad">Дія</button>
      </transition>
      
        <!-- <button @click="callRandomFunction" class="btn-grad">Випадково</button> -->
        <button v-if="showButton3 && isVisible('button3')" @click="startAnimation"  class="btn-grad">Випадково</button>
      
     
        <!-- <ul>
            <li v-for="(i, y) in cur_players" :key="y">{{ i.name }} - {{ y }} - {{ i.value }} </li>
        </ul> -->
    </div>
    <div class="formCreate" v-if="choise_div===false && truth_div===true">
      <button class="name_button">  Правда </button>
        <div class="formElement">
          <h3><span class="bold">{{ cur_player.name }}</span> <hr>{{ cur_truth.question }}</h3>
        </div>
        

        <button class="btn-grad w50" @click="next_round"> OK </button>
       <div>
        <i class="fas fa-sync-alt refresh_button" @click="go_truths()"> </i>
      </div>
    </div>

    <div class="formCreate" v-if="choise_div===false && dares_div===true">
      <button class="name_button"> Дія </button>

        <div class="formElement">
          <h3><span class="bold">{{ cur_player.name }}</span> <hr>{{ cur_dare.task }}</h3>
        </div>
        <button class="btn-grad w50" @click="next_round"> OK </button>
        <TimerFizi :timeInSeconds="5" />
        <div>
          <i class="fas fa-sync-alt refresh_button" @click="go_dares()"> </i>
        </div>

    </div>
    <ShareButton @share="handleShare"  :url="tod_url_view"  :text= "text_share"/>
    <!-- <ButtonAnimation /> -->

    
</div>


  
</GameLayout>
   

</template> 



<script setup>
import GameLayout from '../GameLayout.vue';

import {onMounted, ref, toRefs, watch, onUnmounted, computed} from 'vue'

import gsap from 'gsap';

import TimerFizi from '@/components/TimerFizi.vue';
// import ButtonAnimation from '@/components/ButtonAnimation.vue'; // Путь к компоненту
import TelegramShareButton  from '@/components/TelegramShareButton.vue'; // Путь к компоненту
import ShareButton  from '@/components/ShareButton.vue'; // Путь к компоненту
import WebSocketComponent  from '@/components/WebSocketComponent.vue'; // Путь к компоненту




const button1 = ref(null);
const button2 = ref(null);
const rotationDuration = ref(1.5); // Общее время поочередного вращения в секундах
const hiddenButtons = ref([]);
const showButton3 = ref(true);

// Function to check button visibility
const isVisible = (button) => !hiddenButtons.value.includes(button);

const resetState = () => {
  hiddenButtons.value = [];
  rotationDuration.value = 2.5;
  showButton3.value = true;
  if (button1.value) {
    gsap.set(button1.value, { rotationZ: 0, scale: 1, opacity: 1 });
    button1.value.style.backgroundPosition = '0% 50%';
  }
  if (button2.value) {
    gsap.set(button2.value, { rotationZ: 0, scale: 1, opacity: 1 });
    button2.value.style.backgroundPosition = '0% 50%';
  }
};

const startAnimation = () => {
  if (button1.value && button2.value) {
    // Скрываем кнопку 3 сразу после нажатия
    showButton3.value = false;

    const durationPerButton = 0.8; // Продолжительность анимации одного цикла (в секундах)
    const totalCycles = Math.floor(rotationDuration.value / durationPerButton);

    // Выбор случайной кнопки перед началом анимации
    const selectedButton = Math.random() < 0.5 ? 'button1' : 'button2';
    const notSelectedButton = selectedButton === 'button1' ? button2.value : button1.value;
    const selectedButtonRef = selectedButton === 'button1' ? button1.value : button2.value;

    const tl = gsap.timeline({
      onComplete: () => {
        if (selectedButton === 'button1') {
          go_truths();
        } else {
          go_dares();
        }
        hiddenButtons.value = selectedButton === 'button1' ? ['button2', 'button3'] : ['button1', 'button3'];
        
        
      }
    });

    for (let i = 0; i < totalCycles; i++) {
      tl.to(button1.value, {
        duration: durationPerButton,
        rotationX: '+=360',
        scale: 1,
        ease: 'linear'
      });
      tl.to(button2.value, {
        duration: durationPerButton,
        rotationX: '+=360',
        scale: 1,
        ease: 'linear'
      }, `-=${durationPerButton / 2}`);
    }

    // Уменьшение скорости вращения и исчезновение не выбранной кнопки на половине времени анимации
    setTimeout(() => {
      gsap.to(notSelectedButton, {
        duration: rotationDuration.value / 6,
        opacity: 0,
        ease: 'linear'
      });
      gsap.to(tl, {
        timeScale: 0.9,
        duration: rotationDuration.value / 2,
        ease: 'linear'
      });
    }, (rotationDuration.value * 1000) / 2);

    // Анимация прокрутки фона
    const animateBackground = (element) => {
      gsap.to(element, {
        backgroundPosition: '100% 50%',
        duration: 3,
        ease: 'linear',
        repeat: -1
      });
    };

    animateBackground(button1.value);
    animateBackground(button2.value);

    // Остановка анимации через заданное время
    setTimeout(() => {
      gsap.killTweensOf(button1.value);
      gsap.killTweensOf(button2.value);
      tl.progress(1); // Принудительно завершить таймлайн
    }, rotationDuration.value * 1000);
  }
};






const cur_players = JSON.parse(localStorage.players)

const share_div = ref(false)
let choise_div = ref(true)
let truth_div =ref(true)
let dares_div = ref(true)

let count_players = ref(0)

let cur_truth = ref('')
let count_truth = ref(0)

let cur_dare = ref('')
let count_dares = ref(0)

let cur_player = ref(cur_players[0])
let pre_player = ref(cur_players[count_players.value-1])
let actual_name = ref('')


const tod_url_view = ref(localStorage.getItem('tod_url_view'))
let url_actual = ref('')

onMounted(() => {

  url_actual = toRefs(tod_url_view)

})


let share_info = ref('')
let cur_title = ref('')
const text_share = 'Найкращі онлайн настільні ігри Fizi Games'

const get_cur_players = (index) => {cur_player.value = cur_players[index]}

const websocketComponent = ref(null)

const triggerSendMessage = () => {
  if (websocketComponent.value && websocketComponent.value.sendButton) {
    websocketComponent.value.sendButton.click() // Имитация нажатия кнопки
  }
}


const next_round=onMounted(()=>{
  get_cur_players(count_players.value)

    
       
    if(count_players.value < Object.keys(cur_players).length-1){
      count_players.value++
    }
    else{count_players.value = 0}

    choise_div.value=true
    truth_div.value=true
    dares_div.value=true
    resetState()
})


const sendMessageOnRoom = onMounted(()=>{
  triggerSendMessage()
})

// Правда и действие формируются закдром и флагами их можно показывать

const go_truths = () =>{
   
    cur_truth.value = get_truth()

    if(count_truth.value<truths.length-1){
      count_truth.value++
    }
    else{
      count_truth.value = 0
    }
    choise_div.value=false
    truth_div.value=true
    dares_div.value= false

    cur_title.value = "Правда"
    share_info.value = cur_truth.value.question
  
    triggerSendMessage()
   
}



function get_truth(){
  // if(cur_players.value.isBoy === true){
  //   alert('Boy')
  // }
  // else{
  //   alert('Girl')
  // }

  return truths[count_truth.value]
}

const go_dares = () =>{

    cur_dare.value = get_dares()

   if(count_dares.value<dares.length-1){
      count_dares.value++
    }
    else{
      count_dares.value = 0
    }
    choise_div.value=false
    truth_div.value= false
    dares_div.value= true

    cur_title.value = "Дія"
    share_info.value = cur_dare.value.question
    sendMessageOnRoom()
  }

function get_dares(){

let cur_dare = dares[count_dares.value]
// let www =cur_dare.task.replaceAll(' ж ',' Антонина ')
let wwww = cur_dare.task
let qw = wwww.fi

return cur_dare
}

// function callRandomFunction() {
//   const functions = [go_truths, go_dares];
//   const randomFunction = functions[Math.floor(Math.random() * functions.length)];
//   randomFunction();  // Вызов случайной функции
// }
const truths = 
  [
    {
      "question": "Какой у тебя был самый неловкий момент во время интимной близости?"
    },
    {
      "question": "Расскажи о самом странном месте, где у тебя был секс."
    },
    {
      "question": "Было ли у тебя желание изменить своему партнеру? Если да, то почему?"
    },
    {
      "question": "Расскажи о своем самом странной сексуальном фантазии."
    },
    {
      "question": "Было ли у тебя когда-нибудь секс втроем? Если да, то как это было?"
    }
  ]



const dares=

  [
    {
      "task": "Покажи свою ж самую ж соблазнительную  ж позу."
    },
    {
      "task": "Сделай массаж ж кому-нибудь из присутствующих в течение 5 минут."
    },
    {
      "task": "Сними одну из ж своих вещей по ж выбору группы."
    },
    {
      "task": "Поцелуй кого-нибудь ж из присутствующих на выбор группы."
    },
    {
      "task": "Позволь кому-нибудь ж из группы написать что-то на твоем теле."
    }
  ]


  
// const users = JSON.parse(localStorage.getItem('users'))


</script>