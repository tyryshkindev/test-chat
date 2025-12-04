<template>
    <div ref="windowRef" class="chat__window">
        <div ref="chatRef" class="chat__window-list" :class="{ 'chat__window-scrollable': isInputActive }">
            <ChatMessage v-for="chatMessage in chatMessages" :key="chatMessage.id"
                :messageType="chatMessage.messageType" :messageContent="chatMessage.messageContent"
                :messageAuthor="chatMessage.author" />
        </div>
        <ChatInput v-show="isInputActive" @sendMessage="sendMessage" @toggleInput="toggleInput"
            :isInputActive="isInputActive" :currentLanguage="currentLanguage" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";
import { useScroll, useEventListener, onClickOutside, onKeyStroke } from "@vueuse/core";
import { useInterface } from "@/composables/useInterface";
import ChatMessage from "@/components/GameChat/ChatMessage.vue";
import type { MessagePayload } from "@/types/chatMessages";
import ChatInput from "@/components/GameChat/ChatInput.vue";

const { param } = useInterface("Chat");

const rawChatMessages = param("chatMessages", []);
const rawCurrentLanguage = param("currentLanguage", "en");
const isInputActive = ref(false);
const chatRef = ref<HTMLElement | null>(null);
const windowRef = ref<HTMLElement | null>(null);

const chatMessages = computed<MessagePayload[]>(() => rawChatMessages.value as MessagePayload[]);
const currentLanguage = computed(() => rawCurrentLanguage.value as string);

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
    console.log(message);
};

const toggleInput = (newValue: boolean) => {
    if (isInputActive.value === newValue) return;
    isInputActive.value = newValue;
    if (newValue && chatRef.value) {
        y.value = chatRef.value.scrollHeight;
    }
}

onKeyStroke(['F6', 't', 'T', 'е', 'Е'], (event: KeyboardEvent) => {
    event.preventDefault();
    isInputActive.value = true
});
onKeyStroke('Escape', () => toggleInput(false));
onClickOutside(windowRef, () => toggleInput(false));
</script>

<style scoped lang="scss">
@use "@/assets/styles/GameChat/ChatWindow.scss" as chatWindow;
</style>