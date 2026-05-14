export interface User {
	id: string;
	email: string;
	name: string;
	password?: string;
	createdAt: Date;
	updatedAt: Date;
	lastLogin?: Date;
	isActive: boolean;
}

export const Users: User[] = [];

export default { Users };
