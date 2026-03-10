const AI_BRIDGE_BASE_URL =
	process.env.AI_BRIDGE_URL ?? "http://172.18.225.169:3001";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const response = await fetch(`${AI_BRIDGE_BASE_URL}${path}`, {
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
		...options,
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`API error ${response.status}: ${text}`);
	}

	return response.json() as Promise<T>;
}

export const api = {
	get: <T>(path: string) => request<T>(path),
	post: <T>(path: string, body: unknown) =>
		request<T>(path, {
			method: "POST",
			body: JSON.stringify(body),
		}),
	put: <T>(path: string, body: unknown) =>
		request<T>(path, {
			method: "PUT",
			body: JSON.stringify(body),
		}),
	delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
