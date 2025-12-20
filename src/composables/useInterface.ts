import { computed } from 'vue';
import {
	getInterfaceData,
	getInterfaceParam,
	sendEvent,
	updateInterfaceData,
	type InterfaceName,
} from './useInterfaces';
import { events } from '@/data/events';

export function useInterface(interfaceName: InterfaceName) {
	const getData = () => {
		return getInterfaceData(interfaceName);
	};
	const param = (key: string, defaultValue: unknown = null) => {
		return computed(() => getInterfaceParam(interfaceName, key, defaultValue));
	};
	const updateData = (payload: Record<string, unknown>) => {
		updateInterfaceData(interfaceName, payload);
	};
	return {
		interfaceName: interfaceName,
		updateData,
		getData,
		param,
		sendEvent,
		events,
	};
}
