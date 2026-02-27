/**
 * Soul Builder Types
 * TypeScript type definitions for the Soul Builder MCP Server
 */

export interface SoulAnswers {
  name: string;
  personality: string;
  coreValues: string;
  tone: string;
  backstory: string;
  signature: string;
}

export interface SoulState {
  step: number;
  answers: Partial<SoulAnswers>;
  createdAt: Date;
}

export interface SoulQuestion {
  step: number;
  field: keyof SoulAnswers;
  question: string;
  optional: boolean;
}

export const SOUL_QUESTIONS: SoulQuestion[] = [
  {
    step: 1,
    field: 'name',
    question: 'Wie soll dein Agent heißen?',
    optional: false,
  },
  {
    step: 2,
    field: 'personality',
    question: 'Beschreibe die Persönlichkeit in 3 Adjektiven (z.B. warm, direkt, neugierig)',
    optional: false,
  },
  {
    step: 3,
    field: 'coreValues',
    question: 'Was sind 2-3 Kernwerte deines Agenten?',
    optional: false,
  },
  {
    step: 4,
    field: 'tone',
    question: 'Kommunikationsstil: formell / locker-professionell / casual / technisch-präzise',
    optional: false,
  },
  {
    step: 5,
    field: 'backstory',
    question: 'Gib deinem Agenten eine Herkunft — 1-2 Sätze.',
    optional: false,
  },
  {
    step: 6,
    field: 'signature',
    question: 'Ein typischer Erkennungs-Satz deines Agenten? (oder "skip" zum Überspringen)',
    optional: true,
  },
];

export const TOTAL_STEPS = SOUL_QUESTIONS.length;

export interface ToolResult {
  success: boolean;
  message: string;
  nextQuestion?: string;
  currentStep?: number;
  totalSteps?: number;
  isComplete?: boolean;
  soulMd?: string;
}
