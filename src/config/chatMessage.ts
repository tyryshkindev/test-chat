export const messageTypes = {
	default: {
		prefix: '',
		prefixColor: '#fff',
		messageColor: '#fff',
	},
	admin: {
		prefix: 'ADM',
		prefixColor: '#ff4343',
		messageColor: '#fff',
	},
	fraction: {
		prefix: 'R',
		prefixColor: '#174601',
		messageColor: '#559c34',
	},
	department: {
		prefix: 'D',
		prefixColor: '#b16795',
		messageColor: '#fb7ec3',
	},
	serverAdmin: {
		prefix: 'O',
		prefixColor: '#b37108',
		messageColor: '#fea311',
	},
	ooc: {
		prefix: 'OOC',
		prefixColor: '#b37108',
		messageColor: '#fea311',
	},
	try: {
		prefix: '/try',
		prefixColor: '#a157ff',
		messageColor: '#ab69ff',
	},
	me: {
		prefix: '/me',
		prefixColor: '#a157ff',
		messageColor: '#ab69ff',
	},
	do: {
		prefix: '/do',
		prefixColor: '#a157ff',
		messageColor: '#ab69ff',
	},
} as const;
