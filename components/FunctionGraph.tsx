
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import functionPlot from "function-plot";
import {
  Activity,
  Plus,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";

type GraphFunction = {
  id: number;
  expression: string;
  color: string;
  visible: boolean;
};

type Domain = {
  min: number;
  max: number;
};

const COLORS = [
  "#e11d48",
  "#2563eb",
  "#16a34a",
  "#9333ea",
  "#ea580c",
  "#0891b2",
];

const INITIAL_FUNCTIONS: GraphFunction[] = [
];

const DEFAULT_DOMAIN: Domain = {
  min: -10,
  max: 10,
};

function normalizeExpression(expression: string) {
  return expression
    .trim()
    .replace(/^y\s*=\s*/i, "")
    .replace(/^f\s*\(\s*x\s*\)\s*=\s*/i, "");
}

function isValidExpression(expression: string) {
  if (!expression.trim()) return false;

  if (
    /[^0-9a-zA-Z_+\-*/^().,\s%]/.test(expression)
  ) {
    return false;
  }

  if (
    /(?:^|[^a-zA-Z_])(?:import|eval|function|window|globalThis|constructor|prototype|process|require|this)(?:$|[^a-zA-Z_])/i.test(
      expression,
    )
  ) {
    return false;
  }

  return true;
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-xs font-medium text-zinc-500">
        {label}
      </span>
      <input
        type="number"
        value={value}
        step={1}
        onChange={(event) => {
          const next = Number(event.target.value);

          if (Number.isFinite(next)) onChange(next);
        }}
        className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950"
      />
    </label>
  );
}

export default function FunctionGraph() {
  const graphRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(3);

  const [functions, setFunctions] =
    useState<GraphFunction[]>(INITIAL_FUNCTIONS);

  const [xDomain, setXDomain] =
    useState<Domain>(DEFAULT_DOMAIN);

  const [yDomain, setYDomain] =
    useState<Domain>(DEFAULT_DOMAIN);

  const [error, setError] = useState("");

  const updateFunction = useCallback(
    (id: number, patch: Partial<GraphFunction>) => {
      setFunctions((current) =>
        current.map((item) =>
          item.id === id ? { ...item, ...patch } : item,
        ),
      );
    },
    [],
  );

  const addFunction = useCallback(() => {
    const id = nextId.current++;

    setFunctions((current) => [
      ...current,
      {
        id,
        expression: "",
        color: COLORS[(id - 1) % COLORS.length],
        visible: true,
      },
    ]);
  }, []);

  const removeFunction = useCallback((id: number) => {
    setFunctions((current) =>
      current.filter((item) => item.id !== id),
    );
  }, []);

  const resetView = useCallback(() => {
    setXDomain(DEFAULT_DOMAIN);
    setYDomain(DEFAULT_DOMAIN);
  }, []);

  useEffect(() => {
    const container = graphRef.current;

    if (!container) return;

    const renderGraph = () => {
      const width = container.clientWidth;

      if (width <= 0) return;

      const activeFunctions = functions.filter(
        (item) => item.visible && item.expression.trim(),
      );

      const invalid = activeFunctions.find(
        (item) => !isValidExpression(item.expression),
      );

      if (
        invalid ||
        xDomain.min >= xDomain.max ||
        yDomain.min >= yDomain.max
      ) {
        setError(
          invalid
            ? `Biểu thức không hợp lệ: ${invalid.expression}`
            : "Giá trị min phải nhỏ hơn max.",
        );
        return;
      }

      try {
        container.replaceChildren();

        functionPlot({
          target: container,
          width,
          height: 430,
          grid: true,
          disableZoom: false,
          xAxis: {
            domain: [xDomain.min, xDomain.max],
          },
          yAxis: {
            domain: [yDomain.min, yDomain.max],
          },
          data: activeFunctions.map((item) => ({
            fn: normalizeExpression(item.expression),
            color: item.color,
            graphType: "polyline" as const,
            sampler: "builtIn" as const,
            nSamples: 1000,
          })),
        });

        setError("");
      } catch {
        setError(
          "Không thể vẽ hàm số. Hãy kiểm tra lại biểu thức.",
        );
      }
    };

    renderGraph();

    const observer = new ResizeObserver(() => {
      renderGraph();
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [functions, xDomain, yDomain]);

  return (
    <section className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-zinc-200 bg-white text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            <Activity size={21} />
          </div>

          <div>
            <h2 className="font-semibold tracking-tight">
              Function Graph
            </h2>
            <p className="text-xs text-zinc-500">
              Trình vẽ đồ thị hàm số của Hoàng Vũ đẹp troai
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetView}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-sm transition hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
        >
          <RotateCcw size={15} />
          Đặt lại trục
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="border-b border-zinc-200 p-4 md:border-r md:border-b-0 dark:border-zinc-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              Hàm số
            </h3>

            <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-500 dark:bg-zinc-900">
              {functions.length} hàm
            </span>
          </div>

          <div className="space-y-3">
            {functions.map((item, index) => (
              <div
                key={item.id}
                className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />

                    <span className="text-xs font-medium text-zinc-500">
                      f{index + 1}(x)
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title={
                        item.visible ? "Ẩn đồ thị" : "Hiện đồ thị"
                      }
                      onClick={() =>
                        updateFunction(item.id, {
                          visible: !item.visible,
                        })
                      }
                      className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      {item.visible ? (
                        <Eye size={15} />
                      ) : (
                        <EyeOff size={15} />
                      )}
                    </button>

                    <button
                      type="button"
                      title="Xóa hàm số"
                      onClick={() => removeFunction(item.id)}
                      className="rounded-md p-1.5 text-zinc-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="shrink-0 text-sm font-medium"
                    style={{ color: item.color }}
                  >
                    y =
                  </span>

                  <input
                    type="text"
                    spellCheck={false}
                    value={item.expression}
                    placeholder="VD: sin(x)"
                    onChange={(event) =>
                      updateFunction(item.id, {
                        expression: event.target.value,
                      })
                    }
                    className="h-9 min-w-0 flex-1 rounded-md border border-zinc-200 bg-transparent px-2 text-sm outline-none transition focus:border-zinc-400 dark:border-zinc-800"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addFunction}
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 text-sm font-medium text-zinc-600 transition hover:border-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            <Plus size={16} />
            Thêm hàm số
          </button>

          <p className="mt-5 text-xs leading-5 text-zinc-500">
            Dùng x làm biến số. Các hàm lượng giác sử dụng
            radian. Có thể phóng to hoặc thu nhỏ trực tiếp
            trên đồ thị nhoa em iuu.
          </p>
        </aside>

        <main className="min-w-0 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">
              Đồ thị
            </h3>

            <span className="text-xs text-zinc-500">
              {xDomain.min} ≤ x ≤ {xDomain.max}
            </span>
          </div>

          <div
            ref={graphRef}
            className="min-h-[300px] w-full overflow-hidden rounded-xl bg-white"
          />

          {error && (
            <p
              role="alert"
              className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300"
            >
              {error}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            {functions
              .filter((item) => item.visible && item.expression.trim())
              .map((item) => (
                <div
                  key={item.id}
                  className="flex min-w-0 items-center gap-2 text-sm"
                >
                  <span
                    className="h-0.5 w-5 shrink-0 rounded"
                    style={{ backgroundColor: item.color }}
                  />

                  <span className="max-w-48 truncate font-mono text-xs text-zinc-600 dark:text-zinc-400">
                    y = {item.expression}
                  </span>
                </div>
              ))}
          </div>
        </main>
      </div>
    </section>
  );
}
