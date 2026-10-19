
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SIZE = 20;
const TARGET_SCORE = 100;
const POINTS_PER_FLOWER = 10;

const INITIAL_SNAKE = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
];

type Point = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type GameStatus = "ready" | "playing" | "paused" | "over" | "won";

const VECTORS: Record<Direction, Point> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const OPPOSITE: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

const LOVE_LETTER =
  "Thảo ưi,làm Vợ Vũ nhaaa!";

function randomFood(snake: Point[]): Point {
  const available: Point[] = [];

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (!snake.some((p) => p.x === x && p.y === y)) {
        available.push({ x, y });
      }
    }
  }

  return available[Math.floor(Math.random() * available.length)] ?? {
    x: 0,
    y: 0,
  };
}

function samePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

export function Snake() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>(() => randomFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState<GameStatus>("ready");
  const [letterOpened, setLetterOpened] = useState(false);

  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const directionRef = useRef<Direction>("RIGHT");
  const nextDirectionRef = useRef<Direction>("RIGHT");
  const scoreRef = useRef(0);
  const statusRef = useRef<GameStatus>("ready");

  const changeStatus = useCallback((next: GameStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const resetGame = useCallback(() => {
    const initial = INITIAL_SNAKE.map((p) => ({ ...p }));
    const nextFood = randomFood(initial);

    snakeRef.current = initial;
    foodRef.current = nextFood;
    directionRef.current = "RIGHT";
    nextDirectionRef.current = "RIGHT";
    scoreRef.current = 0;

    setSnake(initial);
    setFood(nextFood);
    setDirection("RIGHT");
    setScore(0);
    setLetterOpened(false);
    changeStatus("playing");
  }, [changeStatus]);

  const changeDirection = useCallback((next: Direction) => {
    if (statusRef.current !== "playing") return;

    const current = directionRef.current;
    const pending = nextDirectionRef.current;

    if (OPPOSITE[current] === next || OPPOSITE[pending] === next) {
      return;
    }

    nextDirectionRef.current = next;
    setDirection(next);
  }, []);

  const togglePause = useCallback(() => {
    if (statusRef.current === "playing") {
      changeStatus("paused");
    } else if (statusRef.current === "paused") {
      changeStatus("playing");
    } else if (
      statusRef.current === "ready" ||
      statusRef.current === "over"
    ) {
      resetGame();
    }
  }, [changeStatus, resetGame]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const keys: Record<string, Direction> = {
        ArrowUp: "UP",
        w: "UP",
        W: "UP",
        ArrowDown: "DOWN",
        s: "DOWN",
        S: "DOWN",
        ArrowLeft: "LEFT",
        a: "LEFT",
        A: "LEFT",
        ArrowRight: "RIGHT",
        d: "RIGHT",
        D: "RIGHT",
      };

      const next = keys[event.key];

      if (next) {
        event.preventDefault();

        if (statusRef.current === "ready") {
          resetGame();
          return;
        }

        changeDirection(next);
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        togglePause();
      }

      if (
        event.key === "Enter" &&
        (statusRef.current === "ready" ||
          statusRef.current === "over")
      ) {
        resetGame();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [changeDirection, resetGame, togglePause]);

  useEffect(() => {
    if (status !== "playing") return;

    const speed = Math.max(75, 145 - Math.floor(score / 40) * 8);

    const timer = window.setInterval(() => {
      const current = snakeRef.current;
      const nextDirection = nextDirectionRef.current;
      const vector = VECTORS[nextDirection];
      const head = current[0];

      const nextHead = {
        x: head.x + vector.x,
        y: head.y + vector.y,
      };

      const ate = samePoint(nextHead, foodRef.current);
      const body = ate ? current : current.slice(0, -1);

      const hitWall =
        nextHead.x < 0 ||
        nextHead.x >= SIZE ||
        nextHead.y < 0 ||
        nextHead.y >= SIZE;

      const hitSelf = body.some((p) => samePoint(p, nextHead));

      if (hitWall || hitSelf) {
        changeStatus("over");
        return;
      }

      const nextSnake = [nextHead, ...current];

      if (!ate) nextSnake.pop();

      snakeRef.current = nextSnake;
      directionRef.current = nextDirection;

      setSnake(nextSnake);
      setDirection(nextDirection);

      if (ate) {
        const nextScore = scoreRef.current + POINTS_PER_FLOWER;

        scoreRef.current = nextScore;
        setScore(nextScore);
        setBest((previous) => Math.max(previous, nextScore));

        if (nextScore >= TARGET_SCORE) {
          changeStatus("won");
          return;
        }

        const nextFood = randomFood(nextSnake);
        foodRef.current = nextFood;
        setFood(nextFood);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [status, score, changeStatus]);

  const progress = Math.min((score / TARGET_SCORE) * 100, 100);
  const playing = status === "playing";
  const gameOver = status === "over";
  const won = status === "won";
  const paused = status === "paused";
  const ready = status === "ready";

  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-pink-300/20 bg-[#100b1d] p-4 text-white shadow-[0_0_50px_rgba(236,72,153,0.12)] sm:p-6">
      <style>{`
        @keyframes snake-heart-float {
          0% { transform: translateY(12px) scale(.8) rotate(-12deg); opacity: 0; }
          20% { opacity: .8; }
          100% { transform: translateY(-90px) scale(1.2) rotate(15deg); opacity: 0; }
        }
        @keyframes snake-glow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
        @keyframes snake-reveal {
          from { opacity: 0; transform: translateY(12px) scale(.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .snake-heart-float { animation: snake-heart-float 3s ease-out infinite; }
        .snake-glow { animation: snake-glow 1.5s ease-in-out infinite; }
        .snake-reveal { animation: snake-reveal .6s ease-out both; }
      `}</style>

      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl" />

      <div className="relative mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-300">
            A little game for Thảo
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight">
            Snake <span className="text-pink-400">♡</span>
          </h2>
        </div>

        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-white/40">
            Điểm
          </p>
          <p className="text-3xl font-black tabular-nums text-pink-300">
            {score}
            <span className="text-sm text-white/40"> / 100</span>
          </p>
          <p className="text-xs text-white/45">Kỷ lục: {best}</p>
        </div>
      </div>

      <div className="relative mb-4">
        <div className="mb-2 flex items-center justify-between text-xs text-white/45">
          <span>Tiến độ mở khóa quà 💌</span>
          <span className="font-semibold text-pink-300">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-400 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-pink-300/20 bg-[#090711] p-2">
        <div
          className="relative grid aspect-square w-full overflow-hidden rounded-xl"
          style={{
            gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${SIZE}, minmax(0, 1fr))`,
            backgroundImage:
              "radial-gradient(circle at center, rgba(236,72,153,0.055), transparent 70%)",
          }}
        >
          {Array.from({ length: SIZE * SIZE }, (_, i) => {
            const x = i % SIZE;
            const y = Math.floor(i / SIZE);
            const segment = snake.findIndex((p) => p.x === x && p.y === y);
            const isHead = segment === 0;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className="flex items-center justify-center"
                style={{
                  backgroundColor:
                    (x + y) % 2 === 0
                      ? "rgba(255,255,255,0.012)"
                      : "transparent",
                }}
              >
                {segment !== -1 && (
                  <div
                    className={`h-[88%] w-[88%] rounded-[3px] ${
                      isHead
                        ? "rounded-[5px] bg-pink-300 shadow-[0_0_12px_rgba(244,114,182,0.9)]"
                        : "bg-gradient-to-br from-fuchsia-400 to-pink-600"
                    }`}
                  >
                    {isHead && (
                      <div className="flex h-full items-center justify-center gap-[2px]">
                        <span className="h-[3px] w-[3px] rounded-full bg-[#32102d]" />
                        <span className="h-[3px] w-[3px] rounded-full bg-[#32102d]" />
                      </div>
                    )}
                  </div>
                )}

                {isFood && (
                  <div className="flex h-full w-full items-center justify-center text-[clamp(8px,2.8vw,14px)] leading-none drop-shadow-[0_0_5px_rgba(251,113,133,0.9)]">
                    🌸
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!playing && (
          <div className="absolute inset-2 flex items-center justify-center overflow-y-auto rounded-xl bg-[#090711]/85 p-4 backdrop-blur-md sm:p-5">
            {won ? (
              <div className="snake-reveal relative w-full max-w-xs py-2 text-center">
                <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-around">
                  {["💗", "🌸", "💕", "🌷", "💖"].map((item, index) => (
                    <span
                      key={index}
                      className="snake-heart-float text-lg"
                      style={{ animationDelay: `${index * 0.35}s` }}
                    >
                      {item}
                    </span>
                  ))}
                </div>


                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-pink-300">
                  A little secret for you
                </p>
                <h3 className="mt-2 text-2xl font-black text-pink-200">
                  Dành riêng cho Thảo
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Thảo đã thu thập đủ hoa rồi. Có một điều Vũ muốn nói với Thảo...
                </p>

                {!letterOpened ? (
                  <button
                    onClick={() => setLetterOpened(true)}
                    className="mt-5 w-full rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 px-6 py-3 text-sm font-bold shadow-lg shadow-pink-500/25 transition hover:scale-105 active:scale-95"
                  >
                    💗 Mở bức thư bí mật
                  </button>
                ) : (
                  <div className="snake-reveal mt-4 rounded-2xl border border-pink-300/25 bg-gradient-to-b from-pink-500/10 to-fuchsia-500/5 p-4 text-left">
                    <div className="mb-3 text-center text-2xl">🌹</div>
                    <p className="text-center text-xs font-bold uppercase tracking-widest text-pink-300">
                      Vũ iuuu Thảo nhất!!
                    </p>
                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/85">
                      {LOVE_LETTER}
                    </p>
                    <p className="mt-4 text-right text-sm font-semibold text-pink-300">
                      — Từ Vũ, với tất cả sự chân thành 💗
                    </p>
                    <button
                      onClick={() => setLetterOpened(false)}
                      className="mt-4 w-full rounded-full border border-pink-300/20 py-2 text-xs text-white/60 transition hover:bg-pink-400/10"
                    >
                      Gấp thư lại
                    </button>
                  </div>
                )}

                <button
                  onClick={resetGame}
                  className="mt-4 text-xs text-white/40 underline underline-offset-4 transition hover:text-pink-300"
                >
                  Chơi lại từ đầu
                </button>
              </div>
            ) : (
              <div className="snake-reveal text-center">
                <div className="mb-3 text-4xl">
                  {gameOver ? ":3" : paused ? "🌷" : "🐍"}
                </div>
                <h3 className="text-xl font-black">
                  {gameOver
                    ? "Cố gắng đóa, nhưng mừ chưa đủ"
                    : paused
                      ? "Nghỉ một chút nha"
                      : "Một món quà đang chờ Thảo"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  {gameOver
                    ? `Thảooo đã đạt ${score} điểm. Thử lại để nhận món quà nhé! :p`
                    : paused
                      ? "Khu vườn sẽ đợi cậu quay lại."
                      : "Ăn 10 bông hoa để mở khóa bức thư bí mật của Vũ."}
                </p>
                <button
                  onClick={
                    paused
                      ? () => changeStatus("playing")
                      : resetGame
                  }
                  className="mt-5 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 px-7 py-3 text-sm font-bold shadow-lg shadow-pink-500/25 transition hover:scale-105 active:scale-95"
                >
                  {paused
                    ? "▶ Tiếp tục"
                    : gameOver
                      ? "↻ Thử lại nhé"
                      : "▶ Bắt đầu chơi"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span
            className={`h-2 w-2 rounded-full ${
              playing ? "animate-pulse bg-pink-400" : "bg-white/20"
            }`}
          />
          {playing
            ? "Đang thu thập hoa"
            : won
              ? "Đã mở khóa quà"
              : gameOver
                ? "Đã kết thúc"
                : paused
                  ? "Đang tạm dừng"
                  : "Đang chờ Thảo"}
        </div>

        <button
          onClick={togglePause}
          disabled={won}
          className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/75 transition hover:border-pink-400/50 hover:text-pink-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {playing
            ? "Ⅱ Tạm dừng"
            : paused
              ? "▶ Tiếp tục"
              : "↻ Chơi mới"}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 sm:hidden">
        <div />
        <button
          onClick={() => {
            if (statusRef.current === "ready") {
              resetGame();
              return;
            }
            changeDirection("UP");
          }}
          aria-label="Đi lên"
          className="rounded-xl border border-pink-300/20 bg-white/5 py-3 text-xl active:bg-pink-500/30"
        >
          ↑
        </button>
        <div />

        <button
          onClick={() => {
            if (statusRef.current === "ready") {
              resetGame();
              return;
            }
            changeDirection("LEFT");
          }}
          aria-label="Đi trái"
          className="rounded-xl border border-pink-300/20 bg-white/5 py-3 text-xl active:bg-pink-500/30"
        >
          ←
        </button>
        <button
          onClick={() => {
            if (statusRef.current === "ready") {
              resetGame();
              return;
            }
            changeDirection("DOWN");
          }}
          aria-label="Đi xuống"
          className="rounded-xl border border-pink-300/20 bg-white/5 py-3 text-xl active:bg-pink-500/30"
        >
          ↓
        </button>
        <button
          onClick={() => {
            if (statusRef.current === "ready") {
              resetGame();
              return;
            }
            changeDirection("RIGHT");
          }}
          aria-label="Đi phải"
          className="rounded-xl border border-pink-300/20 bg-white/5 py-3 text-xl active:bg-pink-500/30"
        >
          →
        </button>
      </div>

      <p className="relative mt-4 text-center text-[11px] text-white/35">
        Dùng ↑ ↓ ← → hoặc WASD để di chuyển
        <br />
        <span className="text-pink-300/60">
          Made with love, just for Thảo ♡
        </span>
      </p>
    </div>
  );
}
