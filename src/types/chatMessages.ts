import { messageTypes } from '@/config/chatMessage.ts'

export interface MessagePayload {
	id: number
	messageContent: string
	messageType: keyof typeof messageTypes
	author: MessageAuthor
}

export interface MessageAuthor {
	name: string
	id: number
	role: string
}
