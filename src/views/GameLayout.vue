<template>

<div class="mainContainer">
    

    
    <div class="mainHeader ">
        <div>{{nameGame}}</div>
    </div>
    <div class="mainBody">
    <slot></slot>
    </div>
    <div class="mainFooter">
        <span class="menuFizi">FiziGames </span>
    </div>
</div>


</template>    

<script setup>
import { toRefs, defineProps } from 'vue';

const onClickLeft = () => history.back();

import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();



const props = defineProps({
    nameGame:{
        type: String,
        required: true,
    },
});
</script>

<style lang="sass" scoped>


.mainHeader
    width: 100%
    display: flex
    justify-content: center

    text-align: center
    font-size: 40px
    font-weight: 100 
    height: 90px

.mainBody
    
    margin: 10px
    width: 100%

    flex: 1 1 auto


.mainFooter
    display: flex   
    justify-content: center
    align-items: center


    width: 100%

    padding: 30px
    height: 50px
    background: #434444
    

   

</style>