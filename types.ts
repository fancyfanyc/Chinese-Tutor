export interface ExampleSentence {
  chinese: string;
  pinyin: string;
  english: string;
}

export interface CharacterData {
  char: string;
  pinyin: string[];
  definitions: string[];
  radical: string;
  strokeCount: number;
  etymology: string; // Origin/History
  examples: ExampleSentence[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface HanziWriterOptions {
  width: number;
  height: number;
  padding: number;
  showOutline: boolean;
  strokeAnimationSpeed: number;
  delayBetweenStrokes: number;
  strokeColor: string;
  radicalColor: string | null;
  outlineColor: string;
  drawingWidth: number;
  showCharacter: boolean;
  showHintAfterMisses: number;
  highlightOnVariation: boolean;
}
