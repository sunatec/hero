import { createHash, randomBytes } from "node:crypto";

/**
 * Q21-C: a signal's member-only details are committed to by hash when it is opened and revealed
 * (with the salt) when it closes, so anyone can check that nothing was changed in between.
 *
 *   hash = sha256( salt + ":" + canonical )     canonical = JSON of the fields below, fixed order
 */
export type CommitFields = {
	id: string;
	openedAt: string;
	direction: string;
	asset: string;
	entryPrice: number;
	targets?: number[];
	stopLoss?: number;
	invalidation?: string;
};

export const SALT_PATTERN = /^[a-f0-9]{32}$/;

export function newSalt(): string {
	return randomBytes(16).toString("hex");
}

/** Fixed field order and explicit nulls: the preimage must not depend on which fields were set. */
export function canonical(f: CommitFields): string {
	return JSON.stringify([
		"v1",
		f.id,
		f.openedAt,
		f.direction,
		f.asset,
		f.entryPrice,
		f.targets ?? [],
		f.stopLoss ?? null,
		f.invalidation ?? null,
	]);
}

export function preimage(f: CommitFields, salt: string): string {
	return `${salt}:${canonical(f)}`;
}

export function commitHash(f: CommitFields, salt: string): string {
	return createHash("sha256").update(preimage(f, salt)).digest("hex");
}

export function verifyCommit(
	f: CommitFields,
	salt: string,
	hash: string,
): boolean {
	return commitHash(f, salt) === hash;
}
