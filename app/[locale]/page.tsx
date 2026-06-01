import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'common' })
  return { title: t('appName') }
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations('common')

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f7f7f7]">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-[#E05C1A]">
          <span className="text-white font-bold text-2xl font-[family-name:var(--font-inter)]">
            M
          </span>
        </div>
        <h1 className="text-[28px] font-bold text-[#222222] tracking-[-0.02em] font-[family-name:var(--font-inter)]">
          {t('appName')}
        </h1>
        <p className="text-[14px] text-[#6a6a6a]">
          مسكاني — La plateforme immobilière de référence au Maroc
        </p>
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="inline-flex items-center px-3 py-1 rounded-[32px] bg-white border border-[#ebebeb] text-[11px] font-semibold text-[#222222] tracking-[0.04em]">
            Phase 0 — Setup ✓
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-[32px] bg-[#E05C1A] text-[11px] font-semibold text-white tracking-[0.04em]">
            next-intl ✓
          </span>
        </div>
      </div>
    </main>
  )
}
