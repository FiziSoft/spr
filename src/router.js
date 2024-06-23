import {createWebHistory, createRouter} from 'vue-router'
import CreateRoom from './views/PRS/CreateRoom.vue'
import GameRoom from './views/PRS/GameRoom.vue'
import ConnectToRoom from './views/PRS/ConnectToRoom.vue'


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