import CountdownTimer from "@/components/countdown-timer"
import MemoryGame from "@/components/game-memory"
import TapHeartGame from "@/components/game-tap-heart"
import LoveQuiz from "@/components/game-lovely-quiz"
import HillClimbGame from "@/components/game-hill-climb"
import StackGame from "@/components/game-stack"
import TicTacToeGame from "@/components/game-tic-tac-toe"
import { Button } from "@/components/ui/button"
import { HeartIcon } from "@/components/heart-icon"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
        <div className="mx-auto max-w-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartIcon className="size-6 text-rose-600" aria-hidden="true" />
            <span className="font-semibold text-pretty">Countdown for My Girl</span>
          </div>
          <a href="#games" className="text-sm text-rose-600 font-medium">
            Games
          </a>
        </div>
      </header>

      {/* Hero + Countdown */}
      <section className="mx-auto max-w-xl px-4 py-8 sm:py-10">
        <h1 className="text-pretty text-2xl sm:text-3xl font-bold">Counting down to your birthday, my love</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Timer ends on Sep 9 at 23:59 so we can welcome your Sept 10 birthday right on time.
        </p>

        <div className="mt-6">
          <CountdownTimer />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button className="bg-rose-600 hover:bg-rose-700">
            <a href="#games">Scroll to games</a>
          </Button>
        </div>
      </section>

      {/* Games */}
      <section id="games" className="mx-auto max-w-xl px-4 pb-16">
        <h2 className="text-xl font-semibold text-pretty">Fun little lovely games</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          While we wait, play a few sweet games.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6">
          {/* Memory Game */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <HeartIcon className="size-5 text-rose-600" aria-hidden="true" />
              Memory Match
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">Flip the cards and match the hearts.</p>
            <div className="mt-4">
              <MemoryGame />
            </div>
          </div>

          {/* Tap Heart */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <HeartIcon className="size-5 text-rose-600" aria-hidden="true" />
              Tap the Heart
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">Tap as many hearts as you can in 20 seconds.</p>
            <div className="mt-4">
              <TapHeartGame />
            </div>
          </div>

          {/* Love Quiz */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <HeartIcon className="size-5 text-rose-600" aria-hidden="true" />
              Little Love Quiz
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">Just for fun: a few questions about us.</p>
            <div className="mt-4">
              <LoveQuiz />
            </div>
          </div>

          {/* Hill Climb */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <HeartIcon className="size-5 text-rose-600" aria-hidden="true" />
              Hill Climb
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">Climb as high as you can with love power.</p>
            <div className="mt-4">
              <HillClimbGame />
            </div>
          </div>

          {/* Stack Game */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <HeartIcon className="size-5 text-rose-600" aria-hidden="true" />
              Lovely Stacks
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">Stack the blocks neatly to build love towers.</p>
            <div className="mt-4">
              <StackGame />
            </div>
          </div>

          {/* Tic Tac Toe */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <HeartIcon className="size-5 text-rose-600" aria-hidden="true" />
              Tic Tac Toe
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">Classic game with a sweet twist.</p>
            <div className="mt-4">
              <TicTacToeGame />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-xl px-4 py-8 text-center text-sm text-muted-foreground">
          With all my love — can’t wait for Sept 10.
        </div>
      </footer>
    </main>
  )
}
