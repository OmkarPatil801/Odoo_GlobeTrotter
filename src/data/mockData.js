const unsplash = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const heroImage = unsplash('photo-1476514525535-07fb3b4ae5f1')

// Landing hero — Santorini at golden hour.
export const landingHeroImage = unsplash('photo-1570077188670-e3a8d69ac5ff', 2000)

export const trips = [
  {
    id: 'trip-1',
    name: 'European Adventure',
    startDate: '2026-09-12',
    endDate: '2026-09-20',
    destinationCount: 3,
    totalBudget: 78500,
    spentBudget: 52000,
    status: 'upcoming',
    image: unsplash('photo-1499856871958-5b9627545d1a'),
  },
  {
    id: 'trip-2',
    name: 'Goa Escape',
    startDate: '2026-10-02',
    endDate: '2026-10-05',
    destinationCount: 1,
    totalBudget: 18000,
    spentBudget: 12000,
    status: 'upcoming',
    image: unsplash('photo-1512343879784-a960bf40e7f2'),
  },
  {
    id: 'trip-3',
    name: 'Tokyo Discovery',
    startDate: '2026-06-14',
    endDate: '2026-06-21',
    destinationCount: 2,
    totalBudget: 92000,
    spentBudget: 0,
    status: 'planning',
    image: unsplash('photo-1540959733332-eab4deabeeaf'),
  },
]

export const cities = [
  {
    id: 'city-paris',
    name: 'Paris',
    country: 'France',
    description: 'Timeless boulevards, art, and candlelit bistros.',
    costIndex: 4,
    popularity: 'Trending this month',
    image: unsplash('photo-1502602898657-3e91760cbb34'),
  },
  {
    id: 'city-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    description: 'Neon streets meet centuries-old temples.',
    costIndex: 4,
    popularity: 'Highly rated',
    image: unsplash('photo-1540959733332-eab4deabeeaf'),
  },
  {
    id: 'city-bali',
    name: 'Bali',
    country: 'Indonesia',
    description: 'Rice terraces, surf breaks, and slow sunsets.',
    costIndex: 2,
    popularity: 'Budget friendly',
    image: unsplash('photo-1537996194471-e657df975ab4'),
  },
  {
    id: 'city-dubai',
    name: 'Dubai',
    country: 'UAE',
    description: 'Desert skylines and unapologetic luxury.',
    costIndex: 5,
    popularity: 'Luxury pick',
    image: unsplash('photo-1512453979798-5ea266f8880c'),
  },
  {
    id: 'city-goa',
    name: 'Goa',
    country: 'India',
    description: 'Beach shacks, spice markets, easy weekends.',
    costIndex: 2,
    popularity: 'Weekend favorite',
    image: unsplash('photo-1512343879784-a960bf40e7f2'),
  },
  {
    id: 'city-london',
    name: 'London',
    country: 'United Kingdom',
    description: 'Historic streets with a modern pulse.',
    costIndex: 5,
    popularity: 'Editor’s pick',
    image: unsplash('photo-1513635269975-59663e0ac1ad'),
  },
]

export const budgetSummary = {
  totalPlanned: 96500,
  spent: 64000,
  remaining: 32500,
}

// Marker layout for the hero globe — angles are stylized, not geographic.
export const globeDestinations = [
  { id: 'globe-paris', name: 'Paris', angle: 20, ring: 1 },
  { id: 'globe-dubai', name: 'Dubai', angle: 95, ring: 2 },
  { id: 'globe-tokyo', name: 'Tokyo', angle: 165, ring: 1 },
  { id: 'globe-new-york', name: 'New York', angle: 230, ring: 2 },
  { id: 'globe-bali', name: 'Bali', angle: 285, ring: 1 },
  { id: 'globe-london', name: 'London', angle: 335, ring: 2 },
]

export const globeRoute = ['globe-paris', 'globe-dubai', 'globe-tokyo']

// ---- Landing page (Screen 3) ----

export const regionalDestinations = [
  {
    id: 'dest-paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    descriptor: 'Art, cafés, and riverside evenings',
    costIndex: 4,
    rating: 4.8,
    image: unsplash('photo-1502602898657-3e91760cbb34'),
  },
  {
    id: 'dest-dubai',
    name: 'Dubai',
    country: 'UAE',
    region: 'Middle East',
    descriptor: 'Desert skylines and modern luxury',
    costIndex: 5,
    rating: 4.6,
    image: unsplash('photo-1512453979798-5ea266f8880c'),
  },
  {
    id: 'dest-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    descriptor: 'Neon streets beside quiet temples',
    costIndex: 4,
    rating: 4.9,
    image: unsplash('photo-1540959733332-eab4deabeeaf'),
  },
  {
    id: 'dest-bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    descriptor: 'Rice terraces and slow sunsets',
    costIndex: 2,
    rating: 4.7,
    image: unsplash('photo-1537996194471-e657df975ab4'),
  },
  {
    id: 'dest-new-york',
    name: 'New York',
    country: 'United States',
    region: 'Americas',
    descriptor: 'The city that sets the pace',
    costIndex: 5,
    rating: 4.5,
    image: unsplash('photo-1496442226666-8d4d0e62e6e9'),
  },
]

