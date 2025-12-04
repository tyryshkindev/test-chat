<template>
    <div class="wrapper">
        <div class="chat__input">
            <div class="chat__input-field">
                <input ref="inputRef" type="text" v-model.trim="chatInput" class="chat__input-field__text"
                    placeholder="Введите сообщение...">
                <button @click="handleMessageSending" class="chat__input-field__send">
                    <span class="chat__input-field__send-language">{{ props.currentLanguage }}</span>
                    <img draggable="false" src="@/assets/images/GameChat/message-send.svg" width="8" height="12">
                </button>
            </div>
        </div>
        <ChatInputCommandSelection :searchQuery="chatInput" @update:searchQuery="setChatInput" />
    </div>
</template>

<script setup lang="ts">
import { useFocus, onKeyStroke } from '@vueuse/core';
import { computed, nextTick, ref, watch } from 'vue';
import ChatInputCommandSelection from './ChatInputCommandSelection.vue';
const props = defineProps<{
    currentLanguage?: string,
    isInputActive?: boolean
}>()
const chatInput = ref('');
const inputRef = ref<HTMLInputElement | null>(null);
const { focused } = useFocus(inputRef, { initialValue: true });

const emit = defineEmits<{
    (e: 'sendMessage', message: string): void,
    (e: 'toggleInput', isActive: boolean): void,
}>()

const isCommand = computed(() => chatInput.value.startsWith('/'));

const handleMessageSending = () => {
    if (chatInput.value) emit('sendMessage', chatInput.value);
    emit('toggleInput', false);
    chatInput.value = '';
}

const setChatInput = (newInput: string) => {
    chatInput.value = newInput;
    focused.value = true;
}

watch(() => props.isInputActive,
    async () => {
        chatInput.value = '';
        await nextTick();
        focused.value = true;
    }
)
onKeyStroke('Enter', () => {
    if (isCommand.value) return
    handleMessageSending()
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/GameChat/ChatInput.scss" as chatInput;
</style>