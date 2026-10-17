"use client";

import { useState } from "react";

export default function MoviePoster({ src, title, priority = false, fill = false, contain = false }: { src: string; title: string; priority?: boolean; fill?: boolean; contain?: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`${fill ? "absolute inset-0" : "relative aspect-[2/3]"} overflow-hidden bg-[#252044]`}>
      <div aria-hidden={!failed && Boolean(src) && src !== "N/A"} className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-violet-950/60 to-slate-800 p-4 text-center text-xs text-slate-300"><span aria-hidden="true" className="text-3xl font-bold text-violet-300">CE<span className="text-teal-300"> ▷</span></span><span>{title}</span><small className="text-[10px] text-slate-400">Póster no disponible</small></div>
      {!failed && src && src !== "N/A" && (
        // OMDb supplies remote poster URLs; the fallback also handles network failures.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`Póster de ${title}`} loading={priority ? "eager" : "lazy"} onError={() => setFailed(true)} className={`absolute inset-0 size-full ${contain ? "object-contain" : "object-cover"} transition duration-500 group-hover:scale-[1.035] group-focus-within:scale-[1.035] group-focus-visible:scale-[1.035]`} />
      )}
    </div>
  );
}
