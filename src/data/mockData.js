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

// Hero globe markers — real lat/lon so they sit on the rotating Earth.
// `angle`/`ring` are kept for the flat marker layout fallback.
export const globeDestinations = [
  { id: 'globe-paris', name: 'Paris', country: 'France', lat: 48.86, lon: 2.35, angle: 20, ring: 1 },
  { id: 'globe-dubai', name: 'Dubai', country: 'UAE', lat: 25.2, lon: 55.27, angle: 95, ring: 2 },
  { id: 'globe-tokyo', name: 'Tokyo', country: 'Japan', lat: 35.68, lon: 139.69, angle: 165, ring: 1 },
  { id: 'globe-new-york', name: 'New York', country: 'USA', lat: 40.71, lon: -74.01, angle: 230, ring: 2 },
  { id: 'globe-bali', name: 'Bali', country: 'Indonesia', lat: -8.41, lon: 115.19, angle: 285, ring: 1 },
  { id: 'globe-london', name: 'London', country: 'United Kingdom', lat: 51.51, lon: -0.13, angle: 335, ring: 2 },
  { id: 'globe-cape-town', name: 'Cape Town', country: 'South Africa', lat: -33.92, lon: 18.42, angle: 60, ring: 2 },
  { id: 'globe-sydney', name: 'Sydney', country: 'Australia', lat: -33.87, lon: 151.21, angle: 200, ring: 2 },
  { id: 'globe-rio', name: 'Rio de Janeiro', country: 'Brazil', lat: -22.91, lon: -43.17, angle: 260, ring: 1 },
  { id: 'globe-goa', name: 'Goa', country: 'India', lat: 15.3, lon: 74.12, angle: 130, ring: 2 },
]

export const globeRoute = ['globe-paris', 'globe-dubai', 'globe-tokyo']

// Flight paths drawn as glowing arcs between markers.
export const globeRoutes = [
  ['globe-new-york', 'globe-london'],
  ['globe-london', 'globe-dubai'],
  ['globe-dubai', 'globe-goa'],
  ['globe-goa', 'globe-bali'],
  ['globe-bali', 'globe-sydney'],
  ['globe-paris', 'globe-tokyo'],
  ['globe-rio', 'globe-cape-town'],
]

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

// ---- My Trips (Screen 7) ----

export const myTrips = [
  {
    id: 'trip-1',
    name: 'European Escape',
    destinations: ['Paris', 'Rome', 'Amsterdam'],
    destinationCount: 3,
    startDate: '2026-09-12',
    endDate: '2026-09-20',
    totalBudget: 78500,
    spentBudget: 52000,
    status: 'upcoming',
    isPublic: true,
    image: unsplash('photo-1499856871958-5b9627545d1a'),
  },
  {
    id: 'trip-2',
    name: 'Goa Escape',
    destinations: ['Goa'],
    destinationCount: 1,
    startDate: '2026-10-02',
    endDate: '2026-10-05',
    totalBudget: 18000,
    spentBudget: 12000,
    status: 'upcoming',
    isPublic: false,
    image: unsplash('photo-1512343879784-a960bf40e7f2'),
  },
  {
    id: 'trip-3',
    name: 'Tokyo Discovery',
    destinations: ['Tokyo', 'Kyoto'],
    destinationCount: 2,
    startDate: '2026-11-14',
    endDate: '2026-11-21',
    totalBudget: 92000,
    spentBudget: 0,
    status: 'planning',
    isPublic: false,
    image: unsplash('photo-1540959733332-eab4deabeeaf'),
  },
  {
    id: 'trip-4',
    name: 'Dubai Long Weekend',
    destinations: ['Dubai'],
    destinationCount: 1,
    startDate: '2027-01-15',
    endDate: '2027-01-18',
    totalBudget: 46000,
    spentBudget: 0,
    status: 'planning',
    isPublic: false,
    image: unsplash('photo-1512453979798-5ea266f8880c'),
  },
  {
    id: 'trip-5',
    name: 'Bali Retreat',
    destinations: ['Bali', 'Ubud'],
    destinationCount: 2,
    startDate: '2025-06-08',
    endDate: '2025-06-16',
    totalBudget: 54000,
    spentBudget: 54000,
    status: 'completed',
    isPublic: true,
    image: unsplash('photo-1537996194471-e657df975ab4'),
  },
  {
    id: 'trip-6',
    name: 'New York City Break',
    destinations: ['New York'],
    destinationCount: 1,
    startDate: '2025-03-20',
    endDate: '2025-03-26',
    totalBudget: 88000,
    spentBudget: 91200,
    status: 'completed',
    isPublic: false,
    image: unsplash('photo-1496442226666-8d4d0e62e6e9'),
  },
]

