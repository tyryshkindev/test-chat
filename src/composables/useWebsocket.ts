import { ref, onUnmounted, type Ref } from 'vue';
import { type events } from '@/data/events';

export type WebSocketState = 'CLOSED' | 'CONNECTING' | 'OPEN' | 'CLOSING' | 'RECONNECTING';

export interface WebSocketOptions {
	autoReconnect?: boolean;
	reconnectInterval?: number;
	maxReconnectAttempts?: number;
	binaryType?: BinaryType;
}

export type ProcessedMessage = Record<string, unknown>;
export type SendPayload = Record<string, unknown> | Array<string>;

interface UseWebsocketResult {
	status: Ref<WebSocketState>;
	lastMessage: Ref<string | ArrayBuffer | null>;
	error: Ref<Error | null>;

	sendEvent: (
		eventName: (typeof events)[keyof typeof events],
		content: string,
		payload?: SendPayload,
	) => void;
	close: (code?: number, reason?: string) => void;
	open: (url: string) => void;

	onOpen: (callback: (event: Event) => void) => void;
	onClose: (callback: (event: CloseEvent) => void) => void;
	onMessage: (callback: (data: ProcessedMessage) => void) => void;
	onError: (callback: (event: Event) => void) => void;
}

export function useWebSocket(
	initialUrl: string | null = null,
	options: WebSocketOptions = {},
): UseWebsocketResult {
	const {
		autoReconnect = true,
		reconnectInterval = 3000,
		maxReconnectAttempts = 5,
		binaryType = 'blob',
	} = options;

	const ws = ref<WebSocket | null>(null);
	const status = ref<WebSocketState>('CLOSED');
	const lastMessage = ref<string | ArrayBuffer | null>(null);
	const error = ref<Error | null>(null);

	let reconnectAttempts = 0;
	let url: string | null = initialUrl;
	let explicitClose = false;

	const eventListeners = {
		open: [] as ((event: Event) => void)[],
		close: [] as ((event: CloseEvent) => void)[],
		message: [] as ((data: ProcessedMessage) => void)[],
		error: [] as ((event: Event) => void)[],
	};

	const handleOpen = (event: Event) => {
		console.log('[WebSocket] Connected successfully.');
		status.value = 'OPEN';
		reconnectAttempts = 0;
		eventListeners.open.forEach((cb) => cb(event));
	};

	const handleClose = (event: CloseEvent) => {
		console.log(`[WebSocket] Connection closed. Code: ${event.code}, Reason: ${event.reason}`);

		if (explicitClose) {
			status.value = 'CLOSED';
			explicitClose = false;
		} else if (autoReconnect) {
			reconnect();
		} else {
			status.value = 'CLOSED';
		}

		eventListeners.close.forEach((cb) => cb(event));
	};

	const handleError = (event: Event) => {
		console.error('[WebSocket] Error occurred.', event);
		error.value = new Error('WebSocket connection error.');
		eventListeners.error.forEach((cb) => cb(event));
	};

	const close = (code?: number, reason?: string) => {
		if (ws.value && status.value !== 'CLOSING' && status.value !== 'CLOSED') {
			explicitClose = true;
			status.value = 'CLOSING';
			ws.value.close(code, reason);
		}
	};

	const reconnect = () => {
		if (!url || reconnectAttempts >= maxReconnectAttempts) {
			status.value = 'CLOSED';
			error.value = new Error(`Failed to reconnect after ${maxReconnectAttempts} attempts.`);
			console.error(error.value.message);
			return;
		}

		reconnectAttempts++;
		status.value = 'RECONNECTING';
		console.log(
			`[WebSocket] Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`,
		);

		setTimeout(() => {
			if (url) open(url, true);
		}, reconnectInterval);
	};

	const open = (newUrl: string, isReconnect: boolean = false) => {
		if (ws.value) close();

		url = newUrl;
		error.value = null;
		status.value = isReconnect ? 'RECONNECTING' : 'CONNECTING';

		try {
			ws.value = new WebSocket(url);
			ws.value.binaryType = binaryType;

			ws.value.onopen = handleOpen;
			ws.value.onmessage = handleMessage;
			ws.value.onclose = handleClose;
			ws.value.onerror = handleError;
		} catch (e) {
			error.value = e as Error;
			status.value = 'CLOSED';
			console.error('[WebSocket] Failed to create connection object.', e);
			if (autoReconnect && !isReconnect) reconnect();
		}
	};

	const sendEvent = (
		eventName: (typeof events)[keyof typeof events],
		content: string,
		payload: SendPayload = {},
	) => {
		let dataToSend: Record<string, unknown> = {
			eventName: eventName,
			content: content,
		};
		if (Array.isArray(payload)) {
			dataToSend.args = payload;
		} else {
			dataToSend = { ...dataToSend, ...payload };
		}
		if (status.value === 'OPEN' && ws.value) {
			try {
				ws.value.send(JSON.stringify(dataToSend));
			} catch (error) {
				console.warn('[WebSocket] Failed to serialize or to send message.', error);
			}
		} else {
			console.warn('[WebSocket] Cannot send message: connection is not OPEN.');
		}
	};

	const onOpen = (callback: (event: Event) => void) => {
		eventListeners.open.push(callback);
	};
	const onClose = (callback: (event: CloseEvent) => void) => {
		eventListeners.close.push(callback);
	};
	const handleMessage = (event: MessageEvent) => {
		const data = event.data;
		lastMessage.value = typeof data === 'string' ? data : null;

		let processedData: ProcessedMessage | null = null;

		if (typeof data === 'string') {
			try {
				const parsed = JSON.parse(data);

				if (typeof parsed === 'object' && parsed !== null) {
					processedData = parsed as ProcessedMessage;
				}
			} catch {
				console.log(
					'[WebSocket Hook] Failed to parse JSON, received non-JSON string:',
					data,
				);
			}
		}
		if (processedData) {
			eventListeners.message.forEach((cb) => cb(processedData!));
		}
	};
	const onMessage = (callback: (data: ProcessedMessage) => void) => {
		eventListeners.message.push(callback);
	};
	const onError = (callback: (event: Event) => void) => {
		eventListeners.error.push(callback);
	};

	if (url) {
		open(url);
	}

	onUnmounted(() => {
		close();
	});

	return {
		status,
		lastMessage,
		error,
		sendEvent,
		close,
		open,
		onOpen,
		onClose,
		onMessage,
		onError,
	};
}
