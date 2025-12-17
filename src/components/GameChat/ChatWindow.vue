<template>
    <div ref="windowRef" class="chat__window">
        <div ref="chatRef" class="chat__window-list" :class="{ 'chat__window-list__active': isInputActive }">
            <ChatMessage v-for="chatMessage in chatMessages" :key="chatMessage.id"
                :messageType="chatMessage.messageType" :messageContent="chatMessage.messageContent"
                :messageAuthor="chatMessage.messageAuthor" :tryResult="chatMessage.tryResult" />
        </div>
        <ChatInput v-show="isInputActive" @sendMessage="sendMessage" @sendCommand="sendCommand"
            @toggleInput="toggleInput" :isInputActive="isInputActive" :currentLanguage="currentLanguage" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";
import { useScroll, useEventListener, onClickOutside, onKeyStroke } from "@vueuse/core";
import { useInterface } from "@/composables/useInterface";
import { useWebSocket } from "@/composables/useWebsocket";
import ChatMessage from "@/components/GameChat/ChatMessage.vue";
import type { MessagePayload } from "@/types/chatMessages";
import ChatInput from "@/components/GameChat/ChatInput.vue";

const { param, events, updateData } = useInterface("Chat");

const rawChatMessages = param("chatMessages", []);
const rawCurrentLanguage = param("currentLanguage", "en");
const isInputActive = ref(false);
const chatRef = ref<HTMLElement | null>(null);
const windowRef = ref<HTMLElement | null>(null);
const WEB_SOCKET_URL = import.meta.env.VITE_WEB_SOCKET_URL

const chatMessages = computed<MessagePayload[]>(() => rawChatMessages.value as MessagePayload[]);
const currentLanguage = computed(() => rawCurrentLanguage.value as string);

const { sendEvent, onOpen, onMessage } = useWebSocket(WEB_SOCKET_URL, {
    autoReconnect: true,
    reconnectInterval: 5000,
    maxReconnectAttempts: 10
});

onOpen(() => {
    sendEvent('onChatSendMessage', 'Hello!', {
        id: 1,
        messageContent: 'Hello!',
        messageType: 'admin',
        messageAuthor: {
            id: 1,
            name: 'Valerii_Tyryshkindev',
            role: 'admin'
        },
    });
});

onMessage((data) => {
    updateData({
        chatMessages: [...chatMessages.value, data]
    });
});

const { y, arrivedState } = useScroll(chatRef, {
    offset: { bottom: 30 },
    behavior: 'auto'
});

useEventListener(chatRef, 'wheel', (e: WheelEvent) => {
    if (!isInputActive.value) {
        e.preventDefault();
    }
}, { passive: false });


watch(() => chatMessages.value.length, async () => {
    const shouldScroll = arrivedState.bottom || !isInputActive.value;
    await nextTick();
    if (shouldScroll && chatRef.value) {
        y.value = chatRef.value.scrollHeight;
    }
});

const sendMessage = (message: string) => {
    sendEvent(events.CHAT_SEND_MESSAGE, message);
};

const sendCommand = (command: string, ...args: string[]) => {
    sendEvent(events.CHAT_SEND_COMMAND, command, {
        commandArgs: args
    });
}

const toggleInput = (newValue: boolean) => {
    if (isInputActive.value === newValue) return;
    isInputActive.value = newValue;
    if (newValue && chatRef.value) {
        y.value = chatRef.value.scrollHeight;
    }
}

onKeyStroke(['F6', 't', 'T', 'е', 'Е'], (event: KeyboardEvent) => {
    if (isInputActive.value) return
    event.preventDefault();
    isInputActive.value = true
});
onKeyStroke('Escape', () => toggleInput(false));
onClickOutside(windowRef, () => toggleInput(false));
</script>

<style scoped lang="scss">
@use "@/assets/styles/GameChat/ChatWindow.scss" as chatWindow;
</style>