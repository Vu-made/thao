"use client";

import { useEffect, useRef, useState } from "react";
import functionPlot from "function-plot";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Activity, SlidersHorizontal } from "lucide-react";

export default function FunctionParameterGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [a, setA] = useState(0);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const drawGraph = () => {
      const width = container.clientWidth;

      if (width <= 0) return;

      const limit = Math.sqrt(5);
      const sampleCount = 1200;
      const points: [number, number][] = [];

      for (let i = 0; i <= sampleCount; i++) {
        const x = -limit + (2 * limit * i) / sampleCount;

        const firstTerm = Math.cbrt(x) ** 2;
        const secondTerm =
          0.9 *
          Math.sqrt(Math.max(0, 5 - x * x)) *
          Math.sin(a * x * Math.PI);

        points.push([x, firstTerm + secondTerm]);
      }

      try {
        container.innerHTML = "";

        const size = Math.min(container.clientWidth, 500);

        functionPlot({
          target: container,
          width: size,
          height: size,
          grid: true,
          disableZoom: false,
          xAxis: {
            domain: [-2.6, 2.6],
            label: "x",
          },
          yAxis: {
            domain: [-2.6, 2.6],
            label: "f(x)",
          },
          data: [
            {
              points,
              fnType: "points",
              graphType: "polyline",
              color: "#e879a9",
            },
          ],
        });
      } catch (error) {
        console.error("Không thể vẽ đồ thị:", error);
      }
    };

    drawGraph();

    const observer = new ResizeObserver(drawGraph);
    observer.observe(container);

    return () => observer.disconnect();
  }, [a]);

  const formula = katex.renderToString(
    `f(x)=x^{\\frac{2}{3}}+0.9\\sqrt{5-x^2}\\sin(ax\\pi)`,
    {
      throwOnError: false,
      displayMode: true,
    },
  );

  return (
    <section className="w-full space-y-4 rounded-2xl border border-rose-200/15 bg-[#100d1b]/90 p-4 text-white shadow-xl sm:p-5">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-rose-300" />
        <h3 className="text-base font-semibold">Đồ thị tình yêu</h3>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white  flex justify-center h-120 items-center">
        <div ref={containerRef} className="min-h-[400px] w-md" />
      </div>

      <div className="space-y-3 rounded-xl border border-rose-300/15 bg-rose-300/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-rose-100">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Thay đổi tham số a</span>
          </div>

          <span className="rounded-lg bg-rose-400/15 px-3 py-1 font-mono text-sm text-rose-200">
            a = {a.toFixed(1)}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={a}
          onChange={(event) => setA(Number(event.target.value))}
          className="w-full cursor-pointer accent-rose-400"
          aria-label="Điều chỉnh tham số a"
        />

        <div className="flex justify-between text-xs text-white/50">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      <div className="space-y-3 rounded-xl bg-white/[0.04] p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-rose-200/70">
          Hàm số
        </p>

        <div
          className="overflow-x-auto text-center text-white"
          dangerouslySetInnerHTML={{ __html: formula }}
        />

        <p className="text-center text-sm text-white/60">
          Tham số hiện tại: a = {a.toFixed(1)}
        </p>
      </div>
    </section>
  );
}
