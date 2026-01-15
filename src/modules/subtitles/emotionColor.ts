/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Module: AI/Subtitle
 * Purpose: Analyzes subtitle text sentiment (using local heuristics) to dynamically 
 *          color subtitles based on the mood (Anger, Sadness, Joy, Fear).
 */

type Emotion = "NEUTRAL" | "ANGER" | "SADNESS" | "JOY" | "FEAR";

const EMOTION_COLORS: Record<Emotion, string> = {
    NEUTRAL: "#FFFFFF",
    ANGER: "#FF4444",   // Red
    SADNESS: "#88CCFF", // Light Blue
    JOY: "#FFDD44",     // Yellow
    FEAR: "#CC88FF"     // Purple
};

// Keyword dictionary (Offline NLP Lightweight Approach)
const KEYWORDS = {
    ANGER: ["kill", "hate", "damn", "furious", "stupid", "idiot", "destroy", "rage"],
    SADNESS: ["cry", "tears", "lonely", "dead", "loss", "sorry", "miss", "grief"],
    JOY: ["love", "happy", "great", "laugh", "smile", "fun", "yes", "won"],
    FEAR: ["scared", "run", "dark", "scream", "help", "danger", "afraid"]
};

export const getEmotionColor = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    // Check keywords (Priority based)
    if (KEYWORDS.ANGER.some(w => lowerText.includes(w))) return EMOTION_COLORS.ANGER;
    if (KEYWORDS.JOY.some(w => lowerText.includes(w))) return EMOTION_COLORS.JOY;
    if (KEYWORDS.SADNESS.some(w => lowerText.includes(w))) return EMOTION_COLORS.SADNESS;
    if (KEYWORDS.FEAR.some(w => lowerText.includes(w))) return EMOTION_COLORS.FEAR;

    // Detect Exclamations
    if (text.endsWith("!!") || text.toUpperCase() === text && text.length > 4) {
        return EMOTION_COLORS.ANGER; // Yelling assumption
    }

    return EMOTION_COLORS.NEUTRAL;
};

/**
 * Returns a React CSS style object for the subtitle span
 */
export const getSubtitleStyle = (text: string, baseStyle: any) => {
    const color = getEmotionColor(text);
    if (color === EMOTION_COLORS.NEUTRAL) return baseStyle;

    return {
        ...baseStyle,
        color: color,
        textShadow: `0 0 10px ${color}` // Add glow for emotion
    };
};
