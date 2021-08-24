interface Food {
  image: string
  price: number
  description: string
  name: string
}

interface Foods extends Food{
  id: number
  available: boolean
}