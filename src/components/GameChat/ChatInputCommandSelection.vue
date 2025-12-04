<template>
	<div v-show="isCommand && filteredCommands.length" class="commands">
		<div class="commands__hint">
			<img
				draggable="false"
				src="@/assets/images/GameChat/question-mark.svg"
				width="10"
				height="10"
			/>
			<p class="commands__hint-text">Используйте TAB и ENTER для выбора команды</p>
		</div>

		<div class="commands__list">
			<p
				v-for="(item, index) in filteredCommands"
				:key="item"
				:class="{ 'commands__list-item': true, active: index === activeIndex }"
				@click="selectCommand(item)"
			>
				/{{ item }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { roleplayCommands } from '@/config/roleplayCommands';
import { onKeyStroke } from '@vueuse/core';

const activeIndex = ref(-1);

const props = defineProps<{
	searchQuery: string;
}>();

const emit = defineEmits<{
	(e: 'update:searchQuery', value: string): void;
}>();

const isCommand = computed(() => props.searchQuery.startsWith('/'));

const formattedCommand = computed(() => {
	if (!isCommand.value) return '';
	return props.searchQuery.slice(1).toLowerCase();
});

const filteredCommands = computed(() => {
	if (!isCommand.value) return [];
	if (formattedCommand.value === '') return roleplayCommands;
	return roleplayCommands
		.filter((command) => command.startsWith(formattedCommand.value))
		.sort((a, b) => a.length - b.length);
});

watch(
	() => props.searchQuery,
	() => (activeIndex.value = -1),
);

onKeyStroke('Tab', (e) => {
	if (!isCommand.value || !filteredCommands.value.length) return;
	e.preventDefault();
	if (activeIndex.value === -1) return (activeIndex.value = 0);
	activeIndex.value =
		activeIndex.value >= filteredCommands.value.length - 1 ? 0 : activeIndex.value + 1;
});

onKeyStroke('Enter', (e) => {
	if (!isCommand.value || !filteredCommands.value.length || activeIndex.value === -1) return;
	e.preventDefault();
	if (filteredCommands.value.length === 1)
		return selectCommand(filteredCommands.value[0] as string, true);
	if (formattedCommand.value === filteredCommands.value[activeIndex.value])
		return selectCommand(filteredCommands.value[activeIndex.value] as string, true);
	selectCommand(filteredCommands.value[activeIndex.value] as string);
});

const selectCommand = (command: string, hasSpace?: boolean) => {
	emit('update:searchQuery', '/' + command + (hasSpace ? ' ' : ''));
	activeIndex.value = -1;
};
</script>
<style lang="scss" scoped>
@use '@/assets/styles/GameChat/ChatInputCommandSelection.scss' as chatInputCommandSelection;
</style>
