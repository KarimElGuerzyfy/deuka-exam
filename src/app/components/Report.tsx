"use client";

import { useState } from "react";
import Image from "next/image";
import { sampleReport, cleanErrors, type ReportData, type ReportTask, type Band } from "../data/sampleReport";

// ─────────────────────────────────────────────────────────────
// Report.tsx
//
// Renders the grader's scored output (ReportData).
// Fed the frozen `sampleReport` fixture for now; when the API
// route exists, pass the live response as the `data` prop —
// nothing here changes.
//
// TWO PARTS:
//   Part 1 — static summary (title, overall score, 3 task cards,
//            disclaimer). Same for all tasks, data-driven.
//   Part 2 — per-Aufgabe block as a CAROUSEL. One Aufgabe visible
//            at a time; arrows float on top (absolute), hidden at
//            the ends; "n / 3" indicator.
// ─────────────────────────────────────────────────────────────

const CRITERIA: { key: keyof ReportTask["criteria"]; label: string }[] = [
  { key: "erfuellung", label: "Erfüllung" },
  { key: "kohaerenz", label: "Kohärenz" },
  { key: "wortschatz", label: "Wortschatz" },
  { key: "strukturen", label: "Strukturen" },
];

const BAND_LABELS: { band: Band; label: string }[] = [
  { band: "A", label: "Sehr gut" },
  { band: "B", label: "Gut" },
  { band: "C", label: "Ausreichend" },
  { band: "D", label: "Schwach" },
  { band: "E", label: "Nicht erfüllt" },
];

// Hardcoded for now — really belongs in exams.ts. Wire later.
const TASK_TYPE: Record<number, string> = {
  1: "Informal email",
  2: "Opinion",
  3: "Formal email",
};

