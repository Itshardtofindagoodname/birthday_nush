"use client"

import { useEffect, useRef, useState } from "react"

export default function StackGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [level, setLevel] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    const W = (canvas.width = 320)
    const H = (canvas.height = 300)

    let raf = 0
    const stacks: { x: number; w: number; y: number }[] = [{ x: 80, w: 160, y: H - 20 }]
    let moving = { x: 0, w: stacks[0].w, dir: 2, y: H - 40 }

    function drop() {
      const top = stacks[stacks.length - 1]
      const overlapLeft = Math.max(moving.x, top.x)
      const overlapRight = Math.min(moving.x + moving.w, top.x + top.w)
      const overlap = overlapRight - overlapLeft
      if (overlap <= 0) {
        setRunning(false)
        return
      }
      stacks.push({ x: overlapLeft, w: overlap, y: top.y - 20 })
      moving = { x: 0, w: overlap, dir: 2 + stacks.length * 0.15, y: top.y - 40 }
      setLevel(stacks.length - 1)
    }

    function draw() {
      ctx.fillStyle = "#fff"
      ctx.fillRect(0, 0, W, H)

      // draw stacks
      stacks.forEach((s, i) => {
        ctx.fillStyle = i % 2 === 0 ? "#e11d48" : "#f59e0b"
        ctx.fillRect(s.x, s.y, s.w, 20)
      })

      // move current
      moving.x += moving.dir
      if (moving.x <= 0 || moving.x + moving.w >= W) moving.dir *= -1

      ctx.fillStyle = "#374151"
      ctx.fillRect(moving.x, moving.y, moving.w, 20)

      // HUD
      ctx.fillStyle = "#111"
      ctx.font = "bold 14px system-ui, -apple-system, Segoe UI, sans-serif"
      ctx.fillText(`Level: ${Math.max(0, stacks.length - 1)}`, 10, 18)

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    canvas.onclick = () => drop()

    return () => {
      cancelAnimationFrame(raf)
      canvas.onclick = null
    }
  }, [running])

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-xs">
        <canvas ref={canvasRef} className="mx-auto block w-full rounded-md border" width={320} height={300} />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button
          className="flex-1 rounded-md bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700"
          onClick={() => {
            setLevel(0)
            setRunning(true)
          }}
        >
          {running ? "Stacking..." : level > 0 ? "Play Again" : "Start"}
        </button>
        <div className="text-sm text-muted-foreground">Level: {level}</div>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Tap the canvas to drop the block.</p>
    </div>
  )
}