export const previousTrips = [
  {
    id: 'trip-europe',
    name: 'European Escape',
    destinations: ['Paris', 'Rome', 'Amsterdam'],
    startDate: '2026-09-12',
    endDate: '2026-09-20',
    totalBudget: 78500,
    status: 'completed',
    image: unsplash('photo-1499856871958-5b9627545d1a'),
  },
  {
    id: 'trip-japan',
    name: 'Japan Adventure',
    destinations: ['Tokyo', 'Kyoto', 'Osaka'],
    startDate: '2026-11-05',
    endDate: '2026-11-14',
    totalBudget: 92000,
    status: 'completed',
    image: unsplash('photo-1493976040374-85c8e12f0c0e'),
  },
  {
    id: 'trip-goa',
    name: 'Goa Getaway',
    destinations: ['Goa'],
    startDate: '2026-10-02',
    endDate: '2026-10-05',
    totalBudget: 18000,
    status: 'completed',
    image: unsplash('photo-1512343879784-a960bf40e7f2'),
  },
]

export const destinationGroupByOptions = [
  { value: 'none', label: 'None' },
  { value: 'region', label: 'Region' },
  { value: 'country', label: 'Country' },
]

export const destinationFilterOptions = [
  { value: 'all', label: 'All budgets' },
  { value: 'budget', label: 'Budget friendly' },
  { value: 'premium', label: 'Premium' },
]

export const destinationSortOptions = [
  { value: 'popular', label: 'Most popular' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'cost-low', label: 'Cost: low to high' },
  { value: 'cost-high', label: 'Cost: high to low' },
]

// ---- Create Trip (Screen 4) ----

export const tripDestinations = [
  {
    id: 'dest-paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    descriptor: 'Art, cafés, and riverside evenings',
    bestSeason: 'Apr — Oct',
    avgDailyCost: 9500,
    image: unsplash('photo-1502602898657-3e91760cbb34'),
  },
  {
    id: 'dest-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    descriptor: 'Neon streets beside quiet temples',
    bestSeason: 'Mar — May',
    avgDailyCost: 11000,
    image: unsplash('photo-1540959733332-eab4deabeeaf'),
  },
  {
    id: 'dest-dubai',
    name: 'Dubai',
    country: 'UAE',
    region: 'Middle East',
    descriptor: 'Desert skylines and modern luxury',
    bestSeason: 'Nov — Mar',
    avgDailyCost: 12500,
    image: unsplash('photo-1512453979798-5ea266f8880c'),
  },
  {
    id: 'dest-bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    descriptor: 'Rice terraces and slow sunsets',
    bestSeason: 'May — Sep',
    avgDailyCost: 4500,
    image: unsplash('photo-1537996194471-e657df975ab4'),
  },
  {
    id: 'dest-new-york',
    name: 'New York',
    country: 'United States',
    region: 'Americas',
    descriptor: 'The city that sets the pace',
    bestSeason: 'Sep — Nov',
    avgDailyCost: 13000,
    image: unsplash('photo-1496442226666-8d4d0e62e6e9'),
  },
  {
    id: 'dest-london',
    name: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    descriptor: 'Historic streets with a modern pulse',
    bestSeason: 'May — Sep',
    avgDailyCost: 10500,
    image: unsplash('photo-1513635269975-59663e0ac1ad'),
  },
  {
    id: 'dest-goa',
    name: 'Goa',
    country: 'India',
    region: 'Asia',
    descriptor: 'Beach shacks, spice markets, easy weekends',
    bestSeason: 'Nov — Feb',
    avgDailyCost: 3200,
    image: unsplash('photo-1512343879784-a960bf40e7f2'),
  },
]

export const suggestedActivities = [
  {
    id: 'act-eiffel',
    name: 'Eiffel Tower',
    destinationId: 'dest-paris',
    category: 'Landmark',
    description: 'Sunset views from the iron lady of Paris.',
    estimatedCost: 2400,
    image: unsplash('photo-1511739001486-6bfe10ce785f'),
  },
  {
    id: 'act-louvre',
    name: 'Louvre Museum',
    destinationId: 'dest-paris',
    category: 'Culture',
    description: 'Eight centuries of art under one glass pyramid.',
    estimatedCost: 1800,
    image: unsplash('photo-1565099824688-e93eb20fe622'),
  },
  {
    id: 'act-skytree',
    name: 'Tokyo Skytree',
    destinationId: 'dest-tokyo',
    category: 'Landmark',
    description: 'The city sprawls out from 450 metres up.',
    estimatedCost: 2100,
    image: unsplash('photo-1536098561742-ca998e48cbcc'),
  },
  {
    id: 'act-desert-safari',
    name: 'Desert Safari',
    destinationId: 'dest-dubai',
    category: 'Adventure',
    description: 'Dune bashing, camels, and a night under stars.',
    estimatedCost: 5200,
    image: unsplash('photo-1451337516015-6b6e9a44a8a3'),
  },
  {
    id: 'act-bali-beach',
    name: 'Bali Beach Day',
    destinationId: 'dest-bali',
    category: 'Relaxation',
    description: 'Slow mornings on volcanic black sand.',
    estimatedCost: 1500,
    image: unsplash('photo-1537996194471-e657df975ab4'),
  },
  {
    id: 'act-scuba',
    name: 'Scuba Diving',
    destinationId: 'dest-goa',
    category: 'Adventure',
    description: 'Reef dives in the warm Arabian Sea.',
    estimatedCost: 4800,
    image: unsplash('photo-1544551763-46a013bb70d5'),
  },
]

