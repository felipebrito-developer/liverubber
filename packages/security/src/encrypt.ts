/**
 * Payload encryption utilities (AES-GCM via Web Crypto API).
 *
 * Used for at-rest encryption of sensitive payloads.
 * The key must be a 256-bit (32-byte) hex string.
 *
 * NOTE: These are stubs for the current MVP implementation.
 * In production, keys should be derived from device-secure storage.
 */

function hexToUint8Array(hex: string): Uint8Array {
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length; i += 2) {
		bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
	}
	return bytes;
}

function uint8ArrayToHex(bytes: Uint8Array): string {
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

async function importKey(hexKey: string): Promise<CryptoKey> {
	const keyBytes = hexToUint8Array(hexKey);
	return crypto.subtle.importKey(
		"raw",
		keyBytes as unknown as any,
		{ name: "AES-GCM" },
		false,
		["encrypt", "decrypt"],
	);
}

/**
 * Encrypts a UTF-8 string using AES-GCM.
 *
 * @param data   - Plaintext string to encrypt
 * @param hexKey - 32-byte (64 hex chars) key
 * @returns Base64-encoded ciphertext prefixed with IV hex (format: `<iv_hex>:<ciphertext_base64>`)
 */
export async function encryptPayload(
	data: string,
	hexKey: string,
): Promise<string> {
	const key = await importKey(hexKey);
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const encoded = new TextEncoder().encode(data);
	const cipherBuffer = await crypto.subtle.encrypt(
		{ name: "AES-GCM", iv },
		key,
		encoded,
	);
	const cipherBytes = new Uint8Array(cipherBuffer);
	return `${uint8ArrayToHex(iv)}:${Buffer.from(cipherBytes).toString("base64")}`;
}

/**
 * Decrypts a payload previously encrypted with `encryptPayload`.
 *
 * @param data   - Ciphertext in format `<iv_hex>:<ciphertext_base64>`
 * @param hexKey - 32-byte (64 hex chars) key
 * @returns Decrypted UTF-8 string
 */
export async function decryptPayload(
	data: string,
	hexKey: string,
): Promise<string> {
	const [ivHex, cipherBase64] = data.split(":");
	if (!ivHex || !cipherBase64) {
		throw new Error("Invalid encrypted payload format");
	}
	const key = await importKey(hexKey);
	const iv = hexToUint8Array(ivHex);
	const cipherBytes = Buffer.from(cipherBase64, "base64");
	const plainBuffer = await crypto.subtle.decrypt(
		{ name: "AES-GCM", iv: iv as unknown as any },
		key,
		cipherBytes as unknown as any,
	);
	return new TextDecoder().decode(plainBuffer);
}
