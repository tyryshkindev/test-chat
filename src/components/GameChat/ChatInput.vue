<template>
    <div class="wrapper">
        <div class="chat__input">
            <div class="chat__input-field">
                <input @keydown.enter="onEnterClick" ref="inputRef" type="text" v-model.trim="chatInput"
                    class="chat__input-field__text" placeholder="Введите сообщение...">
                <button @click="handleMessageSending" class="chat__input-field__send">
                    <span class="chat__input-field__send-language">{{ props.currentLanguage }}</span>
                    <img draggable="false" src="@/assets/images/GameChat/message-send.svg" width="8" height="12">
                </button>
            </div>
        </div>
        <ChatInputCommandSelection :searchQuery="chatInput" @update:searchQuery="setChatInput"
            @update:commandsListLength="setCommandsListLength" />
    </div>
</template>

<script setup lang="ts">
import { useFocus } from '@vueuse/core';
import { computed, nextTick, ref, watch } from 'vue';
import { useCommandParser } from '@/composables/useCommandParser';
import ChatInputCommandSelection from './ChatInputCommandSelection.vue';
const props = defineProps<{
    currentLanguage?: string,
    isInputActive?: boolean
}>()
const chatInput = ref('');
const commandsListLength = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);

const { focused } = useFocus(inputRef, { initialValue: true });
const { parseCommand } = useCommandParser();

const emit = defineEmits<{
    (e: 'sendMessage', message: string): void,
    (e: 'toggleInput', isActive: boolean): void,
    (e: 'sendCommand', command: string, ...args: string[]): void
}>()

const isCommand = computed(() => chatInput.value.startsWith('/'));

const handleMessageSending = () => {
    if (!chatInput.value) return;

    if (isCommand.value) handleCommandSending();
    else {
        emit('sendMessage', chatInput.value);
        toggleInput();
    }
};

const handleCommandSending = () => {
    const result = parseCommand(chatInput.value);

    if (!result) return
    emit('sendCommand', result.commandName, ...result.args);
    toggleInput();
};

const toggleInput = () => {
    emit('toggleInput', false);
    chatInput.value = '';
};

const setCommandsListLength = (newLength: number) => {
    commandsListLength.value = newLength
}

const setChatInput = (newInput: string) => {
    chatInput.value = newInput;
    focused.value = true;
}

const onEnterClick = () => {
    if (commandsListLength.value) return
    handleMessageSending()
}

watch(() => props.isInputActive,
    async () => {
        chatInput.value = '';
        await nextTick();
        focused.value = true;
    }
)
</script>

<style lang="scss" scoped>
@use "@/assets/styles/GameChat/ChatInput.scss" as chatInput;
</style>