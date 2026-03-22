import type { Entity } from "../base/entity.type";

export interface User extends Entity {
	name: string;
	email: string;
	age: number;
}

export interface AuthUser {
	id: string;
	name: string;
	email: string;
	token: string;
	age: number;
}
