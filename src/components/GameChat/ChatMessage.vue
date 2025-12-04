<template>
	<div class="chat__message">
		<span
			v-if="hasPrefix"
			class="chat__message-type"
			:style="{ backgroundColor: messageConfig?.prefixColor }"
			>{{ messageConfig?.prefix }}</span
		>
		<span class="chat__message-content" :style="{ color: messageConfig?.messageColor }">
			{{ props?.messageAuthor?.role ?? '' }}
			{{ props?.messageAuthor?.name ?? '' }}
			{{ props?.messageAuthor?.id ? '(' + props?.messageAuthor?.id + ')' : '' }}
			{{ props.messageContent }}
		</span>
	</div>
</template>

<script setup lang="ts">
import { messageTypes } from '@/config/chatMessage.ts';
import type { MessageAuthor } from '@/types/chatMessages';
import { computed } from 'vue';
const props = defineProps<{
	messageType: keyof typeof messageTypes;
	messageContent?: string;
	messageAuthor?: MessageAuthor;
}>();
const messageConfig = messageTypes[props.messageType];
console.log(messageConfig);

const hasPrefix = computed(() => !!messageConfig?.prefix);
</script>

<style scoped lang="scss">
@use '@/assets/styles/GameChat/ChatMessage.scss' as chatMessage;
</style>
