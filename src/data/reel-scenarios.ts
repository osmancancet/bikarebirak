import data from "./reel-scenarios.json";

export interface ReelScene {
  name: string;
  url: string;
  startSec: number;
  endSec: number;
  scene: string;
  music: string;
  voiceover: string;
}

export interface Reel {
  id: string;
  title: string;
  durationSec: number;
  scenes: ReelScene[];
}

export interface ElevenLabsConfig {
  model: string;
  voiceId: string;
  voiceName: string;
  voiceSettings: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
}

interface ReelScenariosData {
  elevenlabs: ElevenLabsConfig;
  reels: Reel[];
  tips: string[];
}

const typed = data as ReelScenariosData;

export const REELS: Reel[] = typed.reels;
export const ELEVENLABS: ElevenLabsConfig = typed.elevenlabs;
export const REEL_TIPS: string[] = typed.tips;

export function reelById(id: string): Reel | null {
  return REELS.find((r) => r.id === id) ?? null;
}

export function fullVoiceoverText(reel: Reel): string {
  return reel.scenes.map((s) => s.voiceover).join(" ");
}
