import {createWebHistory, createRouter} from 'vue-router'
import MainPage from './views/MainPage.vue'
import CreateRoom from './views/PRS/CreateRoom.vue'
import GameRoom from './views/PRS/GameRoom.vue'
import ConnectToRoom from './views/PRS/ConnectToRoom.vue'
import GameLayout from './views/GameLayout.vue'
import spyCreateRoom from './views/SPY/CreateRoom.vue'
import spyGameRoom from './views/SPY/GameRoom.vue'
import spyConnectToRoom from './views/SPY/ConnectToRoom.vue'
import TodCreateRoom from './views/TOD/TodCreateRoom.vue'
import TodGameRoom from './views/TOD/TodGameRoom.vue'
import DataView from './components/DataView.vue'


const routes = [
    {
        path: '/',
        name: "Main",
        component: MainPage
    },

    {
        path: '/CreateRoom',
        name: "CreateRoom",
        component: CreateRoom
    },

    {
        path: '/spy/CreateRoom',
        name: "spyCreateRoom",
        component: spyCreateRoom
    },

    {
        path: '/room/:id',
        name: "GameRoom",
        component: GameRoom
    },

    {
        path: '/spy/room/:id',
        name: 'spyGameRoom',
        component: spyGameRoom,
        props: true // Разрешить передачу параметров как свойства компонента
    },

    {
        path: '/connect/:id',
        name: "Connect",
        component: ConnectToRoom
    },

    {
        path: '/connect/:id',
        name: "Connect",
        component: spyConnectToRoom
    },

    {
        path: '/tod',
        name: "TOD",
        component: TodCreateRoom
    },

    {
        path: '/tod/room',
        name: "TOD_room",
        component: TodGameRoom
    },
    {
        path: '/tod-view/:roomId',
        name: 'DataView',
        component: DataView,
        props: true
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})