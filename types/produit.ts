export type ProduitCategory =
  | 'salon'
  | 'chambre'
  | 'cuisine'
  | 'salle-de-bain'
  | 'decoration'
  | 'luminaires'
  | 'tapis-textiles'
  | 'terrasse'
  | 'accessoires'
  | 'domotique'
  | 'bureau'
  | 'enfants'

export type ProduitStyle =
  | 'moderne'
  | 'marocain'
  | 'boheme'
  | 'industriel'
  | 'scandinave'
  | 'contemporain'

export interface Produit {
  slug: string
  name: string
  category: ProduitCategory
  style: ProduitStyle
  brand: string
  city: string
  price: number
  oldPrice?: number
  images: string[]
  description: string
  dimensions?: string
  material?: string
  colors: string[]
  inStock: boolean
  isNew: boolean
  isBestSeller: boolean
  rating: number
  reviewCount: number
  deliveryTime: string
  phone: string
  whatsapp: string
  website?: string
  features: string[]
}

export type ProduitCardData = Pick<
  Produit,
  | 'slug'
  | 'name'
  | 'category'
  | 'style'
  | 'brand'
  | 'city'
  | 'price'
  | 'oldPrice'
  | 'images'
  | 'isNew'
  | 'isBestSeller'
  | 'rating'
  | 'reviewCount'
  | 'deliveryTime'
  | 'inStock'
  | 'whatsapp'
>
