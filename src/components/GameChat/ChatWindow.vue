<template>
    <div ref="chatRef" class="chat__window" :class="{ 'chat__window-scrollable': isInputActive }">
        <ChatMessage v-for="chatMessage in chatMessages" :key="chatMessage.id" :messageType="chatMessage.messageType"
            :messageContent="chatMessage.messageContent" :messageAuthor="chatMessage.author" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useInterface } from "@/composables/useInterface";
import ChatMessage from "@/components/GameChat/ChatMessage.vue";
import type { MessagePayload } from "@/types/chatMessages";

const { param } = useInterface("Chat");

const rawChatMessages = param("chatMessages", []);

const isInputActive = ref(false);
const chatRef = ref<HTMLDivElement | null>(null);

const chatMessages = computed<MessagePayload[]>(() => rawChatMessages.value as MessagePayload[]);

const preventScroll = (e: WheelEvent) => {
    if (!isInputActive.value) {
        e.preventDefault();
    }
};

onMounted(() => {
    if (chatRef.value) {
        chatRef.value.addEventListener('wheel', preventScroll, { passive: false });
    }
});

onBeforeUnmount(() => {
    if (chatRef.value) {
        chatRef.value.removeEventListener('wheel', preventScroll);
    }
});

watch(() => chatMessages.value.length, () => {
    if (!chatRef.value) return;

    const element = chatRef.value;
    const tolerance = 10;
    const wasAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - tolerance;
    const forceScroll = !isInputActive.value;

    nextTick(() => {
        if (chatRef.value && (wasAtBottom || forceScroll)) {
            chatRef.value.scrollTop = chatRef.value.scrollHeight - chatRef.value.clientHeight;
        }
    });
});
</script>

<style scoped lang="scss">
@use "@/assets/styles/GameChat/ChatWindow.scss" as chatWindow;
</style>