export interface Task {
  id: string;
  target: number;
  min: number;
  max: number;
  label: string;
  shortLabel: string;
  prompt: string;
}

export const TASKS: Task[] = [
  {
    id: "a1",
    target: 80,
    min: 65,
    max: 120,
    label: "B1 Schreiben — Aufgabe 1: Informal email",
    shortLabel: "Aufgabe 1: Informal email",
    prompt:
      "Dein Freund Alex hat bald Geburtstag und lädt dich zur Feier ein. Antworte auf die Einladung.\n\n• Bedank dich für die Einladung.\n• Sag, ob du kommen kannst.\n• Frag, ob du etwas mitbringen sollst.\n\nSchreib circa 80 Wörter.",
  },
  {
    id: "a2",
    target: 80,
    min: 65,
    max: 120,
    label: "B1 Schreiben — Aufgabe 2: Opinion post",
    shortLabel: "Aufgabe 2: Opinion post",
    prompt:
      "In einem Online-Forum liest du die Frage: „Sollten Handys in der Schule verboten werden?“ Schreib einen Beitrag.\n\n• Nenne deine Meinung.\n• Begründe sie mit einem Beispiel.\n• Reagiere auf einen anderen Kommentar.\n\nSchreib circa 80 Wörter.",
  },
  {
    id: "a3",
    target: 40,
    min: 30,
    max: 70,
    label: "B1 Schreiben — Aufgabe 3: Formal email",
    shortLabel: "Aufgabe 3: Formal email",
    prompt:
      "Du hast einen Termin bei der Ausländerbehörde, kannst aber nicht kommen. Schreib eine formelle E-Mail.\n\n• Entschuldige dich höflich.\n• Erkläre kurz, warum du nicht kommen kannst.\n• Bitte um einen neuen Termin.\n\nSchreib circa 40 Wörter.",
  },
];