"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { HeartIcon } from "./heart-icon"

type Spawned = {
  id: number
  xPct: number
  yPct: number
}

const GAME_SECONDS = 20
const SPAWN_MS = 650

export default function TapHeartGame() {
  const [running, setRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS)
  const [score, setScore] = useState(0)
  const [hearts, setHearts] = useState<Spawned[]>([])
  const nextId = useRef(1)

  useEffect(() => {
    if (!running) return
    setTimeLeft(GAME_SECONDS)
    setScore(0)
    setHearts([])

    const tick = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(tick)
        }
        return Math.max(0, t - 1)
      })
    }, 1000)

    const spawner = setInterval(() => {
      setHearts((h) => {
        const id = nextId.current++
        const xPct = 5 + Math.random() * 90 // Keep inside bounds
        const yPct = 5 + Math.random() * 80
        return [...h, { id, xPct, yPct }]
      })
    }, SPAWN_MS)

    return () => {
      clearInterval(tick)
      clearInterval(spawner)
    }
  }, [running])

  useEffect(() => {
    if (running && timeLeft === 0) {
      setRunning(false)
      setTimeout(() => setHearts([]), 200)
    }
  }, [running, timeLeft])

  const onHit = useCallback(
    (id: number) => {
      if (!running) return
      setScore((s) => s + 1)
      setHearts((h) => h.filter((p) => p.id !== id))
    },
    [running],
  )

  function startGame() {
    setRunning(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="font-medium">Score:</span> {score}
        </div>
        <div className="text-sm">
          <span className="font-medium">Time:</span> {timeLeft}s
        </div>
        <Button size="sm" onClick={startGame} disabled={running}>
          {running ? "Running..." : "Start"}
        </Button>
      </div>

      <div
        className="relative mt-3 h-56 rounded-md border overflow-hidden bg-card"
        aria-label="Tap the heart game area"
      >
        {hearts.map((h) => (
          <button
            key={h.id}
            onClick={() => onHit(h.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${h.xPct}%`, top: `${h.yPct}%` }}
            aria-label="Tap heart"
            title="Tap!"
          >
            <HeartIcon className="size-8 text-rose-600" aria-hidden="true" />
          </button>
        ))}
        {!running && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center px-4">
              <p className="text-sm text-muted-foreground">Tap Start and hit as many hearts as you can!</p>
            </div>
          </div>
        )}
      </div>

      {!running && timeLeft === 0 && (
        <div className="mt-3 rounded-md bg-amber-50 border border-amber-200 p-3 text-sm">
          Time’s up! You scored <span className="font-medium">{score}</span>. Nicely done!
        </div>
      )}
    </div>
  )
}
