import type { RequestBase } from "../base/router-request.type";
import type {
	PaginatedResponse,
	ResponseBase,
} from "../base/router-response.type";
import type { TaskDefinition, TaskPriority, TaskTag } from "./task.type";

export interface CreateTaskInput extends RequestBase {
	title: string;
	description?: string;
	priority: TaskPriority;
	dueDate?: string;
	tags?: TaskTag[];
}

export interface CreateTaskResponse extends ResponseBase<TaskDefinition> {}

export interface GetTaskListInput extends RequestBase {
	priority?: TaskPriority;
	dueDate?: string;
	tags?: TaskTag[];
}

export interface GetTaskListResponse
	extends PaginatedResponse<TaskDefinition> {}

export interface GetTaskInput extends RequestBase {
	id: string;
}

export interface GetTaskResponse extends ResponseBase<TaskDefinition> {}

export interface UpdateTaskInput extends RequestBase {
	title?: string;
	description?: string;
	priority?: TaskPriority;
	dueDate?: string;
	tags?: TaskTag[];
}

export interface UpdateTaskResponse extends ResponseBase<TaskDefinition> {}

export interface DeleteTaskRequest extends RequestBase {
	id: string;
}

export interface DeleteTaskResponse extends ResponseBase<null> {}
