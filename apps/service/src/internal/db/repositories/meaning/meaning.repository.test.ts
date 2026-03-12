import { expect, test } from "bun:test";
import { MeaningRepository } from "./meaning.repository";

process.env.NODE_ENV = "test";

test("MeaningRepository CRUD Operations", () => {
	const meaning = MeaningRepository.createMeaning({
		name: "Test Meaning",
		description: "Test description",
	});

	expect(meaning.id).toBeDefined();
	expect(meaning.name).toBe("Test Meaning");

	const fetched = MeaningRepository.getMeaningById(meaning.id);
	expect(fetched).not.toBeNull();

	const updated = MeaningRepository.updateMeaning(meaning.id, {
		name: "Updated Meaning Name",
	});
	expect(updated?.name).toBe("Updated Meaning Name");

	const success = MeaningRepository.deleteMeaning(meaning.id);
	expect(success).toBe(true);
});
