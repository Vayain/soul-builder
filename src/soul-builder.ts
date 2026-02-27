/**
 * Soul Builder Core Logic
 * Manages session state and soul generation
 */

import {
  SoulState,
  SoulAnswers,
  SOUL_QUESTIONS,
  TOTAL_STEPS,
  ToolResult,
} from './types';

// Session storage with 1h expiration
const sessions = new Map<string, SoulState>();
const SESSION_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

// Cleanup expired sessions every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, state] of sessions.entries()) {
    if (now - state.createdAt.getTime() > SESSION_EXPIRY_MS) {
      sessions.delete(sessionId);
    }
  }
}, 10 * 60 * 1000);

/**
 * Start a new soul builder session
 */
export function startSoulBuilder(sessionId: string): ToolResult {
  // Check if session already exists
  if (sessions.has(sessionId)) {
    const existing = sessions.get(sessionId)!;
    const currentQuestion = SOUL_QUESTIONS[existing.step - 1];
    return {
      success: true,
      message: `Session bereits aktiv. Wir sind bei Frage ${existing.step}/${TOTAL_STEPS}.`,
      nextQuestion: currentQuestion?.question,
      currentStep: existing.step,
      totalSteps: TOTAL_STEPS,
      isComplete: existing.step > TOTAL_STEPS,
    };
  }

  // Create new session
  sessions.set(sessionId, {
    step: 1,
    answers: {},
    createdAt: new Date(),
  });

  const firstQuestion = SOUL_QUESTIONS[0];

  return {
    success: true,
    message: `Willkommen beim Soul Builder! 🎭

Ich helfe dir, die Identität deines KI-Agenten zu definieren. In ${TOTAL_STEPS} kurzen Fragen erstellen wir gemeinsam ein SOUL.md — das Herzstück deines Agenten.

Die Kernthese von ag3nt.id: "Ein Agent ohne Soul ist nur ein Werkzeug."

Lass uns starten!`,
    nextQuestion: firstQuestion.question,
    currentStep: 1,
    totalSteps: TOTAL_STEPS,
    isComplete: false,
  };
}

/**
 * Process an answer and return the next question or completion status
 */
export function answerQuestion(sessionId: string, answer: string): ToolResult {
  const state = sessions.get(sessionId);

  if (!state) {
    return {
      success: false,
      message: 'Keine aktive Session gefunden. Bitte starte mit start_soul_builder.',
    };
  }

  if (state.step > TOTAL_STEPS) {
    return {
      success: true,
      message: 'Alle Fragen beantwortet! Nutze generate_soul um dein SOUL.md zu erstellen.',
      isComplete: true,
      currentStep: state.step,
      totalSteps: TOTAL_STEPS,
    };
  }

  const currentQuestion = SOUL_QUESTIONS[state.step - 1];
  const trimmedAnswer = answer.trim();

  // Handle skip for optional questions
  if (currentQuestion.optional && trimmedAnswer.toLowerCase() === 'skip') {
    state.answers[currentQuestion.field] = '';
  } else if (!trimmedAnswer && !currentQuestion.optional) {
    return {
      success: false,
      message: `Diese Frage ist erforderlich. Bitte beantworte: ${currentQuestion.question}`,
      currentStep: state.step,
      totalSteps: TOTAL_STEPS,
    };
  } else {
    state.answers[currentQuestion.field] = trimmedAnswer;
  }

  // Move to next step
  state.step++;

  // Check if all questions answered
  if (state.step > TOTAL_STEPS) {
    return {
      success: true,
      message: `Perfekt! Alle ${TOTAL_STEPS} Fragen beantwortet. Dein Agent "${state.answers.name}" ist bereit!

Nutze jetzt generate_soul um dein SOUL.md zu erstellen.`,
      isComplete: true,
      currentStep: state.step,
      totalSteps: TOTAL_STEPS,
    };
  }

  const nextQuestion = SOUL_QUESTIONS[state.step - 1];

  return {
    success: true,
    message: `Antwort gespeichert! Weiter zu Frage ${state.step}/${TOTAL_STEPS}:`,
    nextQuestion: nextQuestion.question,
    currentStep: state.step,
    totalSteps: TOTAL_STEPS,
    isComplete: false,
  };
}

/**
 * Generate the SOUL.md from collected answers
 */
export function generateSoul(sessionId: string): ToolResult {
  const state = sessions.get(sessionId);

  if (!state) {
    return {
      success: false,
      message: 'Keine aktive Session gefunden. Bitte starte mit start_soul_builder.',
    };
  }

  if (state.step <= TOTAL_STEPS) {
    const remaining = TOTAL_STEPS - state.step + 1;
    return {
      success: false,
      message: `Noch ${remaining} Frage(n) offen. Bitte beantworte alle Fragen zuerst.`,
      currentStep: state.step,
      totalSteps: TOTAL_STEPS,
    };
  }

  const answers = state.answers as SoulAnswers;
  const soulMd = generateSoulMd(answers);

  return {
    success: true,
    message: `SOUL.md für "${answers.name}" erfolgreich generiert!`,
    soulMd,
    isComplete: true,
  };
}

/**
 * Export the SOUL.md as plain text
 */
export function exportSoul(sessionId: string): ToolResult {
  const state = sessions.get(sessionId);

  if (!state) {
    return {
      success: false,
      message: 'Keine aktive Session gefunden. Bitte starte mit start_soul_builder.',
    };
  }

  if (state.step <= TOTAL_STEPS) {
    return {
      success: false,
      message: 'Soul noch nicht vollständig. Bitte beantworte alle Fragen und nutze generate_soul.',
    };
  }

  const answers = state.answers as SoulAnswers;
  const soulMd = generateSoulMd(answers);

  return {
    success: true,
    message: 'Hier ist dein SOUL.md zum Kopieren:',
    soulMd,
  };
}

/**
 * Generate the SOUL.md markdown content
 */
function generateSoulMd(answers: SoulAnswers): string {
  const signatureSection = answers.signature
    ? `## Signature\n${answers.signature}`
    : '## Signature\n*Keine Signatur definiert*';

  return `# SOUL.md — ${answers.name}

## Identity
**Name:** ${answers.name}
**Personality:** ${answers.personality}
**Core Values:** ${answers.coreValues}

## Communication Style
**Tone:** ${answers.tone}

## Backstory
${answers.backstory}

${signatureSection}

---
*Generated by Soul Builder — ag3nt.id*
*Give your agent an identity.*
`;
}

/**
 * Get session state (for debugging/health checks)
 */
export function getSessionState(sessionId: string): SoulState | undefined {
  return sessions.get(sessionId);
}

/**
 * Get active session count
 */
export function getActiveSessionCount(): number {
  return sessions.size;
}
