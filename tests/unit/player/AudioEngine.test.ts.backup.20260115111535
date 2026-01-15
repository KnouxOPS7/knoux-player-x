import { PlayerState } from '../../src/types';
import { TimeUtils } from '../../src/utils';

describe("Player Tests", () => {
    test("initial state", () => {
        const state: PlayerState = {
            isPlaying: false,
            isPaused: false,
            isStopped: true,
            currentTime: 0,
            duration: 0,
            volume: 1,
            muted: false,
            playbackRate: 1,
            repeatMode: "off",
            shuffleMode: false,
            buffering: false,
            bufferProgress: 0
        };

        expect(state.isStopped).toBe(true);
    });

    test("time format", () => {
        expect(TimeUtils.formatTime(60)).toBe("01:00");
    });
});