export default function Report({ data = sampleReport }: { data?: ReportData }) {
  const { overall, tasks, priority_next_step } = data;

  return (
    <div className="mx-auto w-full max-w-[1179px] px-3 md:px-6 py-6 md:py-[54px]">
      {/* ═══════════════ PART 1 — STATIC SUMMARY ═══════════════ */}
      <SummarySection overall={overall} tasks={tasks} />

      {/* ═══════════════ PART 2 — CAROUSEL ═════════════════════ */}
      <TaskCarousel tasks={tasks} />

      {/* ── Priority next step ─────────────────────────────── */}
      <section className="mt-8 rounded-2xl border-2 border-[var(--accent)] py-6 px-4">
        <h2 className="text-lg md:text-xl font-bold text-[var(--ink)]">Priority Next Step</h2>
        <p className="mt-2 text-base font-bold text-[var(--body-text)] leading-relaxed">
          {priority_next_step}
        </p>
      </section>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// PART 1 — STATIC SUMMARY
// ═════════════════════════════════════════════════════════════
function SummarySection({
  overall,
  tasks,
}: {
  overall: ReportData["overall"];
  tasks: ReportTask[];
}) {
  const passed = overall.passed;
  const pct = (overall.total_points / overall.max_points) * 100;
  const passMarkPct = (60 / overall.max_points) * 100;

  return (
    <>
      <h1 className="text-[var(--heading)] text-2xl md:text-3xl font-bold uppercase tracking-wide">
        ÖSD / Goethe – B1 Schreiben
      </h1>

      <section className="mt-6 rounded-xl bg-[var(--dropdown-bg)] py-6 px-4">
        {/* score band */}
        <div className="flex items-center justify-between">
          <div
            className="text-[32px] font-bold"
            style={{ color: passed ? "var(--passed-text)" : "var(--danger-text)" }}
          >
            {overall.total_points} / {overall.max_points}
          </div>
          <span
            className="rounded-[10px] border px-4 py-2.5 text-[20px] font-bold"
            style={{
              color: passed ? "var(--passed-text)" : "var(--danger-text)",
              borderColor: passed ? "var(--passed-border)" : "var(--danger-border)",
            }}
          >
            {passed ? "Bestanden" : "Nicht Bestanden"}
          </span>
        </div>

        <div className="relative mt-4 h-2.5 w-full rounded-full bg-[var(--btn-inactive)]">
          <div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ width: `${pct}%`, background: passed ? "var(--passed-border)" : "var(--danger-border)" }}
          />
          <div
            className="absolute top-[-3px] h-[16px] w-[2px] bg-[var(--ink)]"
            style={{ left: `${passMarkPct}%` }}
          />
        </div>

        <p className="mt-3 text-[14px] font-bold text-[var(--ink)]">
          {passed ? "Pass" : "Fail"} — {overall.total_points}/{overall.max_points} · Pass Mark 60
        </p>

        {/* three task cards */}
        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          {tasks.map((t) => {
            const zero = t.task_points === 0;
            const taskPct = t.task_max ? (t.task_points / t.task_max) * 100 : 0;
            return (
              <div
                key={t.task}
                className="rounded-xl border p-4"
                style={{
                  background: zero ? "var(--danger-bg)" : "var(--passed-bg)",
                  borderColor: zero ? "var(--danger-border)" : "var(--passed-border)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[20px] font-bold text-[var(--ink)]">Aufgabe {t.task}</span>
                  <span className="text-[20px] font-bold text-[var(--ink)]">
                    {t.task_points}/{t.task_max}
                  </span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-[var(--btn-inactive)]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${taskPct}%`, background: zero ? "var(--danger-border)" : "var(--passed-border)" }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* disclaimer */}
        <p className="mt-4 text-[14px] text-[var(--placeholder)]">
          Automatische Einschätzung nach den offiziellen Goethe/ÖSD-Kriterien. Keine offizielle Bewertung.
        </p>
      </section>
    </>
  );
}

// ═════════════════════════════════════════════════════════════
// PART 2 — CAROUSEL
// Arrows float ON TOP of the slide (absolute), not in the flow.
// Uses /public/skiparrow.svg. Assumed to point RIGHT; the left
// arrow is flipped with rotate-180.
// ═════════════════════════════════════════════════════════════
function TaskCarousel({ tasks }: { tasks: ReportTask[] }) {
  const [index, setIndex] = useState(0);
  const atStart = index === 0;
  const atEnd = index === tasks.length - 1;

  return (
    <div className="mt-10 py-6 px-4">
      {/* relative wrapper so arrows can be absolutely placed over it */}
      <div className="relative">
        {/* current slide — full width, arrows don't take space */}
        <TaskSlide task={tasks[index]} />

        {/* left arrow — floats over the left edge, vertically centered */}
        {!atStart && (
          <button
            aria-label="Vorherige Aufgabe"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/5 lg:-translate-x-1/2 z-10 cursor-pointer transition-transform hover:scale-110 active:scale-95"
          >
            <Image src="/skiparrow.svg" alt="" width={60} height={60} className="rotate-180" />
          </button>
        )}

        {/* right arrow — floats over the right edge, vertically centered */}
        {!atEnd && (
          <button
            aria-label="Nächste Aufgabe"
            onClick={() => setIndex((i) => Math.min(tasks.length - 1, i + 1))}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/5 lg:translate-x-1/2 z-10 cursor-pointer transition-transform hover:scale-110 active:scale-95"
          >
            <Image src="/skiparrow.svg" alt="" width={60} height={60} />
          </button>
        )}
      </div>

      {/* position indicator: "n / 3" + dots */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <span className="text-base font-bold text-[var(--ink)]">
          {index + 1} / {tasks.length}
        </span>
        <div className="flex gap-2">
          {tasks.map((t, i) => (
            <button
              key={t.task}
              aria-label={`Aufgabe ${t.task}`}
              onClick={() => setIndex(i)}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === index ? "20px" : "8px",
                background: i === index ? "var(--accent)" : "var(--btn-inactive)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// One Aufgabe slide: heading + four criterion cards + corrected text.
// ═════════════════════════════════════════════════════════════
function TaskSlide({ task }: { task: ReportTask }) {
  const cleaned = cleanErrors(task); // phantom errors stripped here

  return (
    <section>
      <h2 className="text-xl md:text-2xl font-bold text-[var(--ink)]">
        Aufgabe {task.task}{" "}
        <span className="font-normal text-xl md:text-2xl text-[var(--ink)]">
          {TASK_TYPE[task.task] ?? ""}
        </span>
      </h2>

      <div className="mt-4 flex flex-col gap-3">
        {CRITERIA.map(({ key, label }) => {
          const c = task.criteria[key];
          const max = maxForCriterion(task.task, key);
          return (
            <div key={key} className="rounded-2xl border border-[var(--btn-inactive)] px-4 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                {/* label + score pair (score visible on phone/tablet only) */}
                <div className="flex items-center justify-between md:justify-start md:w-auto shrink-0">
                  <span className="font-bold text-[var(--ink)]">{label}</span>
                  <span className="font-bold text-[var(--ink)] md:hidden">{c.points}/{max}</span>
                </div>

                {/* pills */}
                <div className="flex-1 flex flex-wrap justify-center gap-2">
                  <BandStrip active={c.band} />
                </div>

                {/* score on desktop only */}
                <span className="hidden md:block font-bold text-[var(--ink)] md:text-right shrink-0">
                  {c.points}/{max}
                </span>
              </div>

              {c.comment && (
                <p className="mt-4 text-base font-bold text-[var(--ink)] leading-relaxed">{c.comment}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* corrected text */}
      <div className="mt-4">
        <span className="inline-block rounded-lg border border-[var(--btn-inactive)] px-2 py-1 text-base font-bold text-center text-[var(--ink)]">
          corrected text
        </span>
        <p className="mt-4 text-base font-bold text-[var(--ink)] leading-relaxed">
          {task.corrected_text}
        </p>
      </div>

      {/* error list (phantom-filtered). Hidden if empty. */}
      {cleaned.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {cleaned.map((e, i) => (
            <li key={i} className="text-sm text-[var(--body-text)]">
              <span className="line-through text-[var(--placeholder)]">{e.original}</span> →{" "}
              <span className="font-semibold">{e.correction}</span>
              <span className="text-[var(--instructions)]"> — {e.explanation}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function BandStrip({ active }: { active: Band }) {
  return (
    <div className="flex w-full flex-wrap justify-center gap-2">
      {BAND_LABELS.map(({ band, label }) => {
        const on = band === active;
        return (
          <span
            key={band}
            className="flex-1 min-w-[100px] md:flex-none md:w-[120px] rounded-lg border px-2 py-1 text-base font-bold text-center"
            style={{
              background: on ? "var(--accent)" : "transparent",
              borderColor: on ? "var(--accent)" : "var(--btn-inactive)",
              color: on ? "#fff" : "var(--ink)",
            }}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}

// Per-criterion max, mirroring grade.js POINTS tables.
function maxForCriterion(taskNum: number, criterion: string): number {
  if (taskNum !== 3) return 10;
  return criterion === "wortschatz" || criterion === "strukturen" ? 6 : 4;
}