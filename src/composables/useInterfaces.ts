import { reactive } from 'vue';
export type InterfaceName =
	| 'MainMenu'
	| 'Hud'
	| 'Notifications'
	| 'Entrance'
	| 'Chat'; /* | "Radar"*/

interface InterfaceState {
	visible: boolean;
	zIndex: number;
	data: Record<string, unknown>;
}

export const interfaces = reactive<Record<InterfaceName, InterfaceState>>({
	MainMenu: {
		visible: false,
		zIndex: 101,
		data: {
			currentWindow: 1,
			stats: [
				0, // id аккаунта
				0, // уровень
				'Nick_Name',
				152, // ping
				0, // опыта
				100, // опыта до следующего уровня
				'29.08.2025', // дата регистрации
				'Отсутствует',
				'00-00-00',
				'Отсутствует',
				'Отсутствует',
				'Отсутствует', // работа
				'Отсутствует',
				0, // ранг
				'Отсутствует', // звание
				'Нет', // судимости
				0, // розыск
				0, // деньги
				0, // деньги в банке
				0, // мобильный счёт
				'0%', // законопослушность
				0, // стимуляторы
				0, // патроны
				0, // материалы
				'0%', // зависимость
				'Мужской', // пол
				'Отсутствует', // военный билет
				'Отсутствует', // мед.справка
				'0/3', // выговоры
				0, // отыгранных часов
			],
		},
	},
	Hud: {
		visible: false,
		zIndex: 1,
		data: {
			playerid: 0,
			location: 'г. Арзамас, ул. Пушкина, д. 52',
			energy: 0,
			stimulant: 0,
			status: '',
		},
	},
	Notifications: {
		visible: true,
		zIndex: 1,
		data: {},
	},
	Entrance: {
		visible: false,
		zIndex: 101,
		data: {
			interface: 0,
			step: 0,
		},
	},
	Chat: {
		visible: true,
		zIndex: 101,
		data: {
			chatMessages: [],
		},
	},

	/*Radar: { 
        visible: true,
        zIndex: 1,
        data: {}
    },*/
});

export function getInterfaceData(name: InterfaceName) {
	return { ...interfaces[name].data };
}

export function updateInterfaceData(name: InterfaceName, payload: Record<string, unknown>) {
	interfaces[name].data = { ...interfaces[name].data, ...payload };
	console.log(interfaces[name].data);
}

export function getInterfaceParam(name: InterfaceName, key: string, defaultValue: unknown = null) {
	return interfaces[name].data[key] !== undefined ? interfaces[name].data[key] : defaultValue;
}

export function clientEvent(e: string, ...a: unknown[]) {
	console.log('send client event:', e, ...a);

	// if (window.client?.sendEvent) window.client.sendEvent(e, ...a);
}

export function sendEvent(e: string, ...a: unknown[]) {
	clientEvent(e, ...a);
}
