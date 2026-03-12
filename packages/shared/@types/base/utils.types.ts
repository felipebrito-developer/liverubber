// @ts-nocheck
// biome-ignore lint/suspicious/noExplicitAny: <This should be used when we don't have a better type>
export type AnyType = any;

export type StringRecord<T = AnyType> = Record<string, T>;
