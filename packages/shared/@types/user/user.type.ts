import type { Entity } from "../base/entity.type";

export interface User extends Entity {
	name: string;
	email: string;
}

export interface AuthUser {
	id: string;
	name: string;
	email: string;
	token: string;
}
