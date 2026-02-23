import type { AnyType } from "./utils.types";

export type ResponseStatus =
	| "pending"
	| "in_progress"
	| "completed"
	| "cancelled";

export interface ResponseBase<T = AnyType> {
	id: string;
	status: ResponseStatus;
	data?: T[];
	message?: string;
}

export interface PaginatedResponse<T = AnyType> extends ResponseBase<T> {
	currentPage?: number;
	totalItems?: number;
	totalPages?: number;
}
