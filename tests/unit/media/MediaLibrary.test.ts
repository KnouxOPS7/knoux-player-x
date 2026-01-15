import { MediaFile } from '../../src/types';
import { MediaUtils } from '../../src/utils';

describe("Media Tests", () => {
    test("create valid media file", () => {
        const media: MediaFile = {
            id: "id-1",
            path: "/file.mp4",
            title: "Test",
            duration: 120,
            fileType: "video",
            fileSize: 1024,
            dateAdded: Date.now(),
            playCount: 0,
            tags: []
        };
        expect(media.title).toBe("Test");
    });

    test("detect media file", () => {
        expect(MediaUtils.isMediaFile("test.mp4")).toBe(true);
    });
});
