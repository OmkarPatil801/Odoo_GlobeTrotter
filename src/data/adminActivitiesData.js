const unsplash = (id, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const adminActivities = [
  { id: 'aa-1', name: 'Eiffel Tower Summit', destination: 'Paris', country: 'France', category: 'Landmark', price: 2400, duration: 3, rating: 4.8, bookings: 1240, status: 'published', description: 'Lift access to the top deck at golden hour.', image: unsplash('photo-1511739001486-6bfe10ce785f') },
  { id: 'aa-2', name: 'Louvre Museum Tour', destination: 'Paris', country: 'France', category: 'Culture', price: 1800, duration: 4, rating: 4.7, bookings: 980, status: 'published', description: 'Guided route through the Denon wing.', image: unsplash('photo-1565099824688-e93eb20fe622') },
  { id: 'aa-3', name: 'Seine River Cruise', destination: 'Paris', country: 'France', category: 'Sightseeing', price: 1600, duration: 2, rating: 4.5, bookings: 764, status: 'published', description: 'Evening sail past the illuminated bridges.', image: unsplash('photo-1502602898657-3e91760cbb34') },
  { id: 'aa-4', name: 'Colosseum Arena Floor', destination: 'Rome', country: 'Italy', category: 'Landmark', price: 4200, duration: 3, rating: 4.8, bookings: 1105, status: 'published', description: 'Walk the arena where gladiators fought.', image: unsplash('photo-1552832230-c0197dd311b5') },
  { id: 'aa-5', name: 'Tokyo Skytree', destination: 'Tokyo', country: 'Japan', category: 'Landmark', price: 2100, duration: 2, rating: 4.6, bookings: 892, status: 'published', description: 'The city sprawls out from 450 metres up.', image: unsplash('photo-1536098561742-ca998e48cbcc') },
  { id: 'aa-6', name: 'Tsukiji Food Walk', destination: 'Tokyo', country: 'Japan', category: 'Food', price: 3400, duration: 3, rating: 4.9, bookings: 1420, status: 'published', description: 'Sashimi, tamago, and street-side stalls.', image: unsplash('photo-1540959733332-eab4deabeeaf') },
  { id: 'aa-7', name: 'Arashiyama Bamboo Grove', destination: 'Kyoto', country: 'Japan', category: 'Nature', price: 900, duration: 2, rating: 4.7, bookings: 651, status: 'published', description: 'Early-morning walk before the crowds.', image: unsplash('photo-1493976040374-85c8e12f0c0e') },
  { id: 'aa-8', name: 'Desert Safari', destination: 'Dubai', country: 'UAE', category: 'Adventure', price: 5200, duration: 6, rating: 4.6, bookings: 1330, status: 'published', description: 'Dune bashing, camels, and dinner under stars.', image: unsplash('photo-1451337516015-6b6e9a44a8a3') },
  { id: 'aa-9', name: 'Burj Khalifa Observation', destination: 'Dubai', country: 'UAE', category: 'Landmark', price: 4600, duration: 2, rating: 4.7, bookings: 1580, status: 'published', description: 'Levels 124 and 125 at sunset.', image: unsplash('photo-1512453979798-5ea266f8880c') },
  { id: 'aa-10', name: 'Ubud Rice Terraces', destination: 'Bali', country: 'Indonesia', category: 'Nature', price: 1200, duration: 4, rating: 4.6, bookings: 723, status: 'published', description: 'Terraced fields and a jungle swing stop.', image: unsplash('photo-1537996194471-e657df975ab4') },
  { id: 'aa-11', name: 'Scuba Diving', destination: 'Goa', country: 'India', category: 'Adventure', price: 4800, duration: 5, rating: 4.4, bookings: 412, status: 'pending', description: 'Reef dives in the warm Arabian Sea.', image: unsplash('photo-1544551763-46a013bb70d5') },
  { id: 'aa-12', name: 'Canal Ring Cruise', destination: 'Amsterdam', country: 'Netherlands', category: 'Sightseeing', price: 2300, duration: 2, rating: 4.5, bookings: 596, status: 'published', description: 'Ninety minutes through the Jordaan canals.', image: unsplash('photo-1534351590666-13e3e96b5017') },
  { id: 'aa-13', name: 'Bosphorus Sunset Cruise', destination: 'Istanbul', country: 'Türkiye', category: 'Sightseeing', price: 1400, duration: 2, rating: 4.4, bookings: 288, status: 'pending', description: 'Sail the strait between two continents.', image: unsplash('photo-1524231757912-21f4fe3a7200') },
  { id: 'aa-14', name: 'Broadway Show', destination: 'New York', country: 'United States', category: 'Culture', price: 8200, duration: 3, rating: 4.8, bookings: 1012, status: 'published', description: 'Orchestra seating for a headline production.', image: unsplash('photo-1496442226666-8d4d0e62e6e9') },
  { id: 'aa-15', name: 'Northern Lights Hunt', destination: 'Reykjavik', country: 'Iceland', category: 'Nature', price: 7600, duration: 5, rating: 4.5, bookings: 174, status: 'archived', description: 'Guided chase away from the city lights.', image: unsplash('photo-1504829857797-ddff29c27927') },
]

export const adminActivityCategoryOptions = [
  { value: 'all', label: 'All categories' },
  { value: 'Landmark', label: 'Landmark' },
  { value: 'Culture', label: 'Culture' },
  { value: 'Adventure', label: 'Adventure' },
  { value: 'Nature', label: 'Nature' },
  { value: 'Food', label: 'Food' },
  { value: 'Sightseeing', label: 'Sightseeing' },
]

export const adminActivityStatusFilterOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'published', label: 'Published' },
  { value: 'pending', label: 'Pending' },
  { value: 'archived', label: 'Archived' },
]

export const adminActivitySortOptions = [
  { value: 'bookings', label: 'Most booked' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'price-low', label: 'Price: low to high' },
]

export const adminActivityCategories = [
  'Landmark',
  'Culture',
  'Adventure',
  'Nature',
  'Food',
  'Sightseeing',
]

export const adminActivityStatuses = [
  { value: 'published', label: 'Published' },
  { value: 'pending', label: 'Pending' },
  { value: 'archived', label: 'Archived' },
]
