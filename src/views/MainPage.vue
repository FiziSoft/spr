<template>


    <div>Main Page</div>
<a href="http://localhost:8080/CreateRoom"><h1 class="">PRS - Create Game</h1></a>
<h5>PRS - Create Game</h5>

<van-button loading type="success" loading-text="Loading..." />
<br>
<van-button color="linear-gradient(to right, #ff6034, #ee0a24)">
  Gradient
</van-button>
<van-cell title="Show Popup" is-link @click="showPopup" />

<van-button type="success">Success</van-button>



<van-cell title="&#9728;" @click="showShare = true" />
<van-share-sheet
  v-model:show="showShare"
  title="Share"
  :options="options"
  @select="onSelect"
/>

<van-popup
  v-model:show="showBottom"
  position="bottom"
  :style="{ height: '30%' }"
/>


<van-tabbar v-model="active">
  <van-tabbar-item icon="home-o">Tab</van-tabbar-item>
  <van-tabbar-item icon="search">Tab</van-tabbar-item>
  
  <van-tabbar-item icon="setting-o">Tab</van-tabbar-item>
</van-tabbar>

</template>

<script setup>
import { ref } from 'vue';
import { showToast } from 'vant';


const showBottom = ref(false);
    const showPopup = () => {
      showBottom.value = true;
    };

const active = ref(0)

const showShare = ref(false);
    const options = [
      { name: 'WeChat', icon: 'wechat' },
      { name: 'Weibo', icon: 'weibo' },
      { name: 'Link', icon: 'link' },
      { name: 'Poster', icon: 'poster' },
      { name: 'Qrcode', icon: 'qrcode' },
    ];

    const onSelect = (option) => {
      showToast(option.name);
      showShare.value = false;
    };


</script>
<style>
</style>