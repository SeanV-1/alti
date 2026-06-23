import React from "react";

export default function MarqueeTicker() {
  const segments = [
    { text: "DELIVERED COLD TO YOUR DOOR", isCyanDotBefore: false },
    { text: "CRITICAL COGNITIVE BOOST", isCyanDotBefore: false },
    { text: "ELEVATE YOUR FREQUENCY", isCyanDotBefore: false },
    { text: "WELCOME ABOARD", isCyanDotBefore: true },
    { text: "USE CODE WELCOME10 FOR 10% OFF YOUR FIRST ORDER", isCyanDotBefore: false },
  ];

  // Repeat the sequence to guarantee infinite continuous scroll coverage
  const repeatedSegments = [...segments, ...segments, ...segments, ...segments];

  return (
    <div className="w-full bg-[#000000] border-y border-white/5 py-4 overflow-hidden relative z-40 select-none">
      <div className="inline-flex animate-marquee whitespace-nowrap">
        {/* Track 1 */}
        <div className="flex items-center gap-12 pr-12">
          {repeatedSegments.map((segment, idx) => (
            <div key={`track1-${idx}`} className="flex items-center gap-12 font-mono text-[11px] sm:text-[12px] tracking-[0.25em] text-white">
              <span className="flex items-center gap-3">
                {segment.isCyanDotBefore && (
                  <span className="text-[#a5f3fc] animate-pulse text-[10px] mr-1">●</span>
                )}
                <span>{segment.text}</span>
              </span>
              <span className="text-white/35 font-normal select-none">—</span>
            </div>
          ))}
        </div>
        {/* Track 2 (Duplicate for seamless wrapping link) */}
        <div className="flex items-center gap-12 pr-12" aria-hidden="true">
          {repeatedSegments.map((segment, idx) => (
            <div key={`track2-${idx}`} className="flex items-center gap-12 font-mono text-[11px] sm:text-[12px] tracking-[0.25em] text-white">
              <span className="flex items-center gap-3">
                {segment.isCyanDotBefore && (
                  <span className="text-[#a5f3fc] animate-pulse text-[10px] mr-1">●</span>
                )}
                <span>{segment.text}</span>
              </span>
              <span className="text-white/35 font-normal select-none">—</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

