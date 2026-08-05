// ─────────────────────────────────────────────────────────────
// data/sampleReport.ts
//
// The contract between the grader and the report UI.
//
// `ReportData` mirrors EXACTLY the scored object grade.js prints
// (overall + tasks[] + priority_next_step + _warnings). When the
// API route is built, it returns this same shape — the report
// component never changes.
//
// `sampleReport` is a real grader run (the Task-1-override case,
// 60/100 borderline pass) frozen VERBATIM, phantom errors and all.
// Do not clean it here. The report cleans at render via cleanErrors()
// so the filter is tested against honest model output.
//
// `studentText` per task is added so cleanErrors() can check whether
// a claimed error actually appears in that task's text.
// ─────────────────────────────────────────────────────────────

export type Band = "A" | "B" | "C" | "D" | "E" | "?";

export interface Criterion {
  band: Band;
  points: number;
  comment: string;
}

export interface TaskError {
  original: string;
  correction: string;
  type: string;
  explanation: string;
}

export interface ReportTask {
  task: 1 | 2 | 3;
  word_count: number | null;
  required_word_count: number | null;
  criteria: {
    erfuellung: Criterion;
    kohaerenz: Criterion;
    wortschatz: Criterion;
    strukturen: Criterion;
  };
  task_points: number;
  task_max: number;
  erfuellung_zero_override_applied: boolean;
  corrected_text: string;
  errors: TaskError[];
  studentText: string; // raw text the student submitted for this task
}

export interface ReportData {
  overall: {
    total_points: number;
    max_points: number;
    passed: boolean;
    verdict_summary: string;
  };
  tasks: ReportTask[];
  priority_next_step: string;
  _warnings: string[];
}

