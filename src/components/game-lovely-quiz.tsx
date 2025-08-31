"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type Q = {
  q: string
  options: string[]
  answerIndex: number
}

const QUESTIONS: Q[] = [
  {
    q: "When is the big day we’re counting to?",
    options: ["Sep 8", "Sep 9", "Sep 10", "Sep 11"],
    answerIndex: 2,
  },
  {
    q: "What’s the vibe of this site?",
    options: ["Spooky", "Lovely", "Sporty", "Techy"],
    answerIndex: 1,
  },
  {
    q: "How long does Tap-the-Heart last?",
    options: ["10s", "20s", "30s", "60s"],
    answerIndex: 1,
  },
]

export default function LoveQuiz() {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [complete, setComplete] = useState(false)

  const current = QUESTIONS[index]

  function choose(i: number) {
    setSelected(i)
  }

  function next() {
    if (selected === null) return
    if (selected === current.answerIndex) setScore((s) => s + 1)

    if (index === QUESTIONS.length - 1) {
      setComplete(true)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
    }
  }

  function restart() {
    setIndex(0)
    setSelected(null)
    setScore(0)
    setComplete(false)
  }

  if (complete) {
    return (
      <div className="rounded-md border p-4 text-center">
        <p className="text-sm">Your score:</p>
        <p className="mt-1 text-2xl font-bold">
          {score} / {QUESTIONS.length}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">No matter the score, you’re perfect to me.</p>
        <Button className="mt-3 bg-transparent" variant="outline" onClick={restart}>
          Play again
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-md border p-4">
      <p className="font-medium">{current.q}</p>
      <div className="mt-3 grid grid-cols-1 gap-2">
        {current.options.map((opt, i) => {
          const isSel = selected === i
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              className={`w-full text-left rounded-md border px-3 py-2 text-sm ${
                isSel ? "border-rose-300 bg-rose-50" : "bg-card"
              }`}
              aria-pressed={isSel}
            >
              {opt}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Question {index + 1} of {QUESTIONS.length}
        </p>
        <Button size="sm" onClick={next} disabled={selected === null}>
          {index === QUESTIONS.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  )
}
