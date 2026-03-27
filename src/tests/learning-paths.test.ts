import { describe, it, expect } from "vitest";
import {
  LEARNING_PATHS,
  getPathByDifficulty,
  getPathById,
} from "@/data/learning-paths";

describe("Learning Paths Data", () => {
  it("has 4 paths (one per difficulty level)", () => {
    expect(LEARNING_PATHS).toHaveLength(4);
  });

  it("each path has at least 6 steps", () => {
    for (const path of LEARNING_PATHS) {
      expect(path.steps.length).toBeGreaterThanOrEqual(6);
    }
  });

  it("each step has required fields", () => {
    for (const path of LEARNING_PATHS) {
      for (const step of path.steps) {
        expect(step.id).toBeTruthy();
        expect(step.title).toBeTruthy();
        expect(step.description).toBeTruthy();
        expect(step.domain).toBeTruthy();
        expect(step.scenarioPrompt).toBeTruthy();
        expect(step.difficulty).toBeGreaterThanOrEqual(1);
        expect(step.difficulty).toBeLessThanOrEqual(4);
      }
    }
  });

  it("step IDs are unique within a path", () => {
    for (const path of LEARNING_PATHS) {
      const ids = path.steps.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  describe("getPathByDifficulty", () => {
    it("returns correct path for each difficulty", () => {
      expect(getPathByDifficulty(1)?.id).toBe("path-beginner");
      expect(getPathByDifficulty(2)?.id).toBe("path-elementary");
      expect(getPathByDifficulty(3)?.id).toBe("path-intermediate");
      expect(getPathByDifficulty(4)?.id).toBe("path-advanced");
    });

    it("returns undefined for invalid difficulty", () => {
      expect(getPathByDifficulty(5)).toBeUndefined();
    });
  });

  describe("getPathById", () => {
    it("returns path by ID", () => {
      expect(getPathById("path-beginner")?.difficulty).toBe(1);
      expect(getPathById("path-advanced")?.difficulty).toBe(4);
    });

    it("returns undefined for unknown ID", () => {
      expect(getPathById("nonexistent")).toBeUndefined();
    });
  });
});
