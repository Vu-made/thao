"use client";

import { useState } from "react";
import { Lightbulb, RotateCcw, CheckCircle2 } from "lucide-react";
import { Snake } from "./snake";
import FunctionGraph from "./FunctionGraph";
import { FunctionParameter } from "three/examples/jsm/transpiler/AST.js";
import FunctionParameterGraph from "./FunctionParameterGraph";

export function DefaultPetalContent() {
  return (
    <p>
      Đây là nơi bạn sẽ thêm nội dung cho cánh hoa này.
    </p>
  );
}

export function Content1() {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-rose-200/70 bg-gradient-to-br from-rose-50 via-white to-pink-100 p-6 shadow-lg shadow-rose-200/30 sm:p-8">
            <div className="pointer-events-none absolute -right-5 -top-8 select-none text-8xl text-rose-200/50">
                ❀
            </div>

            <div className="relative space-y-6">
                <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-rose-100 text-2xl shadow-sm">
                    💌
                </div>

                <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-[0.25em] text-rose-400">
                    A little love letter
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-rose-700">
                    Ngày đầu tiên
                    </h2>
                </div>
                </div>

                <div className="h-px bg-gradient-to-r from-rose-300 via-pink-200 to-transparent" />

                <div className="space-y-4 text-[15px] leading-8 text-rose-950/80 sm:text-base">
                <p>
                    Vũ vẫn nhớ ngày đầu tiên gặp Thảo...
                </p>

                <p>
                    Cảm giác lúc ấy thật đặc biệt, như thể đó là lần đầu tiên Vũ biết
                    <span className="font-semibold text-rose-600"> rung động là gì.</span>
                </p>

                <p>
                    Hồi đó mẹ bắt đi làm mừ Vũ phản đối dữ lém. Ai mà ngờ được lại va phải một
                    cái duyên thật dễ thương. =P
                </p>

                <p className="font-medium italic text-rose-600">
                    Đôi khi thế giới lại muốn mình gặp nhau , Thảo nhỉii 
                </p>
                </div>

                <div className="flex items-center justify-between border-t border-rose-200/70 pt-4">
                <span className="text-sm text-rose-400">
                    Một chút kỷ niệm của Vũ ♡
                </span>
                <span className="text-xl text-rose-400">🌷</span>
            </div>
        </div>
    </div>
);
}


const answers = [
  { value: "1/6", label: "A. 1/6" },
  { value: "1/3", label: "B. 1/3" },
  { value: "1/2", label: "C. 1/2" },
  { value: "1", label: "D. 1" },
];

