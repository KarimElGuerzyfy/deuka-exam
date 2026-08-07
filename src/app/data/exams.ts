import { supabase } from "../lib/supabaseClient";

// ============================================================
// Types — UNCHANGED from your original exams.ts.
// The Supabase row maps 1:1: JSONB `tasks` column IS Task[].
// ============================================================

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

// ============================================================
// Row mapping. DB columns are snake_case; the app uses camelCase.
// Only two fields differ (set_label, source is already flat).
// ============================================================

interface ExamRow {
  id: string;
  provider: Provider;
  level: Level;
  set_label: string;
  source: string;
  tasks: Task[]; // JSONB parses straight into Task[]
}

function rowToExam(row: ExamRow): Exam {
  return {
    id: row.id,
    provider: row.provider,
    level: row.level,
    setLabel: row.set_label,
    source: row.source,
    tasks: row.tasks,
  };
}

// ============================================================
// Data access — now async (network calls). These replace the
// synchronous array-lookup versions. Callers must `await`.
// ============================================================

export async function getExam(examId: string): Promise<Exam | undefined> {
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .eq("id", examId)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToExam(data as ExamRow) : undefined;
}

export async function getExamsBy(
  provider: Provider,
  level: Level
): Promise<Exam[]> {
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .eq("provider", provider)
    .eq("level", level)
    .order("set_label", { ascending: true });
  if (error) throw error;
  // Empty provider/level combo returns [] → UI shows the
  // "keine Prüfungen verfügbar" banner. This is the empty shelf.
  return (data as ExamRow[]).map(rowToExam);
}

export async function getTask(
  examId: string,
  taskId: string
): Promise<Task | undefined> {
  const exam = await getExam(examId);
  return exam?.tasks.find((t) => t.id === taskId);
}

// ============================================================
// buildTaskPrompt — UNCHANGED. Pure function over an Exam object.
// Still emits the AUFGABE N: markers the grader's word counter needs.
// Operates on whatever getExam() returns, DB-backed or not.
// ============================================================

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