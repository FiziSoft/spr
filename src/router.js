import {createWebHistory, createRouter} from 'vue-router'
import CreateRoom from './views/CreateRoom.vue'
import GameRoom from './views/GameRoom.vue'


const routes = [
    {
        path: '/',
        name: "CreateRoom",
        component: CreateRoom
    },

    {
        path: '/room/:id',
        name: "GameRoom",
        component: GameRoom
    }

]

export const router = createRouter({
    history: createWebHistory(),
    routes
})