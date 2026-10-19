
"use client";

import dynamic from "next/dynamic";

const RoseExperience = dynamic(
  () => import("@/components/rose-experience"),
  { ssr: false }
);

export default function Home() {
  return(
    <div className="h-full">
       <RoseExperience />
    </div>
  );
}
