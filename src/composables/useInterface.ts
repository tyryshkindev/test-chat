import { computed } from 'vue';
import {
	getInterfaceData,
	getInterfaceParam,
	sendEvent,
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
	return {
		interfaceName: interfaceName,
		getData,
		param,
		sendEvent,
		events,
	};
}
