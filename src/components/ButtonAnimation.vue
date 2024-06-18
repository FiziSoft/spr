<template>
  <div class="container">
    <button v-if="isVisible('button1')" ref="button1" class="button">Правда</button>
    <button v-if="isVisible('button2')" ref="button2" class="button">Действие</button>
    <button v-if="isVisible('button3')" @click="startAnimation" class="button">Кнопка 3</button>
    <input v-if="isVisible('button3')" v-model.number="rotationDuration" type="number" placeholder="Время вращения (сек)" />
    <button @click="resetState" class="button">Сброс</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { gsap } from 'gsap';

const button1 = ref(null);
const button2 = ref(null);
const rotationDuration = ref(8); // Общее время поочередного вращения в секундах
const hiddenButtons = ref([]);

// Function to check button visibility
const isVisible = (button) => !hiddenButtons.value.includes(button);

const resetState = () => {
  hiddenButtons.value = [];
  rotationDuration.value = 8;
  if (button1.value) gsap.set(button1.value, { rotationZ: 0 });
  if (button2.value) gsap.set(button2.value, { rotationZ: 0 });
};

const startAnimation = () => {
  if (button1.value && button2.value) {
    const durationPerButton = 0.3; // Продолжительность анимации одного цикла (в секундах)
    const totalCycles = Math.floor(rotationDuration.value / durationPerButton);

    const tl = gsap.timeline({
      onComplete: () => {
        // Выбор случайной кнопки
        const selectedButton = Math.random() < 0.5 ? 'button1' : 'button2';
        alert(selectedButton === 'button1' ? 'Правда' : 'Действие');
        hiddenButtons.value = selectedButton === 'button1' ? ['button2', 'button3'] : ['button1', 'button3'];
        
        // Выровнять оставшуюся кнопку в обычное положение
        if (selectedButton === 'button1') {
          gsap.set(button1.value, { rotationZ: 0 });
        } else {
          gsap.set(button2.value, { rotationZ: 0 });
        }
      }
    });

    for (let i = 0; i < totalCycles; i++) {
      tl.to(button1.value, {
        duration: durationPerButton,
        rotationZ: '+=360',
        ease: 'linear'
      });
      tl.to(button2.value, {
        duration: durationPerButton,
        rotationZ: '+=360',
        ease: 'linear'
      }, `-=${durationPerButton / 2}`);
    }

    // Остановка анимации через заданное время
    setTimeout(() => {
      gsap.killTweensOf(button1.value);
      gsap.killTweensOf(button2.value);
      tl.progress(1); // Принудительно завершить таймлайн
    }, rotationDuration.value * 1000);
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px;
}

.button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: transparent;
  border: 1px solid;
  border-radius: 12px;
  perspective: 1000px; /* Добавим перспективу */
  margin: 10px;
}

input {
  margin-top: 20px;
  padding: 10px;
  font-size: 1rem;
  border-radius: 12px;
  border: 1px solid;
}
</style>
