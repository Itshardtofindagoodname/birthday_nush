"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"

// Different icons from lucide-react
import {
  Heart,
  Star,
  Circle,
  Square,
  Triangle,
  Diamond,
} from "lucide-react"

type Card = {
  id: number
  pair: number
  flipped: boolean
  matched: boolean
}

const PAIRS = 6

// Assign each pair a unique icon + color
const ICONS = [
  { Icon: Heart, color: "text-rose-600" },
  { Icon: Star, color: "text-yellow-500" },
  { Icon: Circle, color: "text-blue-500" },
  { Icon: Square, color: "text-green-500" },
  { Icon: Triangle, color: "text-purple-500" },
  { Icon: Diamond, color: "text-orange-500" },
]

function generateDeck(): Card[] {
  const pairs = Array.from({ length: PAIRS }, (_, i) => i + 1)
  const deck = [...pairs, ...pairs].map(
    (pair, idx) =>
      ({
        id: idx + 1,
        pair,
        flipped: false,
        matched: false,
      }) as Card,
  )
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

export default function MemoryGame() {
  const [deck, setDeck] = useState<Card[]>(() => generateDeck())
  const [first, setFirst] = useState<number | null>(null)
  const [second, setSecond] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)

  const matchedCount = useMemo(() => deck.filter((c) => c.matched).length, [deck])
  const done = matchedCount === deck.length

  useEffect(() => {
    if (first !== null && second !== null) {
      setLocked(true)
      const f = deck[first]
      const s = deck[second]
      if (f.pair === s.pair) {
        setTimeout(() => {
          setDeck((d) => d.map((c, idx) => (idx === first || idx === second ? { ...c, matched: true } : c)))
          setFirst(null)
          setSecond(null)
          setLocked(false)
        }, 400)
      } else {
        setTimeout(() => {
          setDeck((d) => d.map((c, idx) => (idx === first || idx === second ? { ...c, flipped: false } : c)))
          setFirst(null)
          setSecond(null)
          setLocked(false)
        }, 700)
      }
      setMoves((m) => m + 1)
    }
  }, [first, second, deck])

  function onCardClick(index: number) {
    if (locked) return
    const c = deck[index]
    if (c.flipped || c.matched) return

    setDeck((d) => d.map((card, i) => (i === index ? { ...card, flipped: true } : card)))

    if (first === null) setFirst(index)
    else if (second === null) setSecond(index)
  }

  function reset() {
    setDeck(generateDeck())
    setFirst(null)
    setSecond(null)
    setMoves(0)
    setLocked(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="font-medium">Moves:</span> {moves}
        </div>
        <Button size="sm" variant="outline" onClick={reset}>
          Restart
        </Button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2" role="grid" aria-label="Memory match cards">
        {deck.map((card, idx) => {
          const { Icon, color } = ICONS[card.pair - 1]
          return (
            <button
              key={card.id}
              role="gridcell"
              aria-pressed={card.flipped || card.matched}
              onClick={() => onCardClick(idx)}
              className={`aspect-square rounded-md border flex items-center justify-center ${
                card.matched ? "bg-amber-50 border-amber-300" : card.flipped ? "bg-rose-50 border-rose-200" : "bg-card"
              }`}
            >
              {card.flipped || card.matched ? (
                <Icon className={`size-7 ${color}`} aria-hidden="true" />
              ) : (
                <span className="text-xs text-muted-foreground">Flip</span>
              )}
            </button>
          )
        })}
      </div>

      {done && (
        <div className="mt-3 rounded-md bg-amber-50 border border-amber-200 p-3 text-sm">
          Matched all cards in <span className="font-medium">{moves}</span> moves. 🎉
        </div>
      )}
    </div>
  )
}
