import { describe, it, expect } from "vitest";
import { clamp, splitText } from "./measure";

describe("measure.ts", () => {
  it("clamp restricts values to a range", () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("splitText divides words into chunks depending on maximum characters", () => {
    const lines = splitText("Hello from Labbelia", 12);
    expect(lines).toEqual(["Hello from", "Labbelia"]);
  });
});