export const tripStatusTabs = [
  { value: 'all', label: 'All trips' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'planning', label: 'Planning' },
  { value: 'completed', label: 'Completed' },
]

export const tripSortOptions = [
  { value: 'date-desc', label: 'Date: newest first' },
  { value: 'date-asc', label: 'Date: oldest first' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'budget-high', label: 'Budget: high to low' },
  { value: 'budget-low', label: 'Budget: low to high' },
]

export const tripGroupByOptions = [
  { value: 'none', label: 'None' },
  { value: 'status', label: 'Status' },
  { value: 'year', label: 'Year' },
]

// ---- City Search (Screen 8) ----

export const searchableCities = [
  { id: 'city-paris', name: 'Paris', country: 'France', region: 'Europe', currency: 'EUR', costIndex: 4, rating: 4.8, popularity: 'Trending', activityCount: 128, description: 'Art, cafés, and riverside evenings.', image: unsplash('photo-1502602898657-3e91760cbb34') },
  { id: 'city-rome', name: 'Rome', country: 'Italy', region: 'Europe', currency: 'EUR', costIndex: 3, rating: 4.7, popularity: 'Popular', activityCount: 96, description: 'Ancient ruins and long, unhurried dinners.', image: unsplash('photo-1552832230-c0197dd311b5') },
  { id: 'city-amsterdam', name: 'Amsterdam', country: 'Netherlands', region: 'Europe', currency: 'EUR', costIndex: 4, rating: 4.6, popularity: 'Popular', activityCount: 74, description: 'Canal rings, bikes, and world-class museums.', image: unsplash('photo-1534351590666-13e3e96b5017') },
  { id: 'city-london', name: 'London', country: 'United Kingdom', region: 'Europe', currency: 'GBP', costIndex: 5, rating: 4.6, popularity: 'Editor’s pick', activityCount: 142, description: 'Historic streets with a modern pulse.', image: unsplash('photo-1513635269975-59663e0ac1ad') },
  { id: 'city-tokyo', name: 'Tokyo', country: 'Japan', region: 'Asia', currency: 'JPY', costIndex: 4, rating: 4.9, popularity: 'Trending', activityCount: 156, description: 'Neon streets beside quiet temples.', image: unsplash('photo-1540959733332-eab4deabeeaf') },
  { id: 'city-kyoto', name: 'Kyoto', country: 'Japan', region: 'Asia', currency: 'JPY', costIndex: 3, rating: 4.8, popularity: 'Popular', activityCount: 88, description: 'Shrines, bamboo groves, and tea houses.', image: unsplash('photo-1493976040374-85c8e12f0c0e') },
  { id: 'city-bali', name: 'Bali', country: 'Indonesia', region: 'Asia', currency: 'IDR', costIndex: 2, rating: 4.7, popularity: 'Budget friendly', activityCount: 112, description: 'Rice terraces, surf breaks, slow sunsets.', image: unsplash('photo-1537996194471-e657df975ab4') },
  { id: 'city-goa', name: 'Goa', country: 'India', region: 'Asia', currency: 'INR', costIndex: 1, rating: 4.4, popularity: 'Budget friendly', activityCount: 64, description: 'Beach shacks, spice markets, easy weekends.', image: unsplash('photo-1512343879784-a960bf40e7f2') },
  { id: 'city-dubai', name: 'Dubai', country: 'UAE', region: 'Middle East', currency: 'AED', costIndex: 5, rating: 4.6, popularity: 'Luxury pick', activityCount: 103, description: 'Desert skylines and unapologetic luxury.', image: unsplash('photo-1512453979798-5ea266f8880c') },
  { id: 'city-istanbul', name: 'Istanbul', country: 'Türkiye', region: 'Middle East', currency: 'TRY', costIndex: 2, rating: 4.5, popularity: 'Rising fast', activityCount: 91, description: 'Where two continents trade spices and stories.', image: unsplash('photo-1524231757912-21f4fe3a7200') },
  { id: 'city-new-york', name: 'New York', country: 'United States', region: 'Americas', currency: 'USD', costIndex: 5, rating: 4.5, popularity: 'Popular', activityCount: 178, description: 'The city that sets the pace.', image: unsplash('photo-1496442226666-8d4d0e62e6e9') },
  { id: 'city-rio', name: 'Rio de Janeiro', country: 'Brazil', region: 'Americas', currency: 'BRL', costIndex: 3, rating: 4.5, popularity: 'Rising fast', activityCount: 69, description: 'Mountains meeting beaches, all rhythm.', image: unsplash('photo-1483729558449-99ef09a8c325') },
]

