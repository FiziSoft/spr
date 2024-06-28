<template>
  <div class="containerBattle">
    <h1>Battleship Game</h1>
    <div v-if="playerBoard.length && opponentBoard.length" class="boards">
      <div>
        <h2>Your Board</h2>
        <div class="board">
          <div class="row" v-for="(row, rowIndex) in playerBoard" :key="rowIndex">
            <div
              class="cell"
              v-for="(cell, colIndex) in row"
              :key="colIndex"
              :class="getCellClass('player', rowIndex, colIndex)"
            ></div>
          </div>
        </div>
      </div>
      <div>
        <h2>Opponent Board</h2>
        <div class="board">
          <div class="row" v-for="(row, rowIndex) in opponentBoard" :key="rowIndex">
            <div
              class="cell"
              v-for="(cell, colIndex) in row"
              :key="colIndex"
              :class="getCellClass('opponent', rowIndex, colIndex)"
              @click="handleCellClick(rowIndex, colIndex)"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <p v-if="turn === playerId">Your turn!</p>
    <p v-else>Waiting for opponent's turn...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const roomId = route.params.roomId;
const playerId = route.params.playerId;
const ws = ref(null);

const playerBoard = ref([]);
const opponentBoard = ref([]);
const turn = ref('');

const getCellClass = (boardType, row, col) => {
  let board;
  if (boardType === 'player') {
    board = playerBoard.value;
  } else {
    board = opponentBoard.value;
  }
  if (board && board[row] && board[row][col]) {
    return board[row][col] === '1' ? 'ship' : board[row][col];
  }
  return '';
};

const handleCellClick = (row, col) => {
  if (ws.value && turn.value === playerId) {
    ws.value.send(JSON.stringify({ type: 'fire', row, col }));
  }
};

onMounted(() => {
  ws.value = new WebSocket(`ws://localhost:8000/ws/${roomId}/${playerId}`);

  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'initialState') {
      playerBoard.value = data.playerBoard;
      opponentBoard.value = data.opponentBoard;
      turn.value = data.turn;
    } else if (data.type === 'updateBoard') {
      if (data.player === 'player') {
        playerBoard.value = data.board;
      } else {
        opponentBoard.value = data.board;
      }
      turn.value = data.turn;
    }
  };

  ws.value.onopen = () => {
    console.log('WebSocket connection established');
  };

  ws.value.onclose = () => {
    console.log('WebSocket connection closed');
  };

  ws.value.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
});

onBeforeUnmount(() => {
  ws.value.close();
});
</script>

<style>
.containerBattle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.boards {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}
.board {
  display: flex;
  flex-direction: column;
  margin: 10px 0;
}
.row {
  display: flex;
}
.cell {
  width: 40px;
  height: 40px;
  border: 1px solid black;
}
.cell.ship {
  background-color: gray;
}
.cell.hit {
  background-color: red;
}
.cell.miss {
  background-color: lightblue;
}
</style>
