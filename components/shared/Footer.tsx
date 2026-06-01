import { Link } from '@/i18n/navigation'

const footerLinks = {
  plateforme: [
    { label: 'Acheter', href: '/annonces?transaction=vente' },
    { label: 'Louer', href: '/annonces?transaction=location' },
    { label: 'Projets neufs', href: '/projets-neufs' },
    { label: 'Agences', href: '/agences' },
    { label: 'Estimation IA', href: '/estimation' },
    { label: 'Données marché', href: '/marche' },
  ],
  compte: [
    { label: 'Connexion', href: '/connexion' },
    { label: "S'inscrire", href: '/inscription' },
    { label: 'Mon espace', href: '/dashboard' },
    { label: 'Mes favoris', href: '/dashboard/favoris' },
    { label: 'Mes alertes', href: '/dashboard/alertes' },
  ],
  proprietaires: [
    { label: 'Déposer une annonce', href: '/dashboard/annonces/nouvelle' },
    { label: 'Espace agence', href: '/dashboard/agence' },
    { label: 'Promoteurs', href: '/projets-neufs' },
    { label: 'Tarifs agences', href: '/dashboard/agence/abonnement' },
  ],
  support: [
    { label: 'Centre d\'aide', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Signaler une annonce', href: '#' },
    { label: 'Conditions d\'utilisation', href: '#' },
    { label: 'Politique de confidentialité', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#f7f7f7] border-t border-[#ebebeb] mt-20">
      <div className="max-w-[1760px] mx-auto px-6 py-12">
        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-[12px] font-semibold text-[#222222] uppercase tracking-[0.04em] mb-4">
              Plateforme
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.plateforme.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href as '/annonces'} className="text-[13px] text-[#6a6a6a] hover:text-[#222222] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-[#222222] uppercase tracking-[0.04em] mb-4">
              Mon compte
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.compte.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href as '/connexion'} className="text-[13px] text-[#6a6a6a] hover:text-[#222222] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-[#222222] uppercase tracking-[0.04em] mb-4">
              Propriétaires & Agences
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.proprietaires.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href as '/dashboard'} className="text-[13px] text-[#6a6a6a] hover:text-[#222222] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-[#222222] uppercase tracking-[0.04em] mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href as '/'} className="text-[13px] text-[#6a6a6a] hover:text-[#222222] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[#ebebeb]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#E05C1A] rounded-[7px] flex items-center justify-center">
              <span className="text-white font-bold text-[12px]">م</span>
            </div>
            <span className="text-[16px] font-bold text-[#222222] tracking-[-0.02em]">
              maskani
            </span>
          </Link>

          <p className="text-[12px] text-[#6a6a6a] text-center">
            © {new Date().getFullYear()} Maskani — La plateforme immobilière de référence au Maroc
          </p>

          <div className="flex items-center gap-4">
            <Link href="/" locale="fr" className="text-[12px] text-[#6a6a6a] hover:text-[#222222] transition-colors font-medium">
              Français
            </Link>
            <Link href="/" locale="ar" className="text-[12px] text-[#6a6a6a] hover:text-[#222222] transition-colors font-medium">
              العربية
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
