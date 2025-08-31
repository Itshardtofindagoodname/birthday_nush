"use client"

import { useMemo, useState } from "react"

type Cell = "X" | "O" | null

export default function TicTacToeGame() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [turn, setTurn] = useState<"X" | "O">("X")
  const winner = useMemo(() => calcWinner(board), [board])

  function play(i: number) {
    if (board[i] || winner) return
    const next = board.slice()
    next[i] = "X"
    const w1 = calcWinner(next)
    if (w1 || next.every(Boolean)) {
      setBoard(next)
      return
    }
    // computer move (O) - simple minimax
    const move = bestMove(next, "O")
    if (move !== -1) next[move] = "O"
    setBoard(next)
    setTurn("X")
  }

  function reset() {
    setBoard(Array(9).fill(null))
    setTurn("X")
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-1">
        {board.map((c, i) => (
          <button
            key={i}
            className="flex h-16 items-center justify-center rounded-md border text-xl font-bold"
            onClick={() => play(i)}
            aria-label={`Cell ${i + 1}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-2 text-sm">
        {winner ? (winner === "Draw" ? "It's a draw!" : `Winner: ${winner}`) : `Your turn: ${turn}`}
      </div>
      <button
        className="mt-2 w-full rounded-md bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700"
        onClick={reset}
      >
        {winner ? "Play Again" : "Reset"}
      </button>
    </div>
  )
}

function calcWinner(b: Cell[]): "X" | "O" | "Draw" | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (const [a, b2, c] of lines) {
    if (b[a] && b[a] === b[b2] && b[a] === b[c]) return b[a]
  }
  if (b.every(Boolean)) return "Draw"
  return null
}

function bestMove(b: Cell[], player: "X" | "O"): number {
  let bestScore = Number.NEGATIVE_INFINITY
  let move = -1
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      b[i] = player
      const score = minimax(b, 0, false)
      b[i] = null
      if (score > bestScore) {
        bestScore = score
        move = i
      }
    }
  }
  return move
}
function minimax(b: Cell[], depth: number, isMax: boolean): number {
  const w = calcWinner(b)
  if (w === "O") return 10 - depth
  if (w === "X") return depth - 10
  if (w === "Draw") return 0

  const player: "X" | "O" = isMax ? "O" : "X"
  let best = isMax ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      b[i] = player
      const val = minimax(b, depth + 1, !isMax)
      b[i] = null
      best = isMax ? Math.max(best, val) : Math.min(best, val)
    }
  }
  return best
}