export const cityRegionOptions = [
  { value: 'all', label: 'All regions' },
  { value: 'Europe', label: 'Europe' },
  { value: 'Asia', label: 'Asia' },
  { value: 'Middle East', label: 'Middle East' },
  { value: 'Americas', label: 'Americas' },
]

export const cityCostOptions = [
  { value: 'all', label: 'Any budget' },
  { value: 'low', label: '₹ Budget' },
  { value: 'mid', label: '₹₹ Moderate' },
  { value: 'high', label: '₹₹₹ Premium' },
]

export const citySortOptions = [
  { value: 'popular', label: 'Most popular' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'activities', label: 'Most activities' },
  { value: 'cost-low', label: 'Cost: low to high' },
  { value: 'cost-high', label: 'Cost: high to low' },
]

// ---- Activity Search (Screen 9) ----

export const searchableActivities = [
  { id: 'act-eiffel', name: 'Eiffel Tower Summit', cityId: 'city-paris', city: 'Paris', country: 'France', category: 'Landmark', duration: 3, rating: 4.8, cost: 2400, description: 'Lift access to the top deck at golden hour.', image: unsplash('photo-1511739001486-6bfe10ce785f') },
  { id: 'act-louvre', name: 'Louvre Museum Tour', cityId: 'city-paris', city: 'Paris', country: 'France', category: 'Culture', duration: 4, rating: 4.7, cost: 1800, description: 'Guided route through the Denon wing.', image: unsplash('photo-1565099824688-e93eb20fe622') },
  { id: 'act-seine', name: 'Seine River Cruise', cityId: 'city-paris', city: 'Paris', country: 'France', category: 'Sightseeing', duration: 2, rating: 4.5, cost: 1600, description: 'Evening sail past the illuminated bridges.', image: unsplash('photo-1502602898657-3e91760cbb34') },
  { id: 'act-colosseum', name: 'Colosseum Arena Floor', cityId: 'city-rome', city: 'Rome', country: 'Italy', category: 'Landmark', duration: 3, rating: 4.8, cost: 4200, description: 'Walk the arena where gladiators fought.', image: unsplash('photo-1552832230-c0197dd311b5') },
  { id: 'act-skytree', name: 'Tokyo Skytree', cityId: 'city-tokyo', city: 'Tokyo', country: 'Japan', category: 'Landmark', duration: 2, rating: 4.6, cost: 2100, description: 'The city sprawls out from 450 metres up.', image: unsplash('photo-1536098561742-ca998e48cbcc') },
  { id: 'act-tsukiji', name: 'Tsukiji Food Walk', cityId: 'city-tokyo', city: 'Tokyo', country: 'Japan', category: 'Food', duration: 3, rating: 4.9, cost: 3400, description: 'Sashimi, tamago, and street-side stalls.', image: unsplash('photo-1540959733332-eab4deabeeaf') },
  { id: 'act-bamboo', name: 'Arashiyama Bamboo Grove', cityId: 'city-kyoto', city: 'Kyoto', country: 'Japan', category: 'Nature', duration: 2, rating: 4.7, cost: 900, description: 'Early-morning walk before the crowds.', image: unsplash('photo-1493976040374-85c8e12f0c0e') },
  { id: 'act-desert-safari', name: 'Desert Safari', cityId: 'city-dubai', city: 'Dubai', country: 'UAE', category: 'Adventure', duration: 6, rating: 4.6, cost: 5200, description: 'Dune bashing, camels, and dinner under stars.', image: unsplash('photo-1451337516015-6b6e9a44a8a3') },
  { id: 'act-burj', name: 'Burj Khalifa Observation', cityId: 'city-dubai', city: 'Dubai', country: 'UAE', category: 'Landmark', duration: 2, rating: 4.7, cost: 4600, description: 'Levels 124 and 125 at sunset.', image: unsplash('photo-1512453979798-5ea266f8880c') },
  { id: 'act-ubud', name: 'Ubud Rice Terraces', cityId: 'city-bali', city: 'Bali', country: 'Indonesia', category: 'Nature', duration: 4, rating: 4.6, cost: 1200, description: 'Terraced fields and a jungle swing stop.', image: unsplash('photo-1537996194471-e657df975ab4') },
  { id: 'act-scuba', name: 'Scuba Diving', cityId: 'city-goa', city: 'Goa', country: 'India', category: 'Adventure', duration: 5, rating: 4.4, cost: 4800, description: 'Reef dives in the warm Arabian Sea.', image: unsplash('photo-1544551763-46a013bb70d5') },
  { id: 'act-canal', name: 'Canal Ring Cruise', cityId: 'city-amsterdam', city: 'Amsterdam', country: 'Netherlands', category: 'Sightseeing', duration: 2, rating: 4.5, cost: 2300, description: 'Ninety minutes through the Jordaan canals.', image: unsplash('photo-1534351590666-13e3e96b5017') },
]

