import { formatTime } from "../../app/utils/Utils.js";

describe("Utils Tests", () => {
  test("formatTime formats time from totalSecondsPassed correctly", () => {
    expect(formatTime(3599)).toBe("00:59:59");
    expect(formatTime(3600)).toBe("01:00:00");
    expect(formatTime(3601)).toBe("01:00:01");
    expect(formatTime(3661)).toBe("01:01:01");
  });
});