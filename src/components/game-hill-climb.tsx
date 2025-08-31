"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

export default function HillClimbGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [running, setRunning] = useState(false)
  const [distance, setDistance] = useState(0)
  const [coins, setCoins] = useState(0)

  const throttleRef = useRef(0) // -1 reverse, 0 idle, +1 accelerate
  const speedRef = useRef(0)
  const worldXRef = useRef(0)
  const carYRef = useRef(0)
  const carAngleRef = useRef(0)

  const coinSet = useRef<Set<number>>(new Set()) // collected coin indices

  const W = 320
  const H = 200
  const carScreenX = 80
  const gravity = 0.5
  const maxSpeed = 2.8
  const accel = 0.03
  const brakeDecel = 0.05
  const fric = 0.985
  const coinSpacing = 120

  function terrainY(x: number) {
    // Non-uniform rolling terrain
    return H - 48 + Math.sin(x * 0.01) * 16 + Math.sin(x * 0.021 + 1.7) * 8 + Math.sin(x * 0.005 + 3.1) * 12
  }

  function slope(x: number) {
    // derivative approximation
    const eps = 1
    return terrainY(x + eps) - terrainY(x - eps)
  }

  function coinAtIndex(i: number) {
    const x = i * coinSpacing + 140 // shift a bit ahead
    const y = terrainY(x) - 18 - (i % 2 === 0 ? 6 : 0) // vary height slightly
    return { x, y }
  }

  useEffect(() => {
    if (!running) return
    const c = canvasRef.current!
    const ctx = c.getContext("2d")!
    let raf = 0

    // initialize
    worldXRef.current = 0
    speedRef.current = 0
    coinSet.current = new Set()
    setCoins(0)
    setDistance(0)

    // car initial Y
    carYRef.current = terrainY(worldXRef.current) - 10

    function loop() {
      // physics
      const throttle = throttleRef.current
      // accelerate/brake/reverse
      if (throttle > 0) {
        speedRef.current += accel
      } else if (throttle < 0) {
        // reverse
        speedRef.current -= accel
      } else {
        // friction
        if (speedRef.current > 0) speedRef.current = Math.max(0, speedRef.current * fric - 0.001)
        if (speedRef.current < 0) speedRef.current = Math.min(0, speedRef.current * fric + 0.001)
      }

      // clamp speed
      if (speedRef.current > maxSpeed) speedRef.current = maxSpeed
      if (speedRef.current < -maxSpeed * 0.6) speedRef.current = -maxSpeed * 0.6

      // advance world
      worldXRef.current += speedRef.current * 2.0 // scale so it feels faster

      // vertical settle to terrain and gravity if airborne
      const groundY = terrainY(worldXRef.current)
      if (carYRef.current < groundY - 10) {
        carYRef.current += gravity
      } else {
        carYRef.current = groundY - 10
      }

      // car angle from slope
      const dy = slope(worldXRef.current)
      carAngleRef.current = Math.atan2(dy, 2)

      // coins collection window: compute index range near the car
      const idx = Math.floor(worldXRef.current / coinSpacing)
      for (let i = idx - 2; i <= idx + 6; i++) {
        if (i < 0) continue
        if (coinSet.current.has(i)) continue
        const { x, y } = coinAtIndex(i)
        const screenX = carScreenX + (x - worldXRef.current)
        // collision if close to car screen position
        const dx = screenX - carScreenX
        const dyc = y - carYRef.current
        if (Math.hypot(dx, dyc) < 16) {
          coinSet.current.add(i)
          setCoins((c) => c + 1)
        }
      }

      // distance
      setDistance(Math.max(0, Math.floor(worldXRef.current / 5)))

      // render
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, W, H)

      // draw terrain
      ctx.beginPath()
      ctx.moveTo(0, terrainY(worldXRef.current - carScreenX))
      for (let x = 1; x < W; x++) {
        const wx = worldXRef.current - carScreenX + x
        ctx.lineTo(x, terrainY(wx))
      }
      ctx.lineTo(W, H)
      ctx.lineTo(0, H)
      ctx.closePath()
      ctx.fillStyle = "#fde68a"
      ctx.fill()

      // draw coins in view
      for (let i = idx - 2; i <= idx + 20; i++) {
        if (i < 0) continue
        if (coinSet.current.has(i)) continue
        const { x, y } = coinAtIndex(i)
        const sx = carScreenX + (x - worldXRef.current)
        if (sx < -20 || sx > W + 20) continue
        ctx.fillStyle = "#f59e0b"
        ctx.beginPath()
        ctx.arc(sx, y, 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "#b45309"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // draw car
      ctx.save()
      ctx.translate(carScreenX, carYRef.current)
      ctx.rotate(carAngleRef.current)
      // body
      ctx.fillStyle = "#e11d48"
      ctx.fillRect(-14, -7, 28, 14)
      // wheels
      ctx.fillStyle = "#111827"
      ctx.beginPath()
      ctx.arc(-10, 8, 5, 0, Math.PI * 2)
      ctx.arc(10, 8, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [running])

  // control handlers (press-and-hold friendly)
  function bindHold(setter: (v: number) => void) {
    function onDown(e: React.PointerEvent<HTMLButtonElement>) {
      e.currentTarget.setPointerCapture(e.pointerId)
      setter(1)
    }
    function onUp(e: React.PointerEvent<HTMLButtonElement>) {
      setter(0)
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {}
    }
    return { onPointerDown: onDown, onPointerUp: onUp, onPointerCancel: onUp, onPointerLeave: onUp }
  }

  const accelBind = bindHold((v) => (throttleRef.current = v))
  const reverseBind = bindHold((v) => (throttleRef.current = -v))
  const brakeBind = bindHold((v) => {
    if (v) {
      const id = requestAnimationFrame(function decel() {
        if (Math.abs(speedRef.current) > 0.02) {
          speedRef.current += speedRef.current > 0 ? -0.05 : 0.05
          requestAnimationFrame(decel)
        }
      })
      return () => cancelAnimationFrame(id)
    }
  })

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-xs">
        <canvas ref={canvasRef} className="mx-auto block w-full rounded-md border" width={320} height={200} />
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <button
          className="rounded-md bg-rose-600 px-3 py-2 text-white hover:bg-rose-700"
          onClick={() => {
            setRunning(true)
            setCoins(0)
            setDistance(0)
            coinSet.current = new Set()
            worldXRef.current = 0
            speedRef.current = 0
          }}
        >
          {running ? "Driving..." : "Start"}
        </button>
        <div className="text-muted-foreground">Dist: {distance} m</div>
        <div className="text-muted-foreground">Coins: {coins}</div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <button className="rounded-md border px-3 py-2 text-sm" {...reverseBind} aria-label="Reverse">
          Reverse
        </button>
        <button className="rounded-md border px-3 py-2 text-sm" {...brakeBind} aria-label="Brake">
          Brake
        </button>
        <button className="rounded-md border px-3 py-2 text-sm" {...accelBind} aria-label="Accelerate">
          Accelerate
        </button>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Hold buttons to drive. Collect coins. You can reverse and backtrack.
      </p>
    </div>
  )
}
