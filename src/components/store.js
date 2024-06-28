import { createStore } from 'vuex';

export default createStore({
  state: {
    playerBoard: [],
    opponentBoard: [],
    turn: '',
    playerId: '',
    roomId: ''
  },
  mutations: {
    setPlayerBoard(state, board) {
      state.playerBoard = board;
    },
    setOpponentBoard(state, board) {
      state.opponentBoard = board;
    },
    setTurn(state, turn) {
      state.turn = turn;
    },
    setPlayerId(state, playerId) {
      state.playerId = playerId;
    },
    setRoomId(state, roomId) {
      state.roomId = roomId;
    },
    updateBoard(state, { player, board }) {
      if (player === 'player') {
        state.playerBoard = board;
      } else {
        state.opponentBoard = board;
      }
    }
  },
  actions: {
    initialize({ commit }, { playerId, roomId }) {
      commit('setPlayerId', playerId);
      commit('setRoomId', roomId);
    },
    setPlayerBoard({ commit }, board) {
      commit('setPlayerBoard', board);
    },
    setOpponentBoard({ commit }, board) {
      commit('setOpponentBoard', board);
    },
    setTurn({ commit }, turn) {
      commit('setTurn', turn);
    },
    updateBoard({ commit }, data) {
      commit('updateBoard', data);
    }
  }
});
