<script setup lang="ts">
import ChatWindow from '@/components/GameChat/ChatWindow.vue';
</script>
<template>
  <div class="app">
    <ChatWindow />
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none;
  color: #fff;
}

*:before,
*:after {
  box-sizing: border-box;
  pointer-events: none;
}

ul,
li,
ol {
  list-style-type: none;
}

button,
input {
  font-family: inherit;
  background: transparent;
  border: none;
  outline: none;
}

button::placeholder,
input::placeholder {
  color: inherit;
}

input::selection,
textarea::selection {
  background-color: rgba(132, 158, 250, 0.664);
}

html,
body {
  line-height: 1;
  user-select: none;
  overflow: hidden !important;
  font-family: 'Montserrat', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
}

.app {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
