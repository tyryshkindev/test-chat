import { roleplayCommands } from '@/config/roleplayCommands';

export function useCommandParser() {
	const parseCommand = (rawInput: string) => {
		const commandParts = rawInput.slice(1).split(/\s+/);
		const commandName = commandParts[0] || '';

		if (!commandName) return null;

		const rawArgs = commandParts.slice(1);
		const config = roleplayCommands[commandName as keyof typeof roleplayCommands];

		const accepts = config?.acceptsArgs ?? 0;

		let args: string[] = [];

		if (!accepts) args = [];
		else if (accepts === 1) args = [rawArgs.join(' ')];
		else {
			const mainArgs = rawArgs.slice(0, accepts - 1);
			const otherArgs = rawArgs.slice(accepts - 1).join(' ');
			args = [...mainArgs, otherArgs];
		}

		return {
			commandName,
			args,
		};
	};

	return {
		parseCommand,
	};
}