export const activityCategoryOptions = [
  { value: 'all', label: 'All categories' },
  { value: 'Landmark', label: 'Landmark' },
  { value: 'Culture', label: 'Culture' },
  { value: 'Adventure', label: 'Adventure' },
  { value: 'Nature', label: 'Nature' },
  { value: 'Food', label: 'Food' },
  { value: 'Sightseeing', label: 'Sightseeing' },
]

export const activityDurationOptions = [
  { value: 'all', label: 'Any duration' },
  { value: 'short', label: 'Under 3 hours' },
  { value: 'half', label: '3 – 5 hours' },
  { value: 'full', label: 'Full day (5h+)' },
]

export const activitySortOptions = [
  { value: 'popular', label: 'Most popular' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'cost-low', label: 'Cost: low to high' },
  { value: 'cost-high', label: 'Cost: high to low' },
  { value: 'duration', label: 'Shortest first' },
]

// ---- Budget Breakdown (Screen 10) ----

export const budgetCategories = [
  { id: 'cat-travel', name: 'Travel', planned: 32000, spent: 28000, color: '#0ea5e9' },
  { id: 'cat-stay', name: 'Stay', planned: 22000, spent: 16000, color: '#19a7a8' },
  { id: 'cat-activities', name: 'Activities', planned: 14500, spent: 5200, color: '#ff7a59' },
  { id: 'cat-food', name: 'Food', planned: 7000, spent: 2800, color: '#f59e0b' },
  { id: 'cat-transport', name: 'Local transport', planned: 3000, spent: 0, color: '#8b5cf6' },
]

export const budgetExpenses = [
  { id: 'exp-1', title: 'Flight Mumbai → Paris', categoryId: 'cat-travel', date: '2026-09-12', amount: 28000, city: 'Paris', paid: true },
  { id: 'exp-2', title: 'Hotel Le Marais (4 nights)', categoryId: 'cat-stay', date: '2026-09-12', amount: 16000, city: 'Paris', paid: true },
  { id: 'exp-3', title: 'Eiffel Tower summit', categoryId: 'cat-activities', date: '2026-09-13', amount: 5200, city: 'Paris', paid: true },
  { id: 'exp-4', title: 'Dinner at Le Comptoir', categoryId: 'cat-food', date: '2026-09-13', amount: 2800, city: 'Paris', paid: true },
  { id: 'exp-5', title: 'Louvre Museum tickets', categoryId: 'cat-activities', date: '2026-09-15', amount: 4000, city: 'Paris', paid: false },
  { id: 'exp-6', title: 'Train Paris → Rome', categoryId: 'cat-travel', date: '2026-09-16', amount: 9500, city: 'Rome', paid: false },
  { id: 'exp-7', title: 'Colosseum guided tour', categoryId: 'cat-activities', date: '2026-09-16', amount: 4200, city: 'Rome', paid: false },
  { id: 'exp-8', title: 'Hotel Trastevere (3 nights)', categoryId: 'cat-stay', date: '2026-09-16', amount: 6000, city: 'Rome', paid: false },
  { id: 'exp-9', title: 'Metro passes', categoryId: 'cat-transport', date: '2026-09-17', amount: 1400, city: 'Rome', paid: false },
  { id: 'exp-10', title: 'Canal cruise', categoryId: 'cat-activities', date: '2026-09-19', amount: 2300, city: 'Amsterdam', paid: false },
]

