<template>
    <div>
      <h1>Create Truth or Dare</h1>
      <form @submit.prevent="createTruthDare">
        <div>
          <label for="body">Body:</label>
          <input v-model="form.body" id="body" required />
        </div>
        <div>
          <label for="category">Category:</label>
          <input v-model="form.category" id="category" required />
        </div>
        <div>
          <label for="is_truth">Is Truth:</label>
          <input type="checkbox" v-model="form.is_truth" id="is_truth" />
        </div>
        <div>
          <label for="timer">Timer:</label>
          <input v-model="form.timer" id="timer" type="number" />
        </div>
        <div>
          <label for="rank">Rank:</label>
          <input v-model="form.rank" id="rank" type="number" />
        </div>
        <div>
          <label for="is_boy">Is Boy:</label>
          <input type="checkbox" v-model="form.is_boy" id="is_boy" />
        </div>
        <button type="submit">Create</button>
      </form>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const form = ref({
    body: '',
    category: '',
    is_truth: false,
    timer: 0,
    rank: null,
    is_boy: null
  });
  
  const error = ref('');
  
  const createTruthDare = async () => {
    try {
      await axios.post('http://localhost:8001/truth_dares/', form.value);
      form.value = {
        body: '',
        category: '',
        is_truth: false,
        timer: 0,
        rank: null,
        is_boy: null
      };
      error.value = '';
    } catch (err) {
      error.value = 'Failed to create Truth or Dare.';
    }
  };
  </script>
  