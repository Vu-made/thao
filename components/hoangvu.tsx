"use client";

import { useState } from "react";

const DIALOGUES = [
  {
    text: 'Hí nhô, chào em iuu nhóoo!!\nHãy ấn vào nút "Xem" và đó sẽ là món quà của emm',
    pose: "huong-dan",
  },
  {
    text: "Ấn xem ròi đúm hongg, bây giờ hãy thử ấn vào một cánh hoa bất kì đi nè (có thể dùng con lăn trên chuột để thu phóng đóa)",
    pose: "nhin",
  },
  {
    text: "Hãy đọc hết và cảm nhận về món quà của Vũ nhó, khi hoàn thiện bông qua sẽ còn bất ngờ đóa (⁠✿⁠^⁠‿⁠^⁠)",
    pose: "huong-dan",
  },
];

const POSE_IMAGES = {
  "bat-mi": "/bat-mi.png",
  "huong-dan": "/huong-dan.png",
  nhin: "/nhin.png",
  hon: "/hon.png",
};

export default function Hoangvu() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < DIALOGUES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleCharacterClick = () => {
    setCurrentIndex((prev) => (prev + 1) % DIALOGUES.length);
  };

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        aria-label="Mở trợ lý"
        className="fixed bottom-5 right-5 z-[9999] flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800 px-5 py-3 font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-slate-700 active:scale-95"
      >
        ✨ Gọi Hoàng Vũ 
      </button>
    );
  }

  const currentDialogue = DIALOGUES[currentIndex];

  return (
    <div className="fixed left-4 top-4 z-[9999] flex w-72 flex-col items-end gap-3">
      <div className="relative w-full border-2 border-slate-700 bg-slate-800 p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-bold text-white">
            ✨ Hoàng Vũ
          </span>

          <button
            onClick={() => setVisible(false)}
            aria-label="Ẩn trợ lý"
            title="Ẩn trợ lý"
            className="flex h-7 w-7 items-center justify-center rounded-sm text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          >
            ✕
          </button>
        </div>

        <p className="min-h-[3rem] whitespace-pre-line text-sm font-medium text-white">
          {currentDialogue.text}
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-slate-600 pt-3">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="rounded-full bg-slate-700 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-slate-600 disabled:opacity-40"
          >
            ◀ Trước
          </button>

          <span className="text-xs font-semibold text-slate-400">
            {currentIndex + 1} / {DIALOGUES.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentIndex === DIALOGUES.length - 1}
            className="rounded-full bg-slate-700 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-slate-600 disabled:opacity-40"
          >
            Sau ▶
          </button>
        </div>
      </div>
    </div>
  );
}