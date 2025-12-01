<template>
    <div class="chat__window" :class="{ 'chat__window-scrollable': isInputActive }">
        <p class="chat__window-item">hello world!</p>
        <p class="chat__window-item">hello world!</p>
        <p class="chat__window-item">hello world!</p>
        <p class="chat__window-item">hello world!</p>
        <p class="chat__window-item">hello world!</p>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const isInputActive = ref(false)
</script>

<style scoped lang="scss">
.chat__window {
    position: absolute;
    left: 16px;
    top: 8px;
    width: 100%;
    max-width: 523px;
    min-width: 260px;
    height: 100%;
    max-height: 233px;
    min-height: 130px;
    background-color: rgba(17, 17, 17, 0.5);
    border-radius: 10px;
    padding: 12px 11px 18px;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    gap: 4px;
    overflow-y: scroll;

    &::-webkit-scrollbar {
        width: 0;
        background-color: transparent;
    }

    &-scrollable {
        overflow-y: auto;

        &::-webkit-scrollbar {
            width: 4px;
            background-color: rgba(255, 255, 255, 0.2);
        }
    }
}
</style>