// ─────────────────────────────────────────────────────────────
// PHANTOM-ERROR FILTER
//
// The model sometimes emits errors[] entries that are not real:
//   1. original === correction  (e.g. "Zutaten" → "Zutaten")
//   2. original is a hallucinated word not in the student's text
//      (e.g. "Rezeptab" / "geschocht" — never actually written)
//
// Both are stripped here, per task, before rendering. Matching is
// per-task: `original` must appear in THIS task's own text, so a
// real error in one task can't be rescued by a coincidental word
// in another.
//
// Punctuation is stripped from the comparison so "Wort," matches
// "Wort" in the source.
// ─────────────────────────────────────────────────────────────
function normalise(s: string): string {
  return s.trim().replace(/[.,;:!?»«"'()]/g, "").toLowerCase();
}

export function cleanErrors(task: ReportTask): TaskError[] {
  const haystack = normalise(task.studentText);
  return task.errors.filter((e) => {
    const original = normalise(e.original);
    const correction = normalise(e.correction);

    // Filter 1: identical original/correction — nothing was corrected.
    if (original === correction) return false;

    // Filter 2: original doesn't appear in the student's text — hallucinated.
    // Word-boundary-ish check on the normalised strings.
    if (!haystack.includes(original)) return false;

    return true;
  });
}

// ─────────────────────────────────────────────────────────────
// SAMPLE RUN — frozen verbatim from deepseek-ai/deepseek-v4-pro.
// 60/100 borderline PASS. Task 1 zeroed by the Erfüllung override
// despite A/A on Wortschatz/Strukturen. Task 2 carries FOUR phantom
// errors that cleanErrors() must strip to zero.
// ─────────────────────────────────────────────────────────────
export const sampleReport: ReportData = {
  overall: {
    total_points: 60,
    max_points: 100,
    passed: true,
    verdict_summary: "PASS — 60/100 (pass mark 60).",
  },
  tasks: [
    {
      task: 1,
      word_count: 72,
      required_word_count: 80,
      criteria: {
        erfuellung: {
          band: "E",
          points: 0,
          comment:
            "The task requires addressing three specific content points (e.g., reason for writing, details about the move, invitation/meeting proposal). The text only describes the move and the new apartment. It completely omits the other two required points. This is not a case of partial handling; the required communicative acts are missing entirely. Erfuellung = E.",
        },
        kohaerenz: {
          band: "B",
          points: 7.5,
          comment:
            "The text has a clear opening, a logical sequence of sentences about the move, and a closing. It is coherent and easy to follow.",
        },
        wortschatz: {
          band: "A",
          points: 10,
          comment:
            "Vocabulary is appropriate and precise (e.g., 'Umzug', 'Kiste ausgepackt', 'gemütlich', 'tollen Blick'). No errors impede understanding.",
        },
        strukturen: {
          band: "A",
          points: 10,
          comment:
            "Grammar and syntax are correct throughout. Only isolated, minor slips, if any, and understanding is not affected.",
        },
      },
      task_points: 0,
      task_max: 40,
      erfuellung_zero_override_applied: true,
      corrected_text:
        "Liebe Anna, lieber Tom,\nwie geht es euch? Ich bin jetzt endlich mit dem Umzug fertig. Gestern habe ich die letzte Kiste ausgepackt und die Wohnung sieht wirklich schön aus. Alles hat seinen Platz und im Wohnzimmer ist es sehr gemütlich geworden. Vom Balkon habe ich sogar einen tollen Blick auf den Park.\nIch hoffe, es geht euch gut, und ich freue mich, bald wieder von euch zu hören.\nViele Grüße\nKarim",
      errors: [],
      studentText:
        "Liebe Anna, lieber Tom,\nwie geht es euch? Ich bin jetzt endlich mit dem Umzug fertig. Gestern habe ich die letzte Kiste ausgepackt und die Wohnung sieht wirklich schön aus. Alles hat seinen Platz und im Wohnzimmer ist es sehr gemütlich geworden. Vom Balkon habe ich sogar einen tollen Blick auf den Park.\nIch hoffe, es geht euch gut, und ich freue mich, bald wieder von euch zu hören.\nViele Grüße\nKarim",
    },
    {
      task: 2,
      word_count: 85,
      required_word_count: 80,
      criteria: {
        erfuellung: {
          band: "A",
          points: 10,
          comment:
            "The text clearly expresses an opinion ('ich bin nicht ganz ihrer Meinung', 'Meiner Meinung nach...'), supports it with reasons (global recipes, health consciousness, love in cooking), and addresses the prompt's topic. All required content points are handled adequately.",
        },
        kohaerenz: {
          band: "A",
          points: 10,
          comment:
            "The text is well-structured. It acknowledges the opposing view ('Natürlich...'), introduces a counter-argument ('Trotzdem...'), provides supporting points ('Außerdem...'), and concludes with a clear personal stance. Linking words are used effectively.",
        },
        wortschatz: {
          band: "A",
          points: 10,
          comment:
            "The vocabulary is precise and varied ('verarbeitet', 'Zugang zu Rezepten', 'abwechslungsreicher', 'bewusst auf gesunde Ernährung'). No errors impede understanding.",
        },
        strukturen: {
          band: "A",
          points: 10,
          comment:
            "Grammar and syntax are largely correct. There are no errors that impede understanding. The text is fluent and well-constructed.",
        },
      },
      task_points: 40,
      task_max: 40,
      erfuellung_zero_override_applied: false,
      corrected_text:
        "Silkes Beitrag finde ich interessant, aber ich bin nicht ganz ihrer Meinung. Natürlich waren die Zutaten früher oft frischer und weniger verarbeitet, das ist ein guter Punkt.\nTrotzdem glaube ich nicht, dass früher automatisch besser gekocht wurde. Heute haben wir Zugang zu Rezepten aus der ganzen Welt und können viel abwechslungsreicher essen. Außerdem achten viele Menschen heute bewusst auf gesunde Ernährung.\nMeiner Meinung nach kommt es nicht auf die Zeit an, sondern darauf, mit wie viel Liebe man kocht. Das war früher und heute gleich.",
      // All four of these are phantom — cleanErrors() strips them to zero.
      errors: [
        {
          original: "Zutaten",
          correction: "Zutaten",
          type: "spelling",
          explanation: "The word is misspelled as 'Zutaten' instead of 'Zutaten'.",
        },
        {
          original: "Zugang",
          correction: "Zugang",
          type: "spelling",
          explanation: "The word is misspelled as 'Zugang' instead of 'Zugang'.",
        },
        {
          original: "Rezeptab",
          correction: "Rezepten",
          type: "spelling",
          explanation: "The word is misspelled as 'Rezeptab' instead of 'Rezepten'.",
        },
        {
          original: "geschocht",
          correction: "gekocht",
          type: "spelling",
          explanation: "The word is misspelled as 'geschocht' instead of 'gekocht'.",
        },
      ],
      studentText:
        "Silkes Beitrag finde ich interessant, aber ich bin nicht ganz ihrer Meinung. Natürlich waren die Zutaten früher oft frischer und weniger verarbeitet, das ist ein guter Punkt.\nTrotzdem glaube ich nicht, dass früher automatisch besser gekocht wurde. Heute haben wir Zugang zu Rezepten aus der ganzen Welt und können viel abwechslungsreicher essen. Außerdem achten viele Menschen heute bewusst auf gesunde Ernährung.\nMeiner Meinung nach kommt es nicht auf die Zeit an, sondern darauf, mit wie viel Liebe man kocht. Das war früher und heute gleich.",
    },
    {
      task: 3,
      word_count: 43,
      required_word_count: 40,
      criteria: {
        erfuellung: {
          band: "A",
          points: 4,
          comment:
            "The text is a formal email that correctly acknowledges the invitation, gives a clear reason for declining the appointment, and proposes an alternative. All required content points are fully and appropriately addressed.",
        },
        kohaerenz: {
          band: "A",
          points: 4,
          comment:
            "The text is logically structured: thanks, reason for cancellation, and a polite request for an alternative. The flow is smooth and coherent.",
        },
        wortschatz: {
          band: "A",
          points: 6,
          comment:
            "Vocabulary is formal and precise ('Vorstellungsgespräch', 'dienstlich verreisen', 'Termin wahrnehmen'). No errors.",
        },
        strukturen: {
          band: "A",
          points: 6,
          comment:
            "Grammar and syntax are flawless. The formal register is perfectly maintained throughout.",
        },
      },
      task_points: 20,
      task_max: 20,
      erfuellung_zero_override_applied: false,
      corrected_text:
        "Sehr geehrte Frau Weber,\nvielen Dank für die Einladung zum Vorstellungsgespräch am kommenden Mittwoch. Leider muss ich an diesem Tag dienstlich verreisen und kann den Termin daher nicht wahrnehmen. Wäre ein Gespräch in der folgenden Woche möglich?\nMit freundlichen Grüßen\nYasmin El Amrani",
      errors: [],
      studentText:
        "Sehr geehrte Frau Weber,\nvielen Dank für die Einladung zum Vorstellungsgespräch am kommenden Mittwoch. Leider muss ich an diesem Tag dienstlich verreisen und kann den Termin daher nicht wahrnehmen. Wäre ein Gespräch in der folgenden Woche möglich?\nMit freundlichen Grüßen\nYasmin El Amrani",
    },
  ],
  priority_next_step:
    "For Aufgabe 1, the candidate must learn to identify and address all three required content points in the prompt. The text is well-written but fails the task completely because it does not answer the prompt's questions. Practice reading prompts carefully and planning a response that covers every bullet point.",
  _warnings: [],
};
