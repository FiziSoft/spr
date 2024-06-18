<template>
    <div class="share-buttons">
        
      <qrcode-vue :value="props.url" :size="128" class="qrShare"></qrcode-vue>

      
      <button @click="shareToWhatsApp" class="share-button whatsapp">
        <img src="@/assets/whatsapp.png" alt="WhatsApp" class="icon"/>
      </button>

      <button @click="shareToViber" class="share-button viber">
        <img src="@/assets/viber.png" alt="Viber" class="icon"/>
      </button>
      
      <button @click="shareToTelegram" class="share-button telegram">
        <img src="@/assets/telegram.png" alt="Telegram" class="icon"/>
      </button>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  import QrcodeVue from '@chenfengyuan/vue-qrcode';
  
  const props = defineProps({
    url: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: false,
      default: ''
    }
  });
  
  const shareToTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(props.url)}&text=${encodeURIComponent(props.text)}`;
    window.open(telegramUrl, '_blank');
  };
  
  const shareToWhatsApp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(props.text)}%20${encodeURIComponent(props.url)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const shareToViber = () => {
    const viberUrl = `viber://forward?text=${encodeURIComponent(props.text)}%20${encodeURIComponent(props.url)}`;
    window.open(viberUrl, '_blank');
  };
  </script>
  
  <style scoped>
  .share-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .share-button {
    padding: 10px;
    margin: 10px;
    /* background-color: #0088cc; */
    /* color: white; */
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .share-button:hover {
    background-color: #0077b3;
  }
  
  .share-button.whatsapp {
    /* background-color: #25D366; */
  }
  
  .share-button.whatsapp:hover {
    background-color: #1EBE53;
  }
  
  .share-button.viber {
    /* background-color: #665CAC; */
  }
  
  .share-button.viber:hover {
    background-color: #58499B;
  }
  
  .icon {
    width: auto;
    height: 45px;
  }
  
  .qrShare {
    margin-top: 20px;
  }
  </style>
  