export function Content2() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reset = () => {
    setSelected(null);
    setShowHint(false);
    setSubmitted(false);
  };

  return (
    <div className="space-y-5 text-sm leading-7">
      <div className="space-y-1">
        <p className="text-base font-semibold text-rose-300">
          🌸 Thử thách giải tích 
        </p>
      </div>

        <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-5 text-center">
        <p className="mb-4 text-xs uppercase tracking-widest text-slate-400">
            Câu hỏi
        </p>

        <div className="flex items-center justify-center gap-3 text-white">
            <span className="inline-flex flex-col items-center leading-tight">
            <span className="text-sm">lim</span>
            <span className="text-xs text-slate-400">x → 0</span>
            </span>

            <span className="inline-flex flex-col items-center text-lg leading-snug">
            <span className="border-b border-white/60 px-3 pb-2">
                e<sup>x</sup> − 1 − x − <span className="inline-flex flex-col items-center align-middle text-sm">
                <span className="border-b border-white/60 px-1">x²</span>
                <span>2</span>
                </span>
            </span>
            <span className="pt-2">x³</span>
            </span>
        </div>
        </div>

      <div className="space-y-3">
        <p className="font-medium text-slate-200">
          Chọn đáp án đúng:
        </p>

        {answers.map((answer) => {
          const isSelected = selected === answer.value;
          const isCorrect = answer.value === "1/6";

          let style =
            "border-white/10 bg-white/[0.03] hover:border-rose-400/40";

          if (isSelected && !submitted) {
            style = "border-rose-400 bg-rose-400/10";
          }

          if (submitted && isSelected && isCorrect) {
            style = "border-emerald-400/60 bg-emerald-400/10";
          }

          if (submitted && isSelected && !isCorrect) {
            style = "border-red-400/60 bg-red-400/10";
          }

          return (
            <button
              key={answer.value}
              type="button"
              disabled={submitted}
              onClick={() => setSelected(answer.value)}
              className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${style}`}
            >
              <span className="text-slate-200">{answer.label}</span>
              {submitted && isSelected && isCorrect && (
                <CheckCircle2 size={18} className="text-emerald-400" />
              )}
              {submitted && isSelected && !isCorrect && (
                <span className="text-xs text-red-400">Sai rồi</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowHint((value) => !value)}
          className="inline-flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-amber-200 transition hover:bg-amber-400/20"
        >
          <Lightbulb size={16} />
          {showHint ? "Ẩn gợi ý" : "Gợi ý"}
        </button>

        {!submitted ? (
          <button
            type="button"
            disabled={selected === null}
            onClick={() => setSubmitted(true)}
            className="rounded-lg bg-rose-500 px-4 py-2 font-medium text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Kiểm tra đáp án
          </button>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-slate-300 transition hover:bg-white/5"
          >
            <RotateCcw size={15} />
            Làm lại
          </button>
        )}
      </div>

      {showHint && (
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
          <p className="mb-1 font-semibold text-amber-200">
            💡 Gợi ý
          </p>
          <p className="text-slate-300">
            Thay x = 0, tử và mẫu đều bằng 0. Hãy lấy đạo hàm
            tử và mẫu riêng biệt. Sau mỗi lần, kiểm tra xem giới
            hạn còn ở dạng 0/0 hay không trước khi áp dụng tiếp.
          </p>
        </div>
      )}

      {submitted && (
        <div
          className={`rounded-xl border p-4 ${
            selected === "1/6"
              ? "border-emerald-400/20 bg-emerald-400/5"
              : "border-red-400/20 bg-red-400/5"
          }`}
        >
          <p
            className={`mb-2 font-semibold ${
              selected === "1/6" ? "text-emerald-300" : "text-red-300"
            }`}
          >
            {selected === "1/6"
              ? "🎉 Chính xác! giỏi lém em iuu."
              : "💗 Nếu chưa đúng thì là đề sai, hongg phải Thảo sai :P"}
          </p>

          <p className="mb-2 text-slate-300">
            Đáp án đúng: <strong className="text-emerald-300">A. 1/6</strong>
          </p>

          <div className="space-y-3 text-slate-300">
            <p className="font-medium text-white">Lời giải:</p>

            <div className="rounded-lg bg-black/20 p-3">
              <p className="mb-1 text-rose-300">Lần 1:</p>
              <p>
                lim (eˣ − 1 − x − x²/2) / x³
              </p>
              <p>
                = lim (eˣ − 1 − x) / 3x²
              </p>
            </div>

            <div className="rounded-lg bg-black/20 p-3">
              <p className="mb-1 text-rose-300">Lần 2:</p>
              <p>
                = lim (eˣ − 1) / 6x
              </p>
            </div>

            <div className="rounded-lg bg-black/20 p-3">
              <p className="mb-1 text-rose-300">Lần 3:</p>
              <p>
                = lim eˣ / 6
              </p>
              <p className="mt-1 font-semibold text-emerald-300">
                = 1/6
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export function Content3() {
  return (
    <div className="space-y-3">
      <p className="leading-7">
        Có những điều rất khó nói thành lời, nên hãy để những cánh hoa của Vũ
        nói thay nhé.
      </p> 
      <div className="w-full flex flex-col items-center ">
        <p className="text-rose-300 text-md font-bold">
            "Một cánh hoa, một lời nhắn.
        </p>
        <p className="text-rose-300 text-md font-bold">
            Mỗi thông đệp, một lời iuuuu"
        </p>
      </div>
    </div>
  );
}


export function Content4() {
  return (
    <div className="relative space-y-5 overflow-hidden text-sm leading-7 text-slate-200">
      <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-rose-400/10 blur-3xl" />

      <div className="relative space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl text-rose-300">🌸</span>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">
            Những điều làm Thảo đặc biệt hơn những người khác
          </p>
        </div>

        <h3 className="text-xl font-semibold leading-relaxed text-white">
          Sức hút của Thảo trong mắt Vũ
        </h3>

        <p className="text-slate-300">
          Có biết điều gì khiến Thảo trở nên đặc biệt trong mắt Vũ không?
          Đó không chỉ là một điều, mà là sự kết hợp của rất nhiều nét
          đáng yêu và đáng trân trọng ở con người Thảo.
        </p>

        <div className="rounded-xl border border-rose-300/20 bg-rose-300/[0.06] p-4">
          <p className="mb-2 text-base font-medium text-rose-200">
            🌷 Vẻ đáng yêu rất riêng của Thảo
          </p>
          <p>
            Có lẽ, sức hút đầu tiên của Thảo đến từ vẻ ngoài hoạt bát,
            dễ thương cùng tính cách hòa đồng, vui vẻ. Thảo mang đến
            cảm giác gần gũi và thoải mái cho những người xung quanh.
            Chính sự tự nhiên ấy đã khiến Thảo trở nên thật đáng mến.
          </p>
        </div>
      </div>

      <div className="relative space-y-2 border-l-2 border-rose-300/40 py-1 pl-4">
        <p className="font-medium italic leading-7 text-rose-200">
          "Có những sức hút đến từ vẻ ngoài, nhưng cũng có những
          điều càng tìm hiểu, người ta lại càng muốn trân trọng."
        </p>
        <p className="text-right text-xs text-slate-500">
          — Một chút tâm sự từ Vũ dành cho em Thảo iuuuuu ♡
        </p>
      </div>
    </div>
  );
}

export function Content19() {
  return (
    <MessageCard
      icon="✧"
      category="Something special about you"
      title="Vẻ đẹp của tri thức"
      paragraphs={[
        "Vũ luôn cảm thấy một người con gái có hiểu biết, có suy nghĩ riêng và không ngừng học hỏi mang một sức hút rất đặc biệt.",
      ]}
    />
  );
}

export function Content20() {
  return (
    <MessageCard
      icon="♡"
      category="Something special about you"
      title="Biết lắng nghe và thấu hiểu"
      paragraphs={[
        "Một người biết lắng nghe, sẻ chia và cảm thông luôn khiến người khác cảm thấy được trân trọng. Với Vũ, qua nhìu lần chia sẻ câu chuyện với Thảo, Vũ cảm nhận được \"đó là một điều rất đáng quý.\"",
      ]}
    />
  );
}

export function Content21() {
  return (
    <MessageCard
      icon="❀"
      category="Something special about you"
      title="Sự chăm chỉ và kiên trì"
      paragraphs={[
        "Vũ bị thu hút bởi sự chăm chỉ, chịu khó của Thảo. Bởi đằng sau mỗi cố gắng là một tinh thần đáng trân trọng, và Vũ rất thích điều đó ở Thảo.",
      ]}
    />
  );
}

export function Content22() {
  return (
    <MessageCard
      icon="✦"
      category="Something special about you"
      title="Có mục tiêu và hết mình theo đuổi"
      paragraphs={[
        "Vũ thích cách một người xác định điều mình muốn và kiên trì tiến về phía trước. Sự quyết tâm ấy khiến cho Vũ cảm thấy Thảo trở nên đặc biệt hơn!",
      ]}
    />
  );
}


export function Content5() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-rose-200/70 bg-gradient-to-br from-rose-50 via-white to-pink-100 p-6 text-rose-950 shadow-lg shadow-rose-200/20 sm:p-8">
      <div className="pointer-events-none absolute -right-4 -top-6 select-none text-8xl text-rose-200/40">
        ♡
      </div>

      <div className="relative space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-rose-100 text-2xl shadow-sm">
            💗
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-400">
              Little moments, big smiles
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-rose-700">
              Yêu Thảo vui lém!
            </h2>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-rose-300 via-pink-200 to-transparent" />

        <div className="space-y-4 text-[15px] leading-8 text-rose-950/80 sm:text-base">
          <p>
            Hong biết từ khi nào mà Vũ có thêm một người
            để kể đủ thứ chuyện trên đời nữa.
          </p>

          <p>
            Có những chuyện chẳng có gì đặc biệt, nhưng chỉ
            cần kể cho Thảo nghe thôi là tự nhiên Vũ thấy
            vui hơn một chút. Có những lúc đang làm việc
            gì đó, Vũ cũng bất chợt nhớ đến Thảo rồi tự cười
            một mình.Có khả năng người ngoài nhìn vào sẽ nghĩ Vũ
            khùng, nhưng mà kệ họ chớ, ai bảo Vũ có người
            yêu siuu đáng iu làm chi. =P
          </p>

          <p>
            Vũ thích những lúc hai đứa nói chuyện linh tinh,
            trêu nhau, rồi đôi khi chẳng biết nói gì nhưng
            vẫn muốn ở đó cùng nhau.
          </p>

          <p>
            Hóa ra có người yêu không nhất thiết ngày nào
            cũng phải có chuyện thật lớn lao. Đôi khi chỉ
            cần một tin nhắn, một câu hỏi han hay một câu đùa
            ngốc nghếch cũng đủ làm ngày hôm ấy vui vẻ hơn.
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-rose-200/70 pt-4">
          <span className="text-sm text-rose-400">
            Iuu Thảo nhìu lémmm!!!
          </span>
          <span className="text-xl text-rose-400">♡</span>
        </div>
      </div>
    </div>
  );
}


type MessageCardProps = {
  icon: string;
  category: string;
  title: string;
  paragraphs: string[];
  ending?: string;
};

function MessageCard({
  icon,
  category,
  title,
  paragraphs,
  ending,
}: MessageCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-rose-200/70 bg-gradient-to-br from-rose-50 via-white to-pink-100 p-6 text-rose-950 shadow-lg shadow-rose-200/20 sm:p-8">
      <div className="pointer-events-none absolute -right-4 -top-6 select-none text-8xl text-rose-200/40">
        {icon}
      </div>

      <div className="relative space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-rose-100 text-2xl shadow-sm">
            {icon}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-400">
              {category}
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-rose-700">
              {title}
            </h2>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-rose-300 via-pink-200 to-transparent" />

        <div className="space-y-4 text-[15px] leading-8 text-rose-950/80 sm:text-base">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {ending && (
          <div className="rounded-xl border border-rose-200/70 bg-white/70 p-4">
            <p className="text-center font-medium italic leading-7 text-rose-600">
              {ending}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-rose-200/70 pt-4">
          <span className="text-sm text-rose-400">
            Gửi riêng Thảo ♡
          </span>
          <span className="text-xl text-rose-400">🌷</span>
        </div>
      </div>
    </div>
  );
}

export function Content6() {
  return (
    <Snake/>
  );
}

export function Content7() {
  return (
    <div className="space-y-4">
    <MessageCard
      icon="📈"
      category="Graph"
      title="Bước tiến của tình iuu"
      paragraphs={[
        "Gọi Thảo là hàm y=tan(x)",
        "Còn Vũ là y=1/cos(x)",
        "Đó thảo bt đóa là gì đóa :P" 
      ]}
      ending="Thảo hãy thử nhập hai hàm này vào máy tính đồi thị bên dứi, nếu vẫn hong hỉu Alo choa Anh iu:P"
      />
      <FunctionGraph/>
    </div>
  );
}

export function Content8() {
  return (
    <MessageCard
      icon="✍️"
      category="A little poem"
      title="Gửi em Thảo một bài thơ"
      paragraphs={[
        "Người con xứ Thanh xưa",
        "Vốn chẳng quen văn vở",
        "Ấy vậy mà thương nhớ",
        "Tương tư một nàng thơ."
      ]}
      ending="Thơ Vũ tự sáng tác, chất lượng nghệ thuật xin nhường cho tình iu chấm điểm. =)))"
    />
  );
}

export function Content9() {
  return (
    <MessageCard
      icon="😘"
      category="happy women’s day"
      title="Chúc mừng ngày phụ nữ Việt Nam"
      paragraphs={[
        "Nhân ngày 20/11 , Vũ chúc Thảo lun xinh đẹp, chăm chỉ, ngoan ngoãn, lạc quan, yêu đời",
        "Đặc biệt là iuu Vũ nhìu hơn :P"
      ]}
      ending="Người phụ nữ của Vũ là số một!!"
    />
  );
}

export function Content10() {
  return (
    <MessageCard
      icon="🤔"
      category="a Question"
      title="Thắc mắc xíu :3"
      paragraphs={[
        "Đôi khi Vũ tự hỏi",
        "Nếu ngày đó Vũ hong gửi lời mời kết bạn zalo cho Thảo",
        "Thì liệu có phép màu khác nào đưa Thảo đến với Vũ honggg nhỉ :P"
      ]}
      ending="Dù thế nào đi chăng nữa, Vũ cũng đã gặp đc Thảo ròi, Thảo ưi, Vũ iuu Thảo lémmm"
    />
  );
}

export function Content11() {
  return (
    <MessageCard
      icon="💌"
      category="A little reminder"
      title="Từ giờ Thảo hãy nhớ"
      paragraphs={[
        "Vũ lun quan tâm và ủng hộ Thảo, dù là những lúc vui vẻ hay khi Thảo cảm thấy mệt mỏi.",
        "Đừng để bản thân phải gồng gánh tất cả mọi thứ một mình nhoa. Mệt thì nghỉ, buồn thì cứ nói, hong cần lúc nào cũng phải tỏ ra mình ổn đâu."
      ]}
      ending="Vì từ giờ, Thảo có Vũ ở bên cạnh để cùng chia sẻ, cùng cố gắng và tiếp thêm sức mạnh choa Thảo nè! 💗"
    />
  );
}

export function Content12() {
  return (
    <MessageCard
      icon="💞"
      category="A tiny confession"
      title="Một điều Vũ thích"
      paragraphs={[
        "Vũ thích cảm giác có một ngừi để kể những chuyện rất bình thường trong ngày.",
        "Thích lúc hai đứa trêu nhau, nói những câu khiến đối phương cừi, rồi tự nhiên một chuyện nhỏ cũng trở thành điều đáng nhớ.",
        "Vũ cũng thích được biết thêm về suy nghĩ, sở thích và những dự định của Thảo. Càng trò chuyện, Vũ càng nhận ra mỗi người đều có rất nhiều điều thú vị để khám phá.",
      ]}
      ending="Vũ không cần lúc nào cũng có chuyện lớn lao để nói, miễn được nói chuyện cùng Thảo thì chuyện nhỏ cũng vui rồi. 💗"
    />
  );
}

export function Content13() {
  return (
    <MessageCard
      icon="🌿"
      category="Ca dao"
      title="Một câu ca dao mà Vũ thấy khá hay"
      paragraphs={[
        "Yêu nhau vạn sự chẳng nề,",
        "Dẫu trăm chỗ lệch cũng kê cho bằng.",
      ]}
      ending="Thảo nhận ra ý nghĩa của câu ca dao chứ :P"
    />
  );
}
export function Content14() {
  return (
    <MessageCard
      icon="🎯"
      category="A little challenge"
      title="Câu hỏi trắc nghiệm"
      paragraphs={[
        "Câu 1: Khi Thảo nhắn 'Vũ ơiii', Vũ nên làm gì?",
        "A. Tiếp tục giả vờ bận. B. Đọc nhưng không trả lời. C. Trả lời khi có thể và hỏi em Thảo có chuyện gì. D. Bay xuyên màn hình ngay lập tức.",
        "Câu 2: Điều gì quan trọng hơn một câu nói ngọt ngào?",
        "A. Sự quan tâm chân thành. B. Một lời hứa được thực hiện. C. Tôn trọng nhau. D. Tất cả các đáp án trên.",
      ]}
      ending="Đáp án câu 1: D. Câu 2:D. Riêng câu 4: Thảo có muốn nhận một cái ôm không? =)))"
    />
  );
}

export function Content15() {
  return (
    <MessageCard
      icon="🌱"
      category=""
      title="Thảo ơi, Vũ nói cho nè"
      paragraphs={[
          "Vũ iuu Thảo nhấttttt"
      ]}
      ending="Mỗi người một trái tim, mỗi trái tim một cảm xúc!"
    />
  );
}

export function Content16() {
  return (
    <MessageCard
      icon="🧩"
      category="A little puzzle"
      title="Đố Thảo một câu"
      paragraphs={[
        "Có một thứ càng chia sẻ thì càng có thể nhiều hơn, nhưng không phải tiền.",
        "Có một thứ đôi khi chỉ cần một câu nói cũng khiến người khác vui cả ngày.",
        "Có một thứ không thể nhìn thấy bằng mắt, nhưng có thể cảm nhận qua những hành động nhỏ.",
        "Đáp án có thể là niềm vui, sự tử tế hoặc tình cảm chân thành. Điều thú vị là những thứ ấy thường đẹp hơn khi mình biết trao đi đúng cách.",
      ]}
      ending="Thảo đoán đúng chưa? Nếu chưa thì Vũ thả hint nhé: nóa bắt đầu bằng chữ 'thương'. =P"
    />
  );
}

export function Content17() {
  return (
    <FunctionParameterGraph/>
  );
}

export function Content18() {
  return (
    <MessageCard
      icon="🌹"
      category="From Vu to Thao"
      title="Vì đó là Thảo"
      paragraphs={[
        "Có thể Vũ chưa phải người giỏi nói những lời lãng mạn nhất, cũng không phải lúc nào cũng biết cách thể hiện cảm xúc thật hoàn hảo.",
        "Nhưng Vũ trân trọng những lần hai đứa trò chuyện, những điều Thảo chia sẻ và những cơ hội để Vũ hiểu Thảo nhiều hơn.",
        "Vũ mong mình có thể thể hiện tình cảm không chỉ bằng lời nói mà còn bằng cách quan tâm, lắng nghe, tôn trọng và giữ lời hứa. Không cần phải làm điều gì quá lớn lao mỗi ngày, chỉ cần chân thành và đều đặn.",
      ]}
      ending="Vì người Vũ muốn dành những điều dễ thương này cho em chính là Thảo. Iuu em nhìu lémmm! 🌹"
    />
  );
}

export function Content23() {
  return (
    <MessageCard
      icon="☀️"
      category="A little sunshine"
      title="Thảo là niềm vui nhỏ của Vũ"
      paragraphs={[
        "Có những ngày mọi thứ diễn ra bình thường, chẳng có gì đặc biệt cả. Nhưng chỉ cần được nói chuyện với Thảo một chút thôi là Vũ đã thấy ngày hôm ấy vui hơn ròi.",
        "Đôi khi chỉ là một câu chuyện linh tinh, một lời trêu chọc hay một chiếc tin nhắn đáng yêu cũng đủ khiến Vũ cười ngốc nghếch cả buổi.",
        "Vũ nghĩ niềm vui đôi khi chẳng cần phải đến từ những điều lớn lao. Có một người khiến mình vui vẻ chỉ bằng sự hiện diện của họ đã là một điều rất đáng quý ròi."
      ]}
      ending="Và người có khả năng khiến Vũ cười như một đứa ngốc chính là em Thảo đóa! =))) ♡"
    />
  );
}

export function Content24() {
  return (
    <MessageCard
      icon="🫂"
      category="Whenever you need me"
      title="Khi nào mệt thì nhớ có Vũ nha"
      paragraphs={[
        "Vũ biết rằng sẽ có những ngày Thảo cảm thấy mệt mỏi, có những chuyện chẳng biết kể cùng ai, hoặc đôi khi chỉ đơn giản là không muốn làm gì cả.",
        "Những lúc như thế, Thảo không cần phải cố tỏ ra vui vẻ hay lúc nào cũng mạnh mẽ đâu. Nếu muốn kể chuyện thì Vũ sẽ lắng nghe, nếu muốn tìm cách giải quyết thì hai đứa cùng nghĩ, còn nếu Thảo chỉ muốn nghỉ ngơi thì cứ nghỉ ngơi nhoa.",
        "Vũ không dám hứa lúc nào cũng có thể giải quyết được mọi chuyện cho Thảo, nhưng Vũ mong mình có thể trở thành một người mà Thảo cảm thấy thoải mái khi chia sẻ."
      ]}
      ending="Thảo không cần lúc nào cũng phải ổn đâu. Cứ là Thảo thôi, còn những chuyện khác mình từ từ cùng nhau cố gắng nhé. 💗"
    />
  );
}

export function Content25() {
  return (
    <MessageCard
      icon="📅"
      category="Our little future"
      title="Vũ muốn cùng Thảo tạo thêm kỷ niệm"
      paragraphs={[
        "Vũ tò mò không biết sau này hai đứa sẽ có thêm bao nhiêu câu chuyện để kể cho nhau nghe nữa nhỉ.",
        "Có thể là những lần cùng nhau đi chơi, những buổi hẹn hò giản dị, những lần trêu nhau đến mức chẳng ai chịu nhường ai, hay cả những lúc cùng nhau vượt qua một chuyện khó khăn nào đó.",
        "Vũ không mong ngày nào cũng phải thật đặc biệt. Vũ chỉ mong sau này khi nhìn lại, hai đứa sẽ có thật nhiều kỷ niệm để mỉm cười và nghĩ rằng: May mà ngày ấy chúng mình đã gặp nhau."
      ]}
      ending="Tương lai còn dài lém, nên Thảo nhớ ở lại tạo kỷ niệm với Vũ nhaaa! =P ♡"
    />
  );
}

export function Content26() {
  return (
    <MessageCard
      icon="🤝"
      category="Love means understanding"
      title="Hai đứa mình cùng học cách yêu"
      paragraphs={[
        "Vũ nghĩ rằng yêu nhau không có nghĩa là lúc nào hai đứa cũng phải hiểu nhau ngay lập tức, hay lúc nào cũng có chung một suy nghĩ.",
        "Sẽ có lúc Vũ vô tình nói điều chưa khéo, có lúc Thảo buồn mà Vũ chưa kịp nhận ra, hoặc đơn giản là hai đứa nhìn một chuyện theo hai cách khác nhau.",
        "Nhưng Vũ mong rằng khi có chuyện gì, chúng mình có thể bình tĩnh nói với nhau, chịu khó lắng nghe và cố gắng hiểu cảm xúc của đối phương. Thay vì để một chuyện nhỏ khiến cả hai xa nhau, mình cùng tìm cách giải quyết nhé."
      ]}
      ending="Vũ không mong chúng mình hoàn hảo, Vũ chỉ mong cả hai luôn chân thành và cùng nhau tốt hơn mỗi ngày. 💞"
    />
  );
}

export function Content27() {
  return (
    <MessageCard
      icon="🧸"
      category="A tiny confession"
      title="Có một người Vũ muốn dỗ dành"
      paragraphs={[
        "Vũ phát hiện ra mình có thêm một nhiệm vụ khá quan trọng kể từ khi quen Thảo: cố gắng làm cho em Thảo vui hơn mỗi khi em buồn. =)))",
        "Tất nhiên, đôi lúc Vũ cũng hơi ngốc, nói chuyện chưa đủ khéo, dỗ dành chưa đúng cách, thậm chí còn có khả năng làm Thảo cười vì độ ngu ngơ của mình thay vì vì câu nói ngọt ngào.",
        "Nhưng mỗi lần như thế, Vũ vẫn muốn tìm cách hiểu Thảo hơn một chút, để biết khi nào nên trêu em, khi nào nên nghiêm túc lắng nghe, và khi nào chỉ cần ở bên cạnh em thôi."
      ]}
      ending="Nếu một ngày Thảo buồn mà chưa biết làm gì, thử gọi Vũ xem sao. Biết đâu có một Vũ ngốc đang chờ được dỗ em đóa! =))) 💗"
    />
  );
}

export function Content28() {
  return (
    <MessageCard
      icon="💌"
      category="Things I want you to know"
      title="Vũ trân trọng Thảo nhiều lắm"
      paragraphs={[
        "Vũ muốn Thảo biết rằng tình cảm Vũ dành cho Thảo không chỉ nằm trong những câu nói iuuuu, những chiếc tin nhắn dễ thương hay mấy trò nghịch ngợm mà Vũ nghĩ ra.",
        "Vũ còn trân trọng những điều bình thường hơn nhiều: những lúc Thảo dành thời gian trò chuyện, những điều em kể, những suy nghĩ em chia sẻ và cả những khoảnh khắc hai đứa được là chính mình khi ở bên nhau.",
        "Vũ cũng biết Thảo có những mục tiêu, những dự định và cuộc sống riêng của mình. Vũ mong có thể vừa yêu thương Thảo, vừa tôn trọng những điều em muốn theo đuổi, để cả hai cùng phát triển chứ không phải vì nhau mà bỏ quên bản thân."
      ]}
      ending="Cảm ơn Thảo vì đã xuất hiện trong câu chuyện của Vũ. Sự xuất hiện ấy thật sự rất đáng quý. 🌷"
    />
  );
}

export function Content29() {
  return (
    <MessageCard
      icon="🌹"
      category="One last message"
      title="Nếu được chọn lại..."
      paragraphs={[
        "Nếu được quay lại ngày đầu tiên, ngày mà Vũ còn chưa biết sau này mình sẽ gặp một người đặc biệt như Thảo, có lẽ Vũ vẫn sẽ tò mò, vẫn muốn biết cô gái ấy là người như thế nào.",
        "Vũ không biết trước được chuyện gì sẽ xảy ra, cũng chẳng thể đoán được hai đứa sẽ có bao nhiêu kỷ niệm, bao nhiêu lần cười vui hay những lúc cần học cách thấu hiểu nhau hơn.",
        "Nhưng nếu được chọn lại, Vũ vẫn muốn cho bản thân cơ hội bước đến, làm quen và tìm hiểu Thảo. Bởi nếu ngày ấy Vũ không thử, có lẽ bây giờ đã chẳng có một người khiến Vũ muốn dành thời gian để viết ra từng thông điệp như thế này.",
        "Và nếu hỏi Vũ điều gì đáng nhớ nhất trong cả hành trình ấy, có lẽ câu trả lời đơn giản lắm: đó là việc Vũ đã có cơ hội gặp Thảo."
      ]}
      ending="29 cánh hoa, 29 thông điệp, nhưng có một điều Vũ muốn nói mãi: Vũ iuu Thảo nhìu lémmm! Mong rằng chúng mình sẽ còn viết tiếp thật nhiều câu chuyện đẹp cùng nhau. 🌹♡"
    />
  );
}