export const budgetDailySpend = [
  { date: '2026-09-12', label: '12 Sep', amount: 44000 },
  { date: '2026-09-13', label: '13 Sep', amount: 8000 },
  { date: '2026-09-14', label: '14 Sep', amount: 0 },
  { date: '2026-09-15', label: '15 Sep', amount: 4000 },
  { date: '2026-09-16', label: '16 Sep', amount: 19700 },
  { date: '2026-09-17', label: '17 Sep', amount: 1400 },
  { date: '2026-09-19', label: '19 Sep', amount: 2300 },
]

export const budgetExpenseFilters = [
  { value: 'all', label: 'All categories' },
  { value: 'cat-travel', label: 'Travel' },
  { value: 'cat-stay', label: 'Stay' },
  { value: 'cat-activities', label: 'Activities' },
  { value: 'cat-food', label: 'Food' },
  { value: 'cat-transport', label: 'Local transport' },
]

export const budgetStatusFilters = [
  { value: 'all', label: 'All' },
  { value: 'paid', label: 'Paid' },
  { value: 'due', label: 'Due' },
]

// ---- Trip Calendar (Screen 11) ----

export const calendarEvents = [
  { id: 'ev-1', title: 'Flight Mumbai → Paris', date: '2026-09-12', time: '09:40', type: 'travel', city: 'Paris', cost: 28000 },
  { id: 'ev-2', title: 'Hotel check-in, Le Marais', date: '2026-09-12', time: '16:00', type: 'hotel', city: 'Paris', cost: 16000 },
  { id: 'ev-3', title: 'Eiffel Tower summit', date: '2026-09-13', time: '10:00', type: 'activity', city: 'Paris', cost: 5200 },
  { id: 'ev-4', title: 'Dinner at Le Comptoir', date: '2026-09-13', time: '19:30', type: 'restaurant', city: 'Paris', cost: 2800 },
  { id: 'ev-5', title: 'Seine river cruise', date: '2026-09-14', time: '18:00', type: 'activity', city: 'Paris', cost: 1600 },
  { id: 'ev-6', title: 'Louvre Museum', date: '2026-09-15', time: '11:00', type: 'activity', city: 'Paris', cost: 4000 },
  { id: 'ev-7', title: 'Train Paris → Rome', date: '2026-09-16', time: '08:15', type: 'travel', city: 'Rome', cost: 9500 },
  { id: 'ev-8', title: 'Colosseum arena floor', date: '2026-09-16', time: '18:00', type: 'activity', city: 'Rome', cost: 4200 },
  { id: 'ev-9', title: 'Vatican Museums', date: '2026-09-17', time: '09:30', type: 'activity', city: 'Rome', cost: 3600 },
  { id: 'ev-10', title: 'Trastevere food walk', date: '2026-09-17', time: '20:00', type: 'restaurant', city: 'Rome', cost: 2400 },
  { id: 'ev-11', title: 'Flight Rome → Amsterdam', date: '2026-09-18', time: '13:20', type: 'travel', city: 'Amsterdam', cost: 7800 },
  { id: 'ev-12', title: 'Canal ring cruise', date: '2026-09-19', time: '12:00', type: 'activity', city: 'Amsterdam', cost: 2300 },
  { id: 'ev-13', title: 'Rijksmuseum', date: '2026-09-19', time: '15:30', type: 'activity', city: 'Amsterdam', cost: 2100 },
  { id: 'ev-14', title: 'Flight Amsterdam → Mumbai', date: '2026-09-20', time: '11:05', type: 'travel', city: 'Amsterdam', cost: 26000 },
]

export const calendarEventTypes = [
  { value: 'all', label: 'All types' },
  { value: 'travel', label: 'Travel' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'activity', label: 'Activity' },
  { value: 'restaurant', label: 'Restaurant' },
]

// ---- Community (Screen 12) ----

