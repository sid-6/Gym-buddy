"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/TextField";

const notices: Record<string, string> = {
  not_configured: "Ask GymBuddy could not reach the AI service. This reply uses your saved GymBuddy logs.",
  quota: "The AI service is rate-limited right now. This reply uses your saved GymBuddy logs.",
  invalid_key: "The AI service key was rejected. This reply uses your saved GymBuddy logs.",
  provider_error: "Ask GymBuddy could not get an AI reply. This answer uses your saved GymBuddy logs.",
  empty: "The AI service returned an empty reply. This answer uses your saved GymBuddy logs.",
};

export function CoachAsk() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit() {
    setPending(true);
    setError(null);
    setAnswer(null);
    setNotice(null);
    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const payload = (await response.json()) as {
        text?: string;
        error?: string;
        notice?: string;
      };
      if (!response.ok) {
        setError(
          payload.error === "Unauthorized"
            ? "Sign in again."
            : payload.error === "Ask a short, specific question."
              ? payload.error
              : "Could not get a reply. Try again.",
        );
        return;
      }
      setAnswer(payload.text ?? null);
      if (payload.notice && notices[payload.notice]) setNotice(notices[payload.notice]);
    } catch {
      setError("Could not reach Ask GymBuddy. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="mt-5 space-y-3">
      <p className="text-[15px] font-semibold">Ask about your training</p>
      <p className="text-[13px] text-muted">
        Answers use your saved goal, workouts, sets, and meals. Missing data is called out, not invented.
      </p>
      <TextField
        id="coach-question"
        label="Question"
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="What should I do first today?"
      />
      <Button type="button" disabled={pending || question.trim().length < 3} onClick={() => void submit()}>
        {pending ? "Thinking…" : "Ask GymBuddy"}
      </Button>
      {notice ? <p className="text-[13px] text-muted">{notice}</p> : null}
      {error ? <p className="text-[13px] text-red-700">{error}</p> : null}
      {answer ? <p className="whitespace-pre-wrap text-[14px] leading-6 text-ink">{answer}</p> : null}
    </Card>
  );
}
