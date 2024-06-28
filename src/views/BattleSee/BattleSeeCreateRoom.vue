<template>
  <div>Creating room...</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8000/create_room');
    const roomId = response.data.room_id;
    router.push(`/battle-see/${roomId}/player1`);
  } catch (error) {
    console.error("Error creating room:", error);
  }
});
</script>
