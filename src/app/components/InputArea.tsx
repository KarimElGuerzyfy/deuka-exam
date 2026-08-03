"use client";

import { useState, useSyncExternalStore } from "react";
import * as Select from "@radix-ui/react-select";
import Image from "next/image";
import type { Provider } from "../page";
import { EXAMS, getExamsBy } from "../data/exams";
import { countWords, getStatus } from "../lib/wordStatus";

interface InputAreaProps {
  provider: Provider;
  onProviderChange: (p: Provider) => void;
}

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: "osd", label: "ÖSD" },
  { id: "telc", label: "TELC" },
  { id: "goethe", label: "GOETHE" },
];

const LEVELS = ["A1", "A2", "B1", "B2"];

const MOBILE_QUERY = "(max-width: 767px)";

function subscribeMobile(callback: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getMobileSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function getMobileServerSnapshot() {
  return false;
}

export default function InputArea({ provider, onProviderChange }: InputAreaProps) {
  const [level, setLevel] = useState("B1");
  const [selectedExamId, setSelectedExamId] = useState(EXAMS[0].id);
  const [selectedTaskId, setSelectedTaskId] = useState(EXAMS[0].tasks[0].id);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, getMobileServerSnapshot);

  const availableExams = getExamsBy(provider, "B1");
  const currentExam = availableExams.find((e) => e.id === selectedExamId) ?? availableExams[0];
  const current = currentExam?.tasks.find((t) => t.id === selectedTaskId) ?? currentExam?.tasks[0];
  const count = countWords(text);
  const bounds = current ? { min: current.min, max: current.max, target: current.target } : null;
  const status = bounds ? getStatus(count, bounds) : null;
  const progressPct = bounds ? Math.max(0, Math.min(100, Math.round((count / bounds.target) * 100))) : 0;
  const submitDisabled = loading || !text.trim() || !current;

  function submit() {
    if (loading || !text.trim() || !current) return;
    setLoading(true);
    setDone(false);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 2000);
  }

  return (
    <div className="flex w-full flex-col items-center gap-7 px-3 py-6 md:px-6 md:py-[54px] lg:py-[100px]">
      <h2 className="m-0 text-center text-[clamp(40px,4vw,48px)] font-extrabold text-[var(--ink)] leading-none">
        Deutsch lernen, wie es sein sollte.
      </h2>

      {/* MAIN CONTENT CONTAINER */}
      <div className="flex w-full max-w-[1075px] flex-col gap-3 rounded-[20px] p-[clamp(20px,3.5vw,32px)]">

        {/* PART 1 — Selector: provider pills + level row */}
        <section className="flex flex-col gap-4 rounded-2xl bg-white px-2 pt-5 pb-2 md:px-3 md:pt-6 md:pb-3">
          <div className="flex justify-center gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => onProviderChange(p.id)}
                className={pillClass(provider === p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {LEVELS.map((lvl) => {
              const active = lvl === level;
              const enabled = lvl === "B1";
              return (
                <button
                  key={lvl}
                  onClick={() => enabled && setLevel(lvl)}
                  disabled={!enabled}
                  className={`${levelClass(active)} ${
                    enabled ? "cursor-pointer opacity-100" : "cursor-not-allowed opacity-50"
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </section>

        {/* PART 2 — Picker: exam-set + task dropdowns */}
        <section className="flex flex-wrap gap-2 mb-3 md:mb-5">
          <Select.Root
            value={currentExam?.id ?? ""}
            onValueChange={(v) => {
              setSelectedExamId(v);
              const nextExam = availableExams.find((e) => e.id === v);
              if (nextExam) setSelectedTaskId(nextExam.tasks[0].id);
              setDone(false);
              setError(false);
            }}
            disabled={availableExams.length === 0}
          >
            <Select.Trigger className={`${triggerClass} min-w-[120px] flex-none`}>
              <Select.Value placeholder="Keine Prüfung">
                {currentExam ? currentExam.setLabel : null}
              </Select.Value>
              <Select.Icon className="-mr-1 flex-none data-[state=open]:rotate-180">
                <Image
                  src="/arrow.svg"
                  alt=""
                  width={15}
                  height={8}
                  className="w-[15px] h-[8px] transition-transform"
                />
              </Select.Icon>
            </Select.Trigger>
            <Select.Content position="popper" sideOffset={4} className={panelClass}>
              <Select.Viewport className="p-1">
                {availableExams.map((exam) => (
                  <Select.Item key={exam.id} value={exam.id} className={itemClass}>
                    <Select.ItemText>{exam.setLabel}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>

          <Select.Root
            value={current?.id ?? ""}
            onValueChange={(v) => {
              setSelectedTaskId(v);
              setDone(false);
              setError(false);
            }}
            disabled={!currentExam || currentExam.tasks.length === 0}
          >
            <Select.Trigger className={`${triggerClass} min-w-[200px] flex-1`}>
              <Select.Value placeholder="Keine Aufgabe">
                {current ? (isMobile ? current.shortLabel : current.label) : null}
              </Select.Value>
              <Select.Icon className="-mr-1 flex-none data-[state=open]:rotate-180">
                <Image
                  src="/arrow.svg"
                  alt=""
                  width={15}
                  height={8}
                  className="w-[15px] h-[8px] transition-transform"
                />
              </Select.Icon>
            </Select.Trigger>
            <Select.Content position="popper" sideOffset={4} className={panelClass}>
              <Select.Viewport className="p-1">
                {(currentExam?.tasks ?? []).map((t) => (
                  <Select.Item key={t.id} value={t.id} className={itemClass}>
                    <Select.ItemText>{isMobile ? t.shortLabel : t.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>
        </section>

        {/* PART 3 — Writing: Aufgabe card + textarea + progress + footer */}
        <section className="flex flex-col gap-[18px]">
          {!current || !bounds || !status ? (
            <div className={bannerClass("error")}>
              Für {PROVIDERS.find((p) => p.id === provider)?.label ?? provider} sind aktuell noch
              keine B1-Prüfungen verfügbar.
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 rounded-[14px] border border-[#E5E5E5] bg-white px-[18px] py-4">
                <span className="text-base md:text-xl font-bold text-[var(--heading)]">
                  Deine Aufgabe
                </span>
                <p className="text-sm md:text-base font-bold text-[var(--ink)]">{current.intro}</p>
                {current.stimulusText && (
                  <div className="flex flex-col gap-1 rounded-[10px] border border-[#E5E5E5] bg-[var(--dropdown-bg)] px-4 py-3">
                    <p className="text-sm md:text-base font-bold text-[var(--instructions)]">
                      {current.stimulusText}
                    </p>
                  </div>
                )}
                {current.bullets && current.bullets.length > 0 && (
                  <ul className="flex list-disc flex-col gap-1 pl-12">
                    {current.bullets.map((b, i) => (
                      <li key={i} className="text-sm md:text-base font-bold text-[var(--instructions)]">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {current.instruction && (
                  <p className="text-sm md:text-base font-bold text-[var(--instructions)]">
                    {current.instruction}
                  </p>
                )}
                <ul className="flex flex-col gap-1">
                  {current.formatNotes.map((n, i) => (
                    <li key={i} className="text-sm md:text-base font-bold text-[var(--instructions)]">
                      {n}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-6">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Schreib hier deinen Text…"
                  className="min-h-[clamp(180px,30vh,300px)] w-full resize-y rounded-[14px] border border-[#E5E5E5] bg-white px-5 py-[18px] font-[inherit] text-sm md:text-base leading-[1.7] text-[var(--ink)] placeholder:text-[color-mix(in_srgb,var(--placeholder)_60%,transparent)] font-bold"
                />
                <div className="overflow-hidden rounded-[14px] border border-[#E5E5E5] bg-white">
                  <div className="h-[8px] overflow-hidden bg-[#EEE]">
                    <div
                      className="h-full bg-[var(--accent)] transition-[width] duration-[.35s] ease-in-out"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-[10px] px-4 py-3 text-[var(--ink)] font-bold md:justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold">{count}</span>
                      <span className="text-base">words</span>
                      <span className="text-base">·</span>
                      <span className="text-base">
                        Target ~{bounds.target} words
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-2 text-base font-semibold">
                      <span
                        className="h-2 w-2 flex-none rounded-full"
                        style={{ background: status.dot }}
                      />
                      {status.label}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* PART 4 — Action: banners + submit + safety note */}
        <section className="flex flex-col gap-[18px]">
          {done && (
            <div className={bannerClass("done")}>
              ✓ Deine Korrektur ist fertig — dein Feedback wird gleich angezeigt.
            </div>
          )}
          {error && (
            <div className={bannerClass("error")}>
              ! Etwas ist schiefgelaufen — dein Text ist sicher gespeichert. Versuch es
              nochmal.
            </div>
          )}

          <button onClick={submit} disabled={submitDisabled} className={submitClass(submitDisabled)}>
            {loading ? "Grading your text…" : "Correct my writing"}
          </button>

          <div className="flex items-center justify-center gap-2 text-center text-base text-[var(--ink)] font-bold">
            <span className="h-1.5 w-1.5 flex-none rounded-full bg-[var(--accent)]" />
            Your text is safe — you&apos;ll never lose it if something goes wrong.
          </div>
        </section>

      </div>
    </div>
  );
}

function pillClass(active: boolean): string {
  return `rounded-lg border-none px-5 py-1.5 md:py-2 text-base font-bold cursor-pointer transition-all duration-[.18s] ease-in-out text-[var(--ink)] ${
    active ? "bg-[var(--accent)]" : "bg-[var(--btn-inactive)]"
  }`;
}

function levelClass(active: boolean): string {
  return `flex-1 rounded-lg border-none py-1.5 md:py-2 text-base font-bold transition-all duration-[.18s] ease-in-out text-[var(--ink)] ${
    active ? "bg-[var(--accent)]" : "bg-[var(--btn-inactive)]"
  }`;
}

const triggerClass =
  "appearance-none rounded-[12px] border border-[#E5E5E5] bg-[var(--dropdown-bg)] pl-4 pr-3 py-2 font-[inherit] text-base md:text-xl font-bold text-[var(--btn-text)] cursor-pointer flex items-center justify-between gap-2 text-left";

const panelClass =
  "z-50 overflow-hidden rounded-[12px] border border-[#E5E5E5] bg-[var(--dropdown-bg)] shadow-[0_10px_30px_-12px_rgba(0,0,0,.25)] w-[var(--radix-select-trigger-width)]";

const itemClass =
  "cursor-pointer select-none rounded-[8px] px-4 py-2 font-[inherit] text-base md:text-xl font-bold text-[var(--btn-text)] outline-none data-[highlighted]:bg-[var(--btn-inactive)] data-[state=checked]:bg-[var(--accent)]";

function bannerClass(kind: "done" | "error"): string {
  const base = "rounded-[10px] px-4 py-3 text-sm font-medium leading-[1.45]";
  return kind === "done"
    ? `${base} bg-[#E6F6EF] text-[#0F7B5A]`
    : `${base} bg-[#FBF3DD] text-[#9A6B00]`;
}

function submitClass(disabled: boolean): string {
  return `w-full rounded-[12px] border-none bg-[var(--accent)] px-5 py-[15px] font-[inherit] text-base font-bold text-[var(--ink)] transition-all duration-[.18s] ease-in-out ${
    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer opacity-100"
  }`;
}