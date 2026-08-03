export type Provider = "goethe" | "osd" | "telc";
export type Level = "A1" | "A2" | "B1" | "B2";

export interface Task {
  id: string;
  teil: 1 | 2 | 3;
  label: string;
  shortLabel: string;
  minutes: number;
  intro: string;
  stimulusText?: string;
  bullets?: string[];
  instruction?: string;
  formatNotes: string[];
  target: number;
  min: number;
  max: number;
}

export interface Exam {
  id: string;
  provider: Provider;
  level: Level;
  setLabel: string;
  source: string;
  tasks: Task[];
}

export const EXAMS: Exam[] = [
  {
    id: "goethe-b1-werkstatt-test3",
    provider: "goethe",
    level: "B1",
    setLabel: "Prüfung 01",
    source: "Werkstatt B1 — Test 3",
    tasks: [
      {
        id: "goethe-b1-werkstatt-test3-a1",
        teil: 1,
        label: "B1 Schreiben — Aufgabe 1: Informelle E-Mail",
        shortLabel: "Aufgabe 1: Informelle E-Mail",
        minutes: 20,
        intro:
          "Zwei gute Freunde / Freundinnen haben Ihnen letzte Woche beim Umzug in Ihre neue Wohnung geholfen. Gestern haben Sie die letzte Umzugskiste ausgepackt.",
        bullets: [
          "Beschreiben Sie: Wie sieht die Wohnung jetzt aus?",
          "Begründen Sie: Warum wollen Sie Ihre Freunde / Freundinnen einladen?",
          "Machen Sie einen Vorschlag für ein gemeinsames Abendessen mit Ihren Freunden / Freundinnen.",
        ],
        formatNotes: [
          "Schreiben Sie eine E-Mail (circa 80 Wörter).",
          "Schreiben Sie etwas zu allen drei Punkten.",
          "Achten Sie auf den Textaufbau (Anrede, Einleitung, Reihenfolge der Inhaltspunkte, Schluss).",
        ],
        target: 80,
        min: 60,
        max: 110,
      },
      {
        id: "goethe-b1-werkstatt-test3-a2",
        teil: 2,
        label: "B1 Schreiben — Aufgabe 2: Meinung / Forumsbeitrag",
        shortLabel: "Aufgabe 2: Meinung",
        minutes: 25,
        intro:
          "In einem Forum, wo heftig über die Frage „Hat Oma besser gekocht?“ diskutiert wird, steht unter anderem auch folgender Beitrag:",
        stimulusText:
          "Silke meint dazu: Klare Sache, Oma hat besser gekocht, weil sie anders gekocht hat. Was war nun anders? Nicht nur die Rezepte, die einfacher waren und leicht nachgekocht werden konnten. Vor allem waren es die Zutaten, die frischer waren.",
        instruction: "Schreiben Sie nun Ihre Meinung (circa 80 Wörter).",
        formatNotes: ["Schreiben Sie circa 80 Wörter."],
        target: 80,
        min: 60,
        max: 110,
      },
      {
        id: "goethe-b1-werkstatt-test3-a3",
        teil: 3,
        label: "B1 Schreiben — Aufgabe 3: Formelle E-Mail",
        shortLabel: "Aufgabe 3: Formelle E-Mail",
        minutes: 15,
        intro:
          "Sie sind am kommenden Mittwoch zu einem Vorstellungsgespräch bei einer deutschen Firma eingeladen, können aber den vorgeschlagenen Termin nicht wahrnehmen.",
        instruction:
          "Schreiben Sie an die Firma. Entschuldigen Sie sich höflich und nennen Sie den Grund, warum Sie nicht kommen können.",
        formatNotes: [
          "Schreiben Sie eine E-Mail (circa 40 Wörter).",
          "Vergessen Sie nicht die Anrede und die Grußformel am Schluss.",
        ],
        target: 40,
        min: 30,
        max: 60,
      },
    ],
  },
  {
    id: "goethe-b1-modellsatz",
    provider: "goethe",
    level: "B1",
    setLabel: "Prüfung 02",
    source: "Goethe-Zertifikat B1 — Modellsatz",
    tasks: [
      {
        id: "goethe-b1-modellsatz-a1",
        teil: 1,
        label: "B1 Schreiben — Aufgabe 1: Informelle E-Mail",
        shortLabel: "Aufgabe 1: Informelle E-Mail",
        minutes: 20,
        intro:
          "Sie haben vor einer Woche Ihren Geburtstag gefeiert. Ein Freund/Eine Freundin von Ihnen konnte nicht zu Ihrer Feier kommen, weil er/sie krank war.",
        bullets: [
          "Beschreiben Sie: Wie war die Feier?",
          "Begründen Sie: Welches Geschenk finden Sie besonders toll und warum?",
          "Machen Sie einen Vorschlag für ein Treffen.",
        ],
        formatNotes: [
          "Schreiben Sie eine E-Mail (circa 80 Wörter).",
          "Schreiben Sie etwas zu allen drei Punkten.",
          "Achten Sie auf den Textaufbau (Anrede, Einleitung, Reihenfolge der Inhaltspunkte, Schluss).",
        ],
        target: 80,
        min: 60,
        max: 110,
      },
      {
        id: "goethe-b1-modellsatz-a2",
        teil: 2,
        label: "B1 Schreiben — Aufgabe 2: Meinung / Gästebuch",
        shortLabel: "Aufgabe 2: Meinung",
        minutes: 25,
        intro:
          "Sie haben im Fernsehen eine Diskussionssendung zum Thema „Persönliche Kontakte und Internet“ gesehen. Im Online-Gästebuch der Sendung finden Sie folgende Meinung:",
        stimulusText:
          "Tanja: Ich finde es schlimm, dass persönliche Treffen immer seltener werden. Freunde wohnen oft sehr weit auseinander. Und da ist man dann schon froh über das Internet. Aber Kontakte im Internet können doch persönliche Treffen nicht ersetzen!",
        instruction: "Schreiben Sie nun Ihre Meinung zum Thema (circa 80 Wörter).",
        formatNotes: ["Schreiben Sie circa 80 Wörter."],
        target: 80,
        min: 60,
        max: 110,
      },
      {
        id: "goethe-b1-modellsatz-a3",
        teil: 3,
        label: "B1 Schreiben — Aufgabe 3: Formelle E-Mail",
        shortLabel: "Aufgabe 3: Formelle E-Mail",
        minutes: 15,
        intro:
          "Ihre Kursleiterin, Frau Müller, hat Sie zu einem Gespräch über Ihre persönlichen Lernziele eingeladen. Zu dem Termin können Sie aber nicht kommen.",
        instruction:
          "Schreiben Sie an Frau Müller. Entschuldigen Sie sich höflich und berichten Sie, warum Sie nicht kommen können.",
        formatNotes: [
          "Schreiben Sie eine E-Mail (circa 40 Wörter).",
          "Vergessen Sie nicht die Anrede und den Gruß am Schluss.",
        ],
        target: 40,
        min: 30,
        max: 60,
      },
    ],
  },
  {
    id: "goethe-b1-uebungssatz",
    provider: "goethe",
    level: "B1",
    setLabel: "Prüfung 03",
    source: "Goethe-Zertifikat B1 — Übungssatz",
    tasks: [
      {
        id: "goethe-b1-uebungssatz-a1",
        teil: 1,
        label: "B1 Schreiben — Aufgabe 1: Informelle E-Mail",
        shortLabel: "Aufgabe 1: Informelle E-Mail",
        minutes: 20,
        intro:
          "Sie haben online Deutsch gelernt und berichten Ihrer Freundin/Ihrem Freund darüber.",
        bullets: [
          "Beschreiben Sie: Wie haben Sie gelernt?",
          "Begründen Sie: Welche Vorteile hat das Lernen mit dem Computer?",
          "Machen Sie einen Vorschlag für ein Treffen.",
        ],
        formatNotes: [
          "Schreiben Sie eine E-Mail (circa 80 Wörter).",
          "Schreiben Sie etwas zu allen drei Punkten.",
          "Achten Sie auf den Textaufbau (Anrede, Einleitung, Reihenfolge der Inhaltspunkte, Schluss).",
        ],
        target: 80,
        min: 60,
        max: 110,
      },
      {
        id: "goethe-b1-uebungssatz-a2",
        teil: 2,
        label: "B1 Schreiben — Aufgabe 2: Meinung / Gästebuch",
        shortLabel: "Aufgabe 2: Meinung",
        minutes: 25,
        intro:
          "Sie haben im Fernsehen eine Diskussionssendung zum Thema „Feste Arbeitszeiten“ gesehen. Im Online-Gästebuch der Sendung finden Sie folgende Meinung:",
        stimulusText:
          "Jessica: Ich arbeite von 9.00 bis 17.30 Uhr. Die festen Arbeitszeiten sind schon praktisch: Ich habe einen geregelten Tagesablauf, kann pünktlich das Büro verlassen und bin für Kunden immer zu erreichen. Seitdem ich zwei kleine Kinder habe, wäre ich jedoch gerne flexibler.",
        instruction: "Schreiben Sie nun Ihre Meinung zum Thema (circa 80 Wörter).",
        formatNotes: ["Schreiben Sie circa 80 Wörter."],
        target: 80,
        min: 60,
        max: 110,
      },
      {
        id: "goethe-b1-uebungssatz-a3",
        teil: 3,
        label: "B1 Schreiben — Aufgabe 3: Formelle E-Mail",
        shortLabel: "Aufgabe 3: Formelle E-Mail",
        minutes: 15,
        intro:
          "Sie haben sich für den Kurs „Erfolgreich präsentieren“ angemeldet. Zu dem ersten Termin können Sie aber nicht kommen.",
        instruction:
          "Schreiben Sie an Ihren Kursleiter, Herrn Weber. Entschuldigen Sie sich höflich und berichten Sie, warum Sie nicht kommen können.",
        formatNotes: [
          "Schreiben Sie eine E-Mail (circa 40 Wörter).",
          "Vergessen Sie nicht die Anrede und den Gruß am Schluss.",
        ],
        target: 40,
        min: 30,
        max: 60,
      },
    ],
  },
];

export function getExam(examId: string): Exam | undefined {
  return EXAMS.find((e) => e.id === examId);
}

export function getExamsBy(provider: Provider, level: Level): Exam[] {
  return EXAMS.filter((e) => e.provider === provider && e.level === level);
}

export function getTask(examId: string, taskId: string): Task | undefined {
  return getExam(examId)?.tasks.find((t) => t.id === taskId);
}

export function buildTaskPrompt(exam: Exam): string {
  return exam.tasks
    .map((t) => {
      const parts = [`AUFGABE ${t.teil}:`, t.intro];
      if (t.stimulusText) parts.push(t.stimulusText);
      if (t.bullets?.length) {
        parts.push(t.bullets.map((b) => `- ${b}`).join("\n"));
      }
      if (t.instruction) parts.push(t.instruction);
      parts.push(t.formatNotes.map((n) => `- ${n}`).join("\n"));
      return parts.join("\n");
    })
    .join("\n\n");
}