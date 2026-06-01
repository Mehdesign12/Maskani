import type { ListingCardData } from '@/components/listing/ListingCard'

export interface ListingDetailData extends ListingCardData {
  reference: string
  description: string
  address: string
  bathrooms: number
  floor?: string
  yearBuilt?: number
  orientation?: string
  gallery: string[]
  highlights: Array<{ label: string; value: string }>
  amenities: string[]
  nearby: Array<{ label: string; value: string }>
  agencyPhone: string
  agencyEmail: string
  agentName: string
  agentRole: string
  qualityScore: number
  views: number
  saved: number
}

export const FEATURED_LISTINGS: ListingDetailData[] = [
  {
    reference: 'MSK-RAC-128',
    slug: 'appartement-terrasse-racine-casablanca',
    title: 'Appartement terrasse — Racine',
    city: 'Casablanca',
    district: 'Racine',
    address: 'Rue Ahmed Charci, Racine, Casablanca',
    price: 325000000,
    area: 128,
    bedrooms: 3,
    bathrooms: 2,
    floor: '5e étage / 7',
    yearBuilt: 2021,
    orientation: 'Sud-ouest',
    type: 'appartement',
    transaction: 'vente',
    imageUrl:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&h=850&fit=crop&crop=center',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=900&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&h=900&fit=crop&crop=center',
    ],
    isPremium: true,
    isVerified: true,
    agency: 'Kensington Maroc',
    publishedAt: 'Nouveau',
    description:
      'Appartement lumineux avec terrasse filante, double salon et suite parentale dans une résidence calme de Racine. Le bien est prêt à habiter, avec une cuisine équipée, des finitions contemporaines et une place de parking titrée.',
    highlights: [
      { label: 'Prix quartier', value: '25 391 MAD/m²' },
      { label: 'Disponibilité', value: 'Visite sous 24h' },
      { label: 'Statut', value: 'Titre foncier vérifié' },
    ],
    amenities: ['Terrasse', 'Parking titré', 'Ascenseur', 'Sécurité 24/7', 'Cuisine équipée', 'Climatisation', 'Suite parentale', 'Fibre optique'],
    nearby: [
      { label: 'Twin Center', value: '7 min' },
      { label: 'École internationale', value: '5 min' },
      { label: 'Tramway', value: '9 min' },
    ],
    agencyPhone: '+212 522 00 00 00',
    agencyEmail: 'contact@kensington.ma',
    agentName: 'Sarah El Mansouri',
    agentRole: 'Conseillère senior',
    qualityScore: 96,
    views: 1842,
    saved: 127,
  },
  {
    reference: 'MSK-PAL-420',
    slug: 'villa-contemporaine-palmeraie-marrakech',
    title: 'Villa contemporaine — Palmeraie',
    city: 'Marrakech',
    district: 'Palmeraie',
    address: 'Route de Fès, Palmeraie, Marrakech',
    price: 690000000,
    area: 420,
    bedrooms: 5,
    bathrooms: 4,
    floor: 'Plain-pied + étage',
    yearBuilt: 2019,
    orientation: 'Sud',
    type: 'villa',
    transaction: 'vente',
    imageUrl:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&h=850&fit=crop&crop=center',
    gallery: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=900&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=900&h=900&fit=crop&crop=center',
    ],
    isVerified: true,
    agency: 'Atlas Living',
    description:
      'Villa contemporaine au calme, organisée autour d’un jardin paysager et d’une piscine plein sud. Volumes généreux, grandes baies vitrées, espaces de réception ouverts et dépendance personnel.',
    highlights: [
      { label: 'Terrain', value: '1 100 m²' },
      { label: 'Disponibilité', value: 'Libre à la vente' },
      { label: 'Statut', value: 'Dossier complet' },
    ],
    amenities: ['Piscine', 'Jardin', 'Parking 3 voitures', 'Cheminée', 'Sécurité', 'Dépendance', 'Terrasse', 'Cuisine équipée'],
    nearby: [
      { label: 'Golf Amelkis', value: '12 min' },
      { label: 'Centre Guéliz', value: '18 min' },
      { label: 'Aéroport', value: '25 min' },
    ],
    agencyPhone: '+212 524 00 00 00',
    agencyEmail: 'hello@atlasliving.ma',
    agentName: 'Yassine Berrada',
    agentRole: 'Spécialiste villas',
    qualityScore: 94,
    views: 2310,
    saved: 203,
  },
  {
    reference: 'MSK-MED-260',
    slug: 'riad-boutique-medina-marrakech',
    title: 'Riad boutique — Médina',
    city: 'Marrakech',
    district: 'Médina',
    address: 'Quartier Mouassine, Médina, Marrakech',
    price: 410000000,
    area: 260,
    bedrooms: 6,
    bathrooms: 5,
    floor: 'R+2',
    yearBuilt: 1950,
    orientation: 'Patio central',
    type: 'riad',
    transaction: 'vente',
    imageUrl:
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&h=850&fit=crop&crop=center',
    gallery: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=900&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=900&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=900&h=900&fit=crop&crop=center',
    ],
    isPremium: true,
    agency: 'Médina Patrimoine',
    description:
      'Riad exploitable en maison d’hôtes, rénové avec patio, bassin, terrasse panoramique et six suites. Emplacement recherché à proximité des circuits touristiques de la Médina.',
    highlights: [
      { label: 'Exploitation', value: 'Maison d’hôtes' },
      { label: 'Suites', value: '6 chambres' },
      { label: 'Statut', value: 'Autorisation vérifiée' },
    ],
    amenities: ['Patio', 'Bassin', 'Terrasse rooftop', 'Hammam', 'Suites climatisées', 'Cuisine pro', 'Salon marocain', 'Conciergerie'],
    nearby: [
      { label: 'Jemaa el-Fna', value: '8 min' },
      { label: 'Souks', value: '3 min' },
      { label: 'Parking', value: '6 min' },
    ],
    agencyPhone: '+212 524 11 11 11',
    agencyEmail: 'riad@medinapatrimoine.ma',
    agentName: 'Nadia Alaoui',
    agentRole: 'Patrimoine & riads',
    qualityScore: 92,
    views: 1594,
    saved: 188,
  },
  {
    reference: 'MSK-HR-092',
    slug: 'appartement-neuf-hay-riad-rabat',
    title: 'Appartement neuf — Hay Riad',
    city: 'Rabat',
    district: 'Hay Riad',
    address: 'Avenue Annakhil, Hay Riad, Rabat',
    price: 198000000,
    area: 92,
    bedrooms: 2,
    bathrooms: 2,
    floor: '3e étage / 5',
    yearBuilt: 2024,
    orientation: 'Est',
    type: 'appartement',
    transaction: 'vente',
    imageUrl:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&h=850&fit=crop&crop=center',
    gallery: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=900&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&h=900&fit=crop&crop=center',
    ],
    isVerified: true,
    publishedAt: '3 j',
    description:
      'Appartement neuf dans une résidence récente de Hay Riad. Plan optimisé, finitions sobres, suite parentale et place de garage. Idéal résidence principale ou investissement patrimonial.',
    highlights: [
      { label: 'Livraison', value: 'Immédiate' },
      { label: 'Garantie', value: 'Promoteur' },
      { label: 'Statut', value: 'Jamais habité' },
    ],
    amenities: ['Neuf', 'Garage', 'Ascenseur', 'Sécurité', 'Cuisine équipée', 'Balcon', 'Double vitrage', 'Fibre optique'],
    nearby: [
      { label: 'Mahaj Riad', value: '4 min' },
      { label: 'Écoles', value: '6 min' },
      { label: 'Gare Rabat Agdal', value: '12 min' },
    ],
    agencyPhone: '+212 537 00 00 00',
    agencyEmail: 'rabat@maskani.ma',
    agentName: 'Omar Tazi',
    agentRole: 'Conseiller Rabat',
    qualityScore: 95,
    views: 873,
    saved: 64,
  },
  {
    reference: 'MSK-MAL-145',
    slug: 'penthouse-vue-mer-tanger',
    title: 'Penthouse vue mer — Malabata',
    city: 'Tanger',
    district: 'Malabata',
    address: 'Corniche de Malabata, Tanger',
    price: 275000000,
    area: 145,
    bedrooms: 3,
    bathrooms: 2,
    floor: 'Dernier étage',
    yearBuilt: 2020,
    orientation: 'Nord-ouest',
    type: 'appartement',
    transaction: 'vente',
    imageUrl:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&h=850&fit=crop&crop=center',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=900&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=900&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&h=900&fit=crop&crop=center',
    ],
    isPremium: true,
    description:
      'Penthouse avec terrasse et vue mer dégagée sur Malabata. Espace de vie traversant, cuisine ouverte, suite parentale et résidence sécurisée à proximité de la corniche.',
    highlights: [
      { label: 'Vue', value: 'Mer panoramique' },
      { label: 'Terrasse', value: '42 m²' },
      { label: 'Statut', value: 'Titre vérifié' },
    ],
    amenities: ['Vue mer', 'Grande terrasse', 'Parking', 'Ascenseur', 'Sécurité', 'Cuisine équipée', 'Climatisation', 'Conciergerie'],
    nearby: [
      { label: 'Corniche', value: '2 min' },
      { label: 'Tanger City Mall', value: '5 min' },
      { label: 'Gare TGV', value: '8 min' },
    ],
    agencyPhone: '+212 539 00 00 00',
    agencyEmail: 'tanger@maskani.ma',
    agentName: 'Imane Bennani',
    agentRole: 'Conseillère Nord',
    qualityScore: 91,
    views: 1240,
    saved: 98,
  },
  {
    reference: 'MSK-CFC-048',
    slug: 'studio-meuble-cfc-casablanca',
    title: 'Studio meublé — CFC',
    city: 'Casablanca',
    district: 'Casa Finance City',
    address: 'Casa Finance City, Casablanca',
    price: 1250000,
    area: 48,
    bedrooms: 1,
    bathrooms: 1,
    floor: '8e étage / 12',
    yearBuilt: 2022,
    orientation: 'Ouest',
    type: 'studio',
    transaction: 'location',
    imageUrl:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&h=850&fit=crop&crop=center',
    gallery: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&h=900&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&h=900&fit=crop&crop=center',
    ],
    isVerified: true,
    agency: 'Urban Keys',
    description:
      'Studio meublé haut standing à Casa Finance City, proche des bureaux, commerces et transports. Bail longue durée privilégié, résidence sécurisée avec ascenseur et parking.',
    highlights: [
      { label: 'Bail', value: 'Longue durée' },
      { label: 'Charges', value: 'Incluses' },
      { label: 'Disponibilité', value: 'Immédiate' },
    ],
    amenities: ['Meublé', 'Parking', 'Ascenseur', 'Sécurité', 'Cuisine équipée', 'Internet', 'Climatisation', 'Concierge'],
    nearby: [
      { label: 'Tour CFC', value: '4 min' },
      { label: 'Anfa Park', value: '6 min' },
      { label: 'Tramway', value: '8 min' },
    ],
    agencyPhone: '+212 522 22 22 22',
    agencyEmail: 'rent@urbankeys.ma',
    agentName: 'Mehdi Idrissi',
    agentRole: 'Location premium',
    qualityScore: 93,
    views: 704,
    saved: 41,
  },
]

export function getListingBySlug(slug: string) {
  return FEATURED_LISTINGS.find((listing) => listing.slug === slug)
}
