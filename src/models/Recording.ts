export interface Recording {
	id: string;
	sessionId?: string;
	events: any[];
	createdAt: string;
}

export const Recordings: Recording[] = [];

export default { Recordings };
