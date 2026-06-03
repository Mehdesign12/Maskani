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
            <svg width="24" height="30" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="footer-logo-grad" x1="0" y1="0" x2="36" y2="44" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#D9BB9C"/>
                  <stop offset="1" stopColor="#B19272"/>
                </linearGradient>
              </defs>
              <path d="M2 43 L2 24 C2 12 10 1 18 1 C26 1 34 12 34 24 L34 43 Z" fill="url(#footer-logo-grad)"/>
              <path d="M7 39 L7 26 C7 17 12 9 18 9 C24 9 29 17 29 26 L29 39 Z" fill="white"/>
              <path d="M18 28 L21 33 L18 38 L15 33 Z" fill="url(#footer-logo-grad)"/>
            </svg>
            <span className="bg-gradient-to-br from-[#D9BB9C] to-[#B19272] bg-clip-text text-[16px] font-bold tracking-[-0.02em] text-transparent">
              Maskani
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