export const communityItineraries = [
  { id: 'pub-1', title: 'Nine Days Across Europe', author: 'Ananya Rao', authorInitials: 'AR', destinations: ['Paris', 'Rome', 'Amsterdam'], days: 9, budget: 78500, likes: 342, saves: 128, comments: 24, tags: ['Culture', 'First-timer'], coverImage: unsplash('photo-1499856871958-5b9627545d1a'), publishedAt: '2026-08-02' },
  { id: 'pub-2', title: 'Slow Mornings in Bali', author: 'Kabir Menon', authorInitials: 'KM', destinations: ['Bali', 'Ubud'], days: 8, budget: 54000, likes: 511, saves: 233, comments: 41, tags: ['Budget', 'Relaxation'], coverImage: unsplash('photo-1537996194471-e657df975ab4'), publishedAt: '2026-07-21' },
  { id: 'pub-3', title: 'Tokyo to Kyoto by Rail', author: 'Meera Iyer', authorInitials: 'MI', destinations: ['Tokyo', 'Kyoto', 'Osaka'], days: 10, budget: 92000, likes: 728, saves: 401, comments: 63, tags: ['Food', 'Culture'], coverImage: unsplash('photo-1540959733332-eab4deabeeaf'), publishedAt: '2026-07-09' },
  { id: 'pub-4', title: 'Desert & Skyline: Dubai', author: 'Rohan Shah', authorInitials: 'RS', destinations: ['Dubai'], days: 4, budget: 46000, likes: 196, saves: 74, comments: 12, tags: ['Luxury', 'Weekend'], coverImage: unsplash('photo-1512453979798-5ea266f8880c'), publishedAt: '2026-06-28' },
  { id: 'pub-5', title: 'A Long Weekend in Goa', author: 'Priya Nair', authorInitials: 'PN', destinations: ['Goa'], days: 4, budget: 18000, likes: 289, saves: 156, comments: 19, tags: ['Budget', 'Beach'], coverImage: unsplash('photo-1512343879784-a960bf40e7f2'), publishedAt: '2026-06-15' },
  { id: 'pub-6', title: 'New York in Autumn', author: 'Devika Bose', authorInitials: 'DB', destinations: ['New York'], days: 6, budget: 88000, likes: 415, saves: 187, comments: 33, tags: ['City', 'Photography'], coverImage: unsplash('photo-1496442226666-8d4d0e62e6e9'), publishedAt: '2026-05-30' },
  { id: 'pub-7', title: 'Canals & Museums: Amsterdam', author: 'Arjun Pillai', authorInitials: 'AP', destinations: ['Amsterdam'], days: 3, budget: 32000, likes: 154, saves: 61, comments: 9, tags: ['Culture', 'Weekend'], coverImage: unsplash('photo-1534351590666-13e3e96b5017'), publishedAt: '2026-05-11' },
  { id: 'pub-8', title: 'Istanbul on a Shoestring', author: 'Sana Qureshi', authorInitials: 'SQ', destinations: ['Istanbul'], days: 5, budget: 24000, likes: 367, saves: 198, comments: 28, tags: ['Budget', 'Food'], coverImage: unsplash('photo-1524231757912-21f4fe3a7200'), publishedAt: '2026-04-27' },
]

export const communityTagOptions = [
  { value: 'all', label: 'All tags' },
  { value: 'Budget', label: 'Budget' },
  { value: 'Luxury', label: 'Luxury' },
  { value: 'Culture', label: 'Culture' },
  { value: 'Food', label: 'Food' },
  { value: 'Beach', label: 'Beach' },
  { value: 'Weekend', label: 'Weekend' },
]

export const communityDurationOptions = [
  { value: 'all', label: 'Any length' },
  { value: 'short', label: 'Up to 4 days' },
  { value: 'medium', label: '5 – 8 days' },
  { value: 'long', label: '9+ days' },
]

export const communitySortOptions = [
  { value: 'popular', label: 'Most liked' },
  { value: 'saved', label: 'Most saved' },
  { value: 'recent', label: 'Recently shared' },
  { value: 'budget-low', label: 'Budget: low to high' },
]

// ---- Profile (Step 22) ----

export const profileCountryOptions = [
  { value: 'India', label: 'India' },
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'UAE', label: 'UAE' },
  { value: 'Netherlands', label: 'Netherlands' },
  { value: 'Türkiye', label: 'Türkiye' },
]

export const profileTravelPreferences = [
  'Adventure',
  'Culture',
  'Food',
  'Nature',
  'Luxury',
  'Budget',
  'Beach',
  'City',
]

export const communityTopCreators = [
  { id: 'cr-1', name: 'Meera Iyer', initials: 'MI', trips: 14, followers: '8.2k' },
  { id: 'cr-2', name: 'Kabir Menon', initials: 'KM', trips: 11, followers: '6.4k' },
  { id: 'cr-3', name: 'Devika Bose', initials: 'DB', trips: 9, followers: '5.1k' },
  { id: 'cr-4', name: 'Sana Qureshi', initials: 'SQ', trips: 7, followers: '3.9k' },
]
