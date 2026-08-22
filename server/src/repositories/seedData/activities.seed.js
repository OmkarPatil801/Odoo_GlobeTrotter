// Sample activity data for the in-memory repository (dev + tests only).
// `cityId` here refers to the 1-based position of the city in
// ./cities.seed.js. Currencies deliberately vary by city — never assume a
// single default currency.
module.exports = [
  {
    cityId: 1, // Paris
    name: 'Louvre Museum Tour',
    category: 'MUSEUM',
    description: 'Guided tour of the world-famous art museum.',
    duration: 180,
    cost: 25,
    currencyCode: 'EUR',
    imageUrl: 'https://images.globetrotter.example/activities/louvre.jpg',
  },
  {
    cityId: 1,
    name: 'Seine River Cruise',
    category: 'TOUR',
    description: 'Scenic boat cruise along the Seine.',
    duration: 60,
    cost: 15,
    currencyCode: 'EUR',
    imageUrl: 'https://images.globetrotter.example/activities/seine-cruise.jpg',
  },
  {
    cityId: 2, // Tokyo
    name: 'Senso-ji Temple Visit',
    category: 'CULTURE',
    description: "Explore Tokyo's oldest Buddhist temple.",
    duration: 90,
    cost: 0,
    currencyCode: 'JPY',
    imageUrl: 'https://images.globetrotter.example/activities/sensoji.jpg',
  },
  {
    cityId: 2,
    name: 'Shibuya Food Tour',
    category: 'FOOD',
    description: 'Sample local street food in Shibuya.',
    duration: 150,
    cost: 6000,
    currencyCode: 'JPY',
    imageUrl: 'https://images.globetrotter.example/activities/shibuya-food.jpg',
  },
  {
    cityId: 3, // New York
    name: 'Statue of Liberty Tour',
    category: 'TOUR',
    description: 'Ferry tour to the Statue of Liberty and Ellis Island.',
    duration: 240,
    cost: 24,
    currencyCode: 'USD',
    imageUrl: 'https://images.globetrotter.example/activities/statue-of-liberty.jpg',
  },
  {
    cityId: 3,
    name: 'MoMA Museum Visit',
    category: 'MUSEUM',
    description: 'Explore modern and contemporary art.',
    duration: 120,
    cost: 25,
    currencyCode: 'USD',
    imageUrl: 'https://images.globetrotter.example/activities/moma.jpg',
  },
  {
    cityId: 4, // Cairo
    name: 'Pyramids of Giza Tour',
    category: 'TOUR',
    description: 'Guided tour of the Great Pyramids and Sphinx.',
    duration: 300,
    cost: 40,
    currencyCode: 'EGP',
    imageUrl: 'https://images.globetrotter.example/activities/giza.jpg',
  },
  {
    cityId: 5, // Sydney
    name: 'Sydney Opera House Show',
    category: 'ENTERTAINMENT',
    description: 'Live performance at the iconic Opera House.',
    duration: 120,
    cost: 89,
    currencyCode: 'AUD',
    imageUrl: 'https://images.globetrotter.example/activities/opera-house.jpg',
  },
  {
    cityId: 6, // Rio de Janeiro
    name: 'Christ the Redeemer Tour',
    category: 'TOUR',
    description: 'Visit the iconic statue overlooking Rio.',
    duration: 180,
    cost: 70,
    currencyCode: 'BRL',
    imageUrl: 'https://images.globetrotter.example/activities/christ-redeemer.jpg',
  },
  {
    cityId: 7, // Bangkok
    name: 'Grand Palace Tour',
    category: 'CULTURE',
    description: "Explore Bangkok's ornate royal palace complex.",
    duration: 150,
    cost: 500,
    currencyCode: 'THB',
    imageUrl: 'https://images.globetrotter.example/activities/grand-palace.jpg',
  },
  {
    cityId: 8, // London
    name: 'British Museum Visit',
    category: 'MUSEUM',
    description: 'World-renowned collection of art and antiquities.',
    duration: 150,
    cost: 0,
    currencyCode: 'GBP',
    imageUrl: 'https://images.globetrotter.example/activities/british-museum.jpg',
  },
  {
    cityId: 9, // Nairobi
    name: 'Nairobi National Park Safari',
    category: 'ADVENTURE',
    description: 'Wildlife safari minutes from the city center.',
    duration: 240,
    cost: 5000,
    currencyCode: 'KES',
    imageUrl: 'https://images.globetrotter.example/activities/nairobi-safari.jpg',
  },
  {
    cityId: 10, // Dubai
    name: 'Burj Khalifa Observation Deck',
    category: 'SIGHTSEEING',
    description: "Views from the world's tallest building.",
    duration: 90,
    cost: 169,
    currencyCode: 'AED',
    imageUrl: 'https://images.globetrotter.example/activities/burj-khalifa.jpg',
  },
];
