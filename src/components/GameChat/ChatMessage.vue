<template>
    <div class="chat__message">
        <span v-if="hasPrefix" class="chat__message-type" :style="{ backgroundColor: messageConfig?.prefixColor }">{{
            messageConfig?.prefix }}</span>
        <span class="chat__message-content" :style="{ color: messageConfig?.messageColor }">
            {{ props?.messageAuthor?.role ?? '' }}
            {{ props?.messageAuthor?.name?.split('_').join(' ') ?? '' }}
            {{ props?.messageAuthor?.id ? '(' + props?.messageAuthor?.id + ')' : '' }}
            {{ props.messageContent }}
        </span>
        <span v-if="messageType === 'try'"
            :class="['chat__message-try', tryResult ? 'chat__message-try--success' : 'chat__message-try--fail']">
            {{ tryResult ? 'Удачно' : 'Неудачно' }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { messageTypes } from '@/config/chatMessage.ts';
import type { MessageAuthor } from '@/types/chatMessages';
import { computed } from 'vue';
const props = defineProps<{
    messageType: keyof typeof messageTypes,
    messageContent?: string,
    messageAuthor?: MessageAuthor,
    tryResult?: boolean
}>()
const messageConfig = messageTypes[props.messageType]

const hasPrefix = computed(() => !!messageConfig?.prefix)
</script>

<style scoped lang="scss">
@use "@/assets/styles/GameChat/ChatMessage.scss" as chatMessage;
</style>