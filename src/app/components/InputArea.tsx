"use client";

import { useState } from "react";
import type { Provider } from "../page";
import { TASKS } from "../data/tasks";
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
const EXAM_SETS = ["Prüfung 01", "Prüfung 02", "Prüfung 03"];

export default function InputArea({ provider, onProviderChange }: InputAreaProps) {
  const [level, setLevel] = useState("B1");
  const [examSet, setExamSet] = useState("Prüfung 01");
  const [selectedTaskId, setSelectedTaskId] = useState("a1");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  const current = TASKS.find((t) => t.id === selectedTaskId) ?? TASKS[0];
  const count = countWords(text);
  const bounds = { min: current.min, max: current.max, target: current.target };
  const status = getStatus(count, bounds);
  const progressPct = Math.max(0, Math.min(100, Math.round((count / bounds.target) * 100)));
  const submitDisabled = loading || !text.trim();

  function submit() {
    if (loading || !text.trim()) return;
    setLoading(true);
    setDone(false);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 2000);
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "clamp(20px,4vw,48px)",
        gap: 28,
      }}
    >
      <h2
        style={{
          fontSize: "clamp(24px,4vw,34px)",
          fontWeight: 700,
          color: "var(--heading)",
          textAlign: "center",
          margin: 0,
        }}
      >
        Deutsch lernen, wie es sein sollte.
      </h2>

      <div
        style={{
          width: "100%",
          maxWidth: 720,
          background: "#FFFFFF",
          borderRadius: 20,
          padding: "clamp(20px,3.5vw,32px)",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          boxShadow: "0 20px 50px -30px rgba(0,0,0,.35)",
        }}
      >
        {/* Provider selector — drives the page bg */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => onProviderChange(p.id)}
              style={pillStyle(provider === p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Level row — B1 active, others visual for now */}
        <div style={{ display: "flex", gap: 10 }}>
          {LEVELS.map((lvl) => {
            const active = lvl === level;
            const enabled = lvl === "B1";
            return (
              <button
                key={lvl}
                onClick={() => enabled && setLevel(lvl)}
                disabled={!enabled}
                style={{
                  ...levelStyle(active),
                  opacity: enabled ? 1 : 0.5,
                  cursor: enabled ? "pointer" : "not-allowed",
                }}
              >
                {lvl}
              </button>
            );
          })}
        </div>

        {/* Exam-set + task dropdowns */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <select
            value={examSet}
            onChange={(e) => setExamSet(e.target.value)}
            style={{ ...dropdownStyle, flex: "0 0 auto", minWidth: 120 }}
          >
            {EXAM_SETS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={selectedTaskId}
            onChange={(e) => {
              setSelectedTaskId(e.target.value);
              setDone(false);
              setError(false);
            }}
            style={{ ...dropdownStyle, flex: 1, minWidth: 200 }}
          >
            {TASKS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Deine Aufgabe card */}
        <div
          style={{
            border: "1px solid #E5E5E5",
            borderRadius: 14,
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--heading)",
            }}
          >
            Deine Aufgabe
          </span>
          <div
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--instructions)",
              whiteSpace: "pre-line",
            }}
          >
            {current.prompt}
          </div>
        </div>

        {/* Textarea + progress + footer */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Schreib hier deinen Text…"
            style={{
              width: "100%",
              minHeight: "clamp(180px,30vh,300px)",
              resize: "vertical",
              padding: "18px 20px",
              border: "1px solid #E5E5E5",
              borderRadius: "14px 14px 0 0",
              borderBottom: "none",
              color: "var(--body-text)",
              fontFamily: "inherit",
              fontSize: 16,
              lineHeight: 1.7,
            }}
          />
          <div style={{ height: 5, background: "#EEE", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${progressPct}%`,
                background: "var(--accent)",
                transition: "width .35s ease",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              padding: "12px 16px",
              border: "1px solid #E5E5E5",
              borderTop: "none",
              borderRadius: "0 0 14px 14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "var(--body-text)" }}>
                {count}
              </span>
              <span style={{ fontSize: 13, color: "var(--placeholder)" }}>words</span>
              <span style={{ fontSize: 13, color: "#CCC" }}>·</span>
              <span style={{ fontSize: 13, color: "var(--placeholder)" }}>
                Target ~{bounds.target} words
              </span>
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--instructions)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: status.dot,
                  flex: "none",
                }}
              />
              {status.label}
            </span>
          </div>
        </div>

        {/* Submit + banners */}
        {done && (
          <div style={bannerStyle("#0F7B5A", "#E6F6EF")}>
            ✓ Deine Korrektur ist fertig — dein Feedback wird gleich angezeigt.
          </div>
        )}
        {error && (
          <div style={bannerStyle("#9A6B00", "#FBF3DD")}>
            ! Etwas ist schiefgelaufen — dein Text ist sicher gespeichert. Versuch es
            nochmal.
          </div>
        )}

        <button onClick={submit} disabled={submitDisabled} style={submitStyle(submitDisabled)}>
          {loading ? "Grading your text…" : "Correct my writing"}
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            justifyContent: "center",
            color: "var(--placeholder)",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          <span
            style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent)", flex: "none" }}
          />
          Your text is safe — you&apos;ll never lose it if something goes wrong.
        </div>
      </div>
    </div>
  );
}

function pillStyle(active: boolean): React.CSSProperties {
  return {
    padding: "8px 20px",
    border: "none",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    color: active ? "#FFFFFF" : "var(--btn-text)",
    background: active ? "var(--accent)" : "var(--btn-inactive)",
    transition: "all .18s ease",
  };
}

function levelStyle(active: boolean): React.CSSProperties {
  return {
    flex: 1,
    padding: "10px 0",
    border: "none",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 14,
    color: active ? "#FFFFFF" : "var(--btn-text)",
    background: active ? "var(--accent)" : "var(--btn-inactive)",
    transition: "all .18s ease",
  };
}

const dropdownStyle: React.CSSProperties = {
  appearance: "none",
  WebkitAppearance: "none",
  padding: "12px 16px",
  border: "1px solid #E5E5E5",
  borderRadius: 10,
  background: "var(--dropdown-bg)",
  color: "var(--btn-text)",
  fontFamily: "inherit",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
};

function bannerStyle(color: string, bg: string): React.CSSProperties {
  return {
    padding: "12px 16px",
    borderRadius: 10,
    background: bg,
    color,
    fontSize: 14,
    lineHeight: 1.45,
    fontWeight: 500,
  };
}

function submitStyle(disabled: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "15px 20px",
    border: "none",
    borderRadius: 12,
    background: "var(--accent)",
    color: "#FFFFFF",
    fontFamily: "inherit",
    fontSize: 16,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "all .18s ease",
  };
}