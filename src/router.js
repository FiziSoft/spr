import {createWebHistory, createRouter} from 'vue-router'
import CreateRoom from './views/CreateRoom.vue'
import GameRoom from './views/GameRoom.vue'
import ConnectToRoom from './views/ConnectToRoom.vue'


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
    },

    {
        path: '/connect/:id',
        name: "Connect",
        component: ConnectToRoom
    }

]

export const router = createRouter({
    history: createWebHistory(),
    routes
})