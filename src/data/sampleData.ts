export type Room = {
  id: string;
  name: string;
  capacity: number;
  pricePerNight: number;
};

export type Apartment = {
  id: string;
  name: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  pricePerNight: number; // whole apartment
  rooms: Room[];
  image?: string;
};

export type Branch = {
  id: string;
  name: string;
  city: string;
  address: string;
  apartments: Apartment[];
};

export const branches: Branch[] = [
  {
    id: "bng",
    name: "Bengaluru",
    city: "Bengaluru",
    address: "MG Road, Bengaluru, KA",
    apartments: [
      {
        id: "apt-bng-1",
        name: "Indira Habitat",
        description: "Sunlit 2BHK near business district with balcony views.",
        bedrooms: 2,
        bathrooms: 2,
        pricePerNight: 85,
        image: "/placeholder.svg",
        rooms: [
          { id: "r1", name: "Master Suite", capacity: 2, pricePerNight: 55 },
          { id: "r2", name: "Guest Room", capacity: 2, pricePerNight: 45 },
        ],
      },
      {
        id: "apt-bng-2",
        name: "Koramangala Loft",
        description: "Stylish 3BHK with workspace and fast Wi‑Fi.",
        bedrooms: 3,
        bathrooms: 2,
        pricePerNight: 120,
        image: "/placeholder.svg",
         rooms: [
           { id: "r1", name: "Queen Room", capacity: 2, pricePerNight: 60 },
           { id: "r2", name: "Twin Room", capacity: 2, pricePerNight: 50 },
         ],
      },
    ],
  },
  {
    id: "mum",
    name: "Mumbai",
    city: "Mumbai",
    address: "Bandra West, Mumbai, MH",
    apartments: [
      {
        id: "apt-mum-1",
        name: "Sea Breeze",
        description: "Coastal 2BHK with terrace and partial sea views.",
        bedrooms: 2,
        bathrooms: 2,
        pricePerNight: 140,
        image: "/placeholder.svg",
        rooms: [
          { id: "r1", name: "Ocean Room", capacity: 2, pricePerNight: 80 },
          { id: "r2", name: "Garden Room", capacity: 2, pricePerNight: 70 },
        ],
      },
    ],
  },
  {
    id: "del",
    name: "Delhi NCR",
    city: "New Delhi",
    address: "Connaught Place, New Delhi, DL",
    apartments: [
      {
        id: "apt-del-1",
        name: "Heritage Residency",
        description: "Elegant 1BHK in a quiet lane near central park.",
        bedrooms: 1,
        bathrooms: 1,
        pricePerNight: 65,
        image: "/placeholder.svg",
         rooms: [
           { id: "r1", name: "Classic Room", capacity: 2, pricePerNight: 40 },
           { id: "r2", name: "City View Room", capacity: 2, pricePerNight: 45 },
         ],
      },
    ],
  },
];
