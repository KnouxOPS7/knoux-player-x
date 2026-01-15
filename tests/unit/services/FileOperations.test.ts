import { FileUtils } from '../../src/utils';

describe("Services Tests", () => {
    test("file extension", () => {
        expect(FileUtils.getFileExtension("song.mp3")).toBe("mp3");
    });
});