// ---- Itinerary Builder (Screen 5) ----

export const itinerarySectionTypes = [
  { value: 'travel', label: 'Travel' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'activity', label: 'Activity' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'other', label: 'Other' },
]

export const itinerarySections = [
  {
    id: 'sec-1',
    title: 'Paris Arrival & Hotel',
    type: 'travel',
    description: 'Flight from Mumbai to Paris and hotel check-in at Le Marais.',
    startDate: '2026-09-12',
    endDate: '2026-09-13',
    budget: 32000,
    image: unsplash('photo-1502602898657-3e91760cbb34'),
  },
  {
    id: 'sec-2',
    title: 'Eiffel Tower & City Tour',
    type: 'activity',
    description: 'Summit access at sunset, then a guided walk along the Seine.',
    startDate: '2026-09-13',
    endDate: '2026-09-14',
    budget: 8500,
    image: unsplash('photo-1511739001486-6bfe10ce785f'),
  },
  {
    id: 'sec-3',
    title: 'Louvre Museum',
    type: 'activity',
    description: 'Timed-entry tickets with an audio guide for the main wings.',
    startDate: '2026-09-15',
    endDate: '2026-09-15',
    budget: 4000,
    image: unsplash('photo-1565099824688-e93eb20fe622'),
  },
]

// ---- Itinerary View (Screen 6) ----

export const tripDetail = {
  id: 'trip-1',
  name: 'European Escape',
  summary: 'Nine days across three cities — museums, riverside walks, and long dinners.',
  startDate: '2026-09-12',
  endDate: '2026-09-20',
  status: 'upcoming',
  isPublic: true,
  travellers: 2,
  coverImage: unsplash('photo-1499856871958-5b9627545d1a', 2000),
  stops: [
    { id: 'stop-paris', city: 'Paris', country: 'France', nights: 4 },
    { id: 'stop-rome', city: 'Rome', country: 'Italy', nights: 3 },
    { id: 'stop-amsterdam', city: 'Amsterdam', country: 'Netherlands', nights: 2 },
  ],
  budget: { planned: 78500, spent: 52000 },
}

export const itineraryDays = [
  {
    id: 'day-1',
    dayNumber: 1,
    date: '2026-09-12',
    city: 'Paris',
    items: [
      {
        id: 'itm-1',
        time: '09:40',
        title: 'Flight Mumbai → Paris',
        type: 'travel',
        description: 'Air France AF-217, Terminal 2E arrival.',
        cost: 28000,
      },
      {
        id: 'itm-2',
        time: '16:00',
        title: 'Hotel check-in, Le Marais',
        type: 'hotel',
        description: 'Boutique stay a short walk from the Seine.',
        cost: 4000,
      },
    ],
  },
  {
    id: 'day-2',
    dayNumber: 2,
    date: '2026-09-13',
    city: 'Paris',
    items: [
      {
        id: 'itm-3',
        time: '10:00',
        title: 'Eiffel Tower summit',
        type: 'activity',
        description: 'Timed entry with lift access to the top deck.',
        cost: 5200,
      },
      {
        id: 'itm-4',
        time: '19:30',
        title: 'Dinner at Le Comptoir',
        type: 'restaurant',
        description: 'Classic bistro plates in Saint-Germain.',
        cost: 3300,
      },
    ],
  },
  {
    id: 'day-3',
    dayNumber: 3,
    date: '2026-09-15',
    city: 'Paris',
    items: [
      {
        id: 'itm-5',
        time: '11:00',
        title: 'Louvre Museum',
        type: 'activity',
        description: 'Audio-guided route through the Denon wing.',
        cost: 4000,
      },
    ],
  },
  {
    id: 'day-4',
    dayNumber: 4,
    date: '2026-09-16',
    city: 'Rome',
    items: [
      {
        id: 'itm-6',
        time: '08:15',
        title: 'Train Paris → Rome',
        type: 'travel',
        description: 'High-speed rail, arriving Roma Termini.',
        cost: 9500,
      },
      {
        id: 'itm-7',
        time: '18:00',
        title: 'Colosseum at golden hour',
        type: 'activity',
        description: 'Guided walk through the arena floor.',
        cost: 4200,
      },
    ],
  },
  {
    id: 'day-5',
    dayNumber: 5,
    date: '2026-09-19',
    city: 'Amsterdam',
    items: [
      {
        id: 'itm-8',
        time: '12:00',
        title: 'Canal cruise',
        type: 'activity',
        description: 'Ninety minutes through the Jordaan canals.',
        cost: 2300,
      },
    ],
  },
]
