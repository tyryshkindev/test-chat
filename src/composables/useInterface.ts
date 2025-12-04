import { computed } from 'vue'
import { getInterfaceData, getInterfaceParam, type InterfaceName } from './useInterfaces'

export function useInterface(interfaceName: InterfaceName) {
	const getData = () => {
		return getInterfaceData(interfaceName)
	}
	const param = (key: string, defaultValue: unknown = null) => {
		return computed(() => getInterfaceParam(interfaceName, key, defaultValue))
	}
	return {
		interfaceName: interfaceName,
		getData,
		param,
	}
}
