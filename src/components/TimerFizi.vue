<template>
  <div class="timerContainer">
    <button v-if="!isRunning && !timeUp" @click="startTimer" class="start_button btn-grad">Старт</button>
    <p v-if="!timeUp">{{ formattedTime }}</p>
    <p v-else>Время вышло</p>
   
    <audio ref="audioRef"></audio>
  </div>
</template>

<script>
import { ref, computed, onUnmounted, defineComponent, watch, onMounted } from 'vue';

export default defineComponent({
  name: 'TimerFizi',
  props: {
    timeInSeconds: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const timeLeft = ref(props.timeInSeconds);
    const intervalId = ref(null);
    const isRunning = ref(false);
    const timeUp = ref(false);
    const audioRef = ref(null);

    const formattedTime = computed(() => {
      const minutes = Math.floor(timeLeft.value / 60);
      const seconds = timeLeft.value % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    });

    const tick = () => {
      if (timeLeft.value > 0) {
        timeLeft.value -= 1;
      } else {
        clearInterval(intervalId.value);
        isRunning.value = false;
        timeUp.value = true;
        if (audioRef.value) {
          audioRef.value.play();
        }
      }
    };

    const startTimer = () => {
      if (!isRunning.value) {
        isRunning.value = true;
        timeUp.value = false;
        timeLeft.value = props.timeInSeconds; // Сброс времени на начальное значение
        intervalId.value = setInterval(tick, 1000);
      }
    };

    watch(() => props.timeInSeconds, (newTime) => {
      if (!isRunning.value) {
        timeLeft.value = newTime;
      }
    });

    onMounted(() => {
      if (audioRef.value) {
        audioRef.value.src = require('@/assets/sound/alarm.mp3'); // Динамический импорт
      }
    });

    onUnmounted(() => {
      clearInterval(intervalId.value);
    });

    return {
      formattedTime,
      startTimer,
      isRunning,
      timeUp,
      audioRef
    };
  }
});
</script>

<style scoped>
p {
  font-size: 2rem;
  font-weight: bold;
}

.start_button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: transparent;
  border: 1px solid;
  border-radius: 12px;
  margin-right: 50px;
  margin-top: 0;
}

.timerContainer {
  display: flex;
  margin: 30px;
  justify-content: space-around;
  align-items: center;
}
</style>
