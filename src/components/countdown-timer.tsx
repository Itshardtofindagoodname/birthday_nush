"use client"

import { useEffect, useMemo, useState } from "react"
import { HeartIcon } from "./heart-icon"

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTargetDate(): Date {
  const now = new Date()
  const currentYear = now.getFullYear()
  // Month is 0-indexed: 8 = September. Ends Sep 9, 23:59 local time.
  const target = new Date(currentYear, 8, 9, 23, 59, 0, 0)
  // If already passed, count to next year's Sep 9, 23:59
  if (now.getTime() > target.getTime()) {
    return new Date(currentYear + 1, 8, 9, 23, 59, 0, 0)
  }
  return target
}

function diffTime(target: Date): TimeLeft {
  const now = Date.now()
  const distance = Math.max(0, target.getTime() - now)
  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

export default function CountdownTimer() {
  const target = useMemo(() => getTargetDate(), [])
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => diffTime(target))
  const done = timeLeft.days + timeLeft.hours + timeLeft.minutes + timeLeft.seconds === 0

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(diffTime(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-pretty">
            {done ? "It's time to celebrate!" : "Countdown to your birthday"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Ends on <span className="font-medium">Sep 9, 23:59</span> local time.
          </p>
        </div>
        <HeartIcon className="size-7 text-rose-600" aria-hidden="true" />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        <TimeBox label="Days" value={pad(timeLeft.days)} />
        <TimeBox label="Hours" value={pad(timeLeft.hours)} />
        <TimeBox label="Minutes" value={pad(timeLeft.minutes)} />
        <TimeBox label="Seconds" value={pad(timeLeft.seconds)} />
      </div>

      <div className="mt-4 h-2 w-full rounded bg-muted">
        <ProgressBar target={target} />
      </div>
    </div>
  )
}

function TimeBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center rounded-md bg-card p-3 border">
      <span className="text-2xl font-bold tabular-nums">{value}</span>
      <span className="mt-1 text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

function ProgressBar({ target }: { target: Date }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const start = new Date(target.getFullYear(), 0, 1).getTime()
      const end = target.getTime()
      const now = Date.now()
      const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100))
      setProgress(pct)
    }
    update()
    const id = setInterval(update, 1000 * 60)
    return () => clearInterval(id)
  }, [target])

  return (
    <div
      className="h-2 rounded bg-rose-600 transition-all"
      style={{ width: `${progress}%` }}
      aria-label="Yearly progress toward target date"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    />
  )
}
