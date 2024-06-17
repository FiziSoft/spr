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
    font-size: 60px
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