import { formatTime } from "../../../src/utils/time";

describe("Utils: Time Formatter", () => {
    test("formats simple seconds correctly", () => {
        expect(formatTime(45)).toBe("00:45");
        expect(formatTime(0)).toBe("00:00");
    });

    test("formats minutes correctly", () => {
        expect(formatTime(65)).toBe("01:05");
        expect(formatTime(600)).toBe("10:00");
    });

    test("formats hours correctly", () => {
        expect(formatTime(3600)).toBe("1:00:00");
        expect(formatTime(3665)).toBe("1:01:05");
    });

    test("handles edge cases", () => {
        expect(formatTime(-5)).toBe("00:00");
        expect(formatTime(NaN)).toBe("00:00");
    });
});
