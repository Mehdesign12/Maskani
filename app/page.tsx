export default function RootPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f7f7f7]">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-[#E05C1A]">
          <span className="text-white font-bold text-2xl">M</span>
        </div>
        <h1 className="text-[28px] font-bold text-[#222222] tracking-[-0.02em]">
          Maskani
        </h1>
        <p className="text-[14px] text-[#6a6a6a]">
          مسكاني — La plateforme immobilière de référence au Maroc
        </p>
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="inline-flex items-center px-3 py-1 rounded-[32px] bg-white border border-[#ebebeb] text-[11px] font-semibold text-[#222222] tracking-[0.04em]">
            Phase 0 — Setup
          </span>
        </div>
      </div>
    </main>
  )
}
