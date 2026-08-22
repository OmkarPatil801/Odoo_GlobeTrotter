import { PrismaClient, Role, TripStatus, ExpenseCategory } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function hash(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

type CitySeed = {
  name: string;
  country: string;
  region: string;
  description: string;
  costIndex: number;
  popularityScore: number;
  imageUrl: string;
  activities: {
    name: string;
    category: string;
    description: string;
    durationHours: number;
    cost: number;
    imageUrl: string;
  }[];
};

const cities: CitySeed[] = [
  {
    name: "Paris",
    country: "France",
    region: "Europe",
    description: "The City of Light, famed for art, fashion and cuisine.",
    costIndex: 85,
    popularityScore: 98,
    imageUrl: "https://images.example.com/cities/paris.jpg",
    activities: [
      { name: "Eiffel Tower Visit", category: "Sightseeing", description: "Iconic iron tower with city views.", durationHours: 2, cost: 30, imageUrl: "https://images.example.com/activities/eiffel-tower.jpg" },
      { name: "Louvre Museum", category: "Museum", description: "World's largest art museum, home to the Mona Lisa.", durationHours: 3, cost: 22, imageUrl: "https://images.example.com/activities/louvre.jpg" },
      { name: "Seine River Cruise", category: "Sightseeing", description: "Scenic boat cruise along the Seine.", durationHours: 1.5, cost: 18, imageUrl: "https://images.example.com/activities/seine-cruise.jpg" },
      { name: "Montmartre Walking Tour", category: "Tour", description: "Explore the historic artists' quarter.", durationHours: 2.5, cost: 25, imageUrl: "https://images.example.com/activities/montmartre.jpg" },
    ],
  },
  {
    name: "London",
    country: "United Kingdom",
    region: "Europe",
    description: "Historic capital blending royal heritage and modern culture.",
    costIndex: 90,
    popularityScore: 95,
    imageUrl: "https://images.example.com/cities/london.jpg",
    activities: [
      { name: "Big Ben & Westminster", category: "Sightseeing", description: "Iconic clock tower and Houses of Parliament.", durationHours: 1.5, cost: 0, imageUrl: "https://images.example.com/activities/big-ben.jpg" },
      { name: "British Museum", category: "Museum", description: "World history and culture under one roof.", durationHours: 3, cost: 0, imageUrl: "https://images.example.com/activities/british-museum.jpg" },
      { name: "London Eye", category: "Sightseeing", description: "Giant observation wheel on the South Bank.", durationHours: 1, cost: 35, imageUrl: "https://images.example.com/activities/london-eye.jpg" },
      { name: "West End Show", category: "Entertainment", description: "World-class theatre performance.", durationHours: 2.5, cost: 65, imageUrl: "https://images.example.com/activities/west-end.jpg" },
    ],
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    description: "Canal city known for art, cycling and nightlife.",
    costIndex: 80,
    popularityScore: 88,
    imageUrl: "https://images.example.com/cities/amsterdam.jpg",
    activities: [
      { name: "Canal Cruise", category: "Sightseeing", description: "Tour the historic canal ring by boat.", durationHours: 1, cost: 20, imageUrl: "https://images.example.com/activities/canal-cruise.jpg" },
      { name: "Van Gogh Museum", category: "Museum", description: "Largest collection of Van Gogh's work.", durationHours: 2, cost: 20, imageUrl: "https://images.example.com/activities/van-gogh.jpg" },
      { name: "Anne Frank House", category: "Museum", description: "Historic house and biographical museum.", durationHours: 1.5, cost: 16, imageUrl: "https://images.example.com/activities/anne-frank.jpg" },
    ],
  },
  {
    name: "Dubai",
    country: "United Arab Emirates",
    region: "Middle East",
    description: "Futuristic skyline, desert adventures and luxury shopping.",
    costIndex: 88,
    popularityScore: 90,
    imageUrl: "https://images.example.com/cities/dubai.jpg",
    activities: [
      { name: "Burj Khalifa Observation Deck", category: "Sightseeing", description: "Views from the world's tallest building.", durationHours: 1.5, cost: 45, imageUrl: "https://images.example.com/activities/burj-khalifa.jpg" },
      { name: "Desert Safari", category: "Adventure", description: "Dune bashing, camel rides and BBQ dinner.", durationHours: 5, cost: 60, imageUrl: "https://images.example.com/activities/desert-safari.jpg" },
      { name: "Dubai Mall & Fountain Show", category: "Shopping", description: "Shopping and the iconic fountain show.", durationHours: 3, cost: 0, imageUrl: "https://images.example.com/activities/dubai-mall.jpg" },
    ],
  },
  {
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    description: "Ultra-modern metropolis with deep traditional roots.",
    costIndex: 82,
    popularityScore: 93,
    imageUrl: "https://images.example.com/cities/tokyo.jpg",
    activities: [
      { name: "Senso-ji Temple", category: "Sightseeing", description: "Tokyo's oldest Buddhist temple.", durationHours: 1.5, cost: 0, imageUrl: "https://images.example.com/activities/sensoji.jpg" },
      { name: "Shibuya Crossing & Shopping", category: "Shopping", description: "World's busiest pedestrian crossing.", durationHours: 2, cost: 0, imageUrl: "https://images.example.com/activities/shibuya.jpg" },
      { name: "Tsukiji Outer Market Food Tour", category: "Food", description: "Sample the freshest sushi and street food.", durationHours: 2.5, cost: 40, imageUrl: "https://images.example.com/activities/tsukiji.jpg" },
      { name: "TeamLab Digital Art Museum", category: "Museum", description: "Immersive digital art installations.", durationHours: 3, cost: 30, imageUrl: "https://images.example.com/activities/teamlab.jpg" },
    ],
  },
  {
    name: "Mumbai",
    country: "India",
    region: "Asia",
    description: "India's financial capital, vibrant and fast-paced.",
    costIndex: 45,
    popularityScore: 78,
    imageUrl: "https://images.example.com/cities/mumbai.jpg",
    activities: [
      { name: "Gateway of India", category: "Sightseeing", description: "Iconic colonial-era monument by the sea.", durationHours: 1, cost: 0, imageUrl: "https://images.example.com/activities/gateway-of-india.jpg" },
      { name: "Elephanta Caves Ferry", category: "Tour", description: "Ancient rock-cut caves on Elephanta Island.", durationHours: 4, cost: 15, imageUrl: "https://images.example.com/activities/elephanta.jpg" },
      { name: "Marine Drive Walk", category: "Sightseeing", description: "Scenic promenade along the Arabian Sea.", durationHours: 1.5, cost: 0, imageUrl: "https://images.example.com/activities/marine-drive.jpg" },
    ],
  },
  {
    name: "Goa",
    country: "India",
    region: "Asia",
    description: "Coastal paradise known for beaches and nightlife.",
    costIndex: 35,
    popularityScore: 85,
    imageUrl: "https://images.example.com/cities/goa.jpg",
    activities: [
      { name: "Baga Beach", category: "Beach", description: "Popular beach with water sports and shacks.", durationHours: 3, cost: 0, imageUrl: "https://images.example.com/activities/baga-beach.jpg" },
      { name: "Fort Aguada", category: "Sightseeing", description: "17th-century Portuguese fort with lighthouse.", durationHours: 1.5, cost: 5, imageUrl: "https://images.example.com/activities/fort-aguada.jpg" },
      { name: "Spice Plantation Tour", category: "Tour", description: "Guided walk through a working spice farm.", durationHours: 2.5, cost: 12, imageUrl: "https://images.example.com/activities/spice-plantation.jpg" },
    ],
  },
  {
    name: "Delhi",
    country: "India",
    region: "Asia",
    description: "India's capital, rich in Mughal and colonial history.",
    costIndex: 40,
    popularityScore: 80,
    imageUrl: "https://images.example.com/cities/delhi.jpg",
    activities: [
      { name: "Red Fort", category: "Sightseeing", description: "Historic Mughal fortress complex.", durationHours: 2, cost: 6, imageUrl: "https://images.example.com/activities/red-fort.jpg" },
      { name: "India Gate", category: "Sightseeing", description: "War memorial and popular gathering spot.", durationHours: 1, cost: 0, imageUrl: "https://images.example.com/activities/india-gate.jpg" },
      { name: "Qutub Minar", category: "Sightseeing", description: "Tallest brick minaret in the world.", durationHours: 1.5, cost: 5, imageUrl: "https://images.example.com/activities/qutub-minar.jpg" },
    ],
  },
  {
    name: "Singapore",
    country: "Singapore",
    region: "Asia",
    description: "Compact city-state famed for food and futuristic gardens.",
    costIndex: 87,
    popularityScore: 89,
    imageUrl: "https://images.example.com/cities/singapore.jpg",
    activities: [
      { name: "Gardens by the Bay", category: "Sightseeing", description: "Futuristic Supertree gardens and domes.", durationHours: 2.5, cost: 28, imageUrl: "https://images.example.com/activities/gardens-by-the-bay.jpg" },
      { name: "Sentosa Island", category: "Adventure", description: "Beaches, theme parks and attractions.", durationHours: 4, cost: 40, imageUrl: "https://images.example.com/activities/sentosa.jpg" },
      { name: "Hawker Centre Food Tour", category: "Food", description: "Taste iconic street food at local hawker stalls.", durationHours: 2, cost: 20, imageUrl: "https://images.example.com/activities/hawker-centre.jpg" },
    ],
  },
  {
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    description: "Tropical island of temples, rice terraces and surf.",
    costIndex: 42,
    popularityScore: 91,
    imageUrl: "https://images.example.com/cities/bali.jpg",
    activities: [
      { name: "Tanah Lot Temple", category: "Sightseeing", description: "Iconic sea temple on a rock formation.", durationHours: 1.5, cost: 10, imageUrl: "https://images.example.com/activities/tanah-lot.jpg" },
      { name: "Ubud Rice Terraces", category: "Nature", description: "Scenic terraced rice paddies.", durationHours: 2, cost: 5, imageUrl: "https://images.example.com/activities/ubud-terraces.jpg" },
      { name: "Uluwatu Sunset & Kecak Dance", category: "Entertainment", description: "Clifftop temple with traditional dance performance.", durationHours: 3, cost: 15, imageUrl: "https://images.example.com/activities/uluwatu.jpg" },
    ],
  },
  {
    name: "New York",
    country: "United States",
    region: "North America",
    description: "The city that never sleeps, a global hub of culture.",
    costIndex: 95,
    popularityScore: 96,
    imageUrl: "https://images.example.com/cities/new-york.jpg",
    activities: [
      { name: "Statue of Liberty & Ellis Island", category: "Sightseeing", description: "Ferry tour to America's iconic statue.", durationHours: 3, cost: 24, imageUrl: "https://images.example.com/activities/statue-of-liberty.jpg" },
      { name: "Central Park Walk", category: "Nature", description: "Iconic urban park in the heart of Manhattan.", durationHours: 2, cost: 0, imageUrl: "https://images.example.com/activities/central-park.jpg" },
      { name: "Broadway Show", category: "Entertainment", description: "World-renowned live theatre.", durationHours: 2.5, cost: 120, imageUrl: "https://images.example.com/activities/broadway.jpg" },
      { name: "Empire State Building", category: "Sightseeing", description: "Art Deco skyscraper with observation deck.", durationHours: 1.5, cost: 44, imageUrl: "https://images.example.com/activities/empire-state.jpg" },
    ],
  },
  {
    name: "Rome",
    country: "Italy",
    region: "Europe",
    description: "The Eternal City, cradle of the Roman Empire.",
    costIndex: 78,
    popularityScore: 94,
    imageUrl: "https://images.example.com/cities/rome.jpg",
    activities: [
      { name: "Colosseum Tour", category: "Sightseeing", description: "Ancient Roman amphitheatre.", durationHours: 2, cost: 24, imageUrl: "https://images.example.com/activities/colosseum.jpg" },
      { name: "Vatican Museums & Sistine Chapel", category: "Museum", description: "Renaissance art and Michelangelo's masterpiece.", durationHours: 3, cost: 30, imageUrl: "https://images.example.com/activities/vatican.jpg" },
      { name: "Trevi Fountain", category: "Sightseeing", description: "Baroque fountain, the largest in Rome.", durationHours: 0.5, cost: 0, imageUrl: "https://images.example.com/activities/trevi-fountain.jpg" },
    ],
  },
];

async function main() {
  console.log("Seeding database...");

  // ---------- Users ----------
  const adminPasswordHash = await hash("Admin@123");
  const demoPasswordHash = await hash("Demo@123");

  const admin = await prisma.user.upsert({
    where: { email: "admin@globetrotter.app" },
    update: {},
    create: {
      name: "GlobeTrotter Admin",
      email: "admin@globetrotter.app",
      passwordHash: adminPasswordHash,
      country: "India",
      role: Role.ADMIN,
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@globetrotter.app" },
    update: {},
    create: {
      name: "Demo Traveler",
      email: "demo@globetrotter.app",
      passwordHash: demoPasswordHash,
      phone: "+91-9876543210",
      country: "India",
      role: Role.USER,
    },
  });

  // ---------- Cities & Activities ----------
  const cityRecords: Record<string, { id: number; activities: { id: number; name: string }[] }> = {};

  for (const c of cities) {
    const existingCity = await prisma.city.findFirst({ where: { name: c.name, country: c.country } });
    const city =
      existingCity ??
      (await prisma.city.create({
        data: {
          name: c.name,
          country: c.country,
          region: c.region,
          description: c.description,
          costIndex: c.costIndex,
          popularityScore: c.popularityScore,
          imageUrl: c.imageUrl,
        },
      }));

    const activityRecords: { id: number; name: string }[] = [];
    for (const a of c.activities) {
      const existingActivity = await prisma.activity.findFirst({
        where: { cityId: city.id, name: a.name },
      });
      const activity =
        existingActivity ??
        (await prisma.activity.create({
          data: {
            cityId: city.id,
            name: a.name,
            category: a.category,
            description: a.description,
            durationHours: a.durationHours,
            cost: a.cost,
            imageUrl: a.imageUrl,
          },
        }));
      activityRecords.push({ id: activity.id, name: activity.name });
    }

    cityRecords[c.name] = { id: city.id, activities: activityRecords };
  }

  console.log(`Seeded ${cities.length} cities and their activities.`);

  // ---------- Demo Trip: multi-city "European Adventure" ----------
  const paris = cityRecords["Paris"];
  const london = cityRecords["London"];
  const amsterdam = cityRecords["Amsterdam"];

  let trip = await prisma.trip.findFirst({
    where: { userId: demoUser.id, name: "European Adventure" },
  });

  if (!trip) {
    trip = await prisma.trip.create({
      data: {
        userId: demoUser.id,
        name: "European Adventure",
        description: "A whirlwind tour through Paris, London and Amsterdam.",
        startDate: new Date("2026-09-12"),
        endDate: new Date("2026-09-16"),
        coverImageUrl: "https://images.example.com/trips/european-adventure.jpg",
        status: TripStatus.PLANNED,
        isPublic: true,
      },
    });
  }

  // Trip stops
  const stopData = [
    { cityId: paris.id, stopOrder: 1, arrivalDate: new Date("2026-09-12"), departureDate: new Date("2026-09-14"), notes: "Stay near the Marais district." },
    { cityId: london.id, stopOrder: 2, arrivalDate: new Date("2026-09-14"), departureDate: new Date("2026-09-15"), notes: "Eurostar from Paris." },
    { cityId: amsterdam.id, stopOrder: 3, arrivalDate: new Date("2026-09-15"), departureDate: new Date("2026-09-16"), notes: "Short flight from London." },
  ];

  for (const s of stopData) {
    const existing = await prisma.tripStop.findFirst({ where: { tripId: trip.id, stopOrder: s.stopOrder } });
    if (!existing) {
      await prisma.tripStop.create({ data: { tripId: trip.id, ...s } });
    }
  }

  // Itinerary items
  const findActivity = (cityName: string, activityName: string) => {
    const city = cityRecords[cityName];
    const activity = city.activities.find((a) => a.name === activityName);
    if (!activity) throw new Error(`Activity not found: ${activityName} in ${cityName}`);
    return activity;
  };

  const itineraryData = [
    { activityDate: new Date("2026-09-12"), cityName: "Paris", activityName: "Eiffel Tower Visit", itemOrder: 1, startTime: "09:00:00" },
    { activityDate: new Date("2026-09-12"), cityName: "Paris", activityName: "Louvre Museum", itemOrder: 2, startTime: "13:00:00" },
    { activityDate: new Date("2026-09-13"), cityName: "Paris", activityName: "Seine River Cruise", itemOrder: 1, startTime: "18:00:00" },
    { activityDate: new Date("2026-09-14"), cityName: "London", activityName: "Big Ben & Westminster", itemOrder: 1, startTime: "10:00:00" },
  ];

  for (const item of itineraryData) {
    const activity = findActivity(item.cityName, item.activityName);
    const cityId = cityRecords[item.cityName].id;
    const existing = await prisma.itineraryItem.findFirst({
      where: { tripId: trip.id, activityDate: item.activityDate, itemOrder: item.itemOrder },
    });
    if (!existing) {
      await prisma.itineraryItem.create({
        data: {
          tripId: trip.id,
          cityId,
          activityId: activity.id,
          activityDate: item.activityDate,
          startTime: new Date(`1970-01-01T${item.startTime}Z`),
          itemOrder: item.itemOrder,
        },
      });
    }
  }

  // Expenses
  const expenseData: { category: ExpenseCategory; amount: number; description: string; expenseDate: Date }[] = [
    { category: ExpenseCategory.TRANSPORT, amount: 10000, description: "Flights and Eurostar tickets", expenseDate: new Date("2026-09-12") },
    { category: ExpenseCategory.STAY, amount: 25000, description: "Hotels in Paris, London, Amsterdam", expenseDate: new Date("2026-09-12") },
    { category: ExpenseCategory.ACTIVITY, amount: 8000, description: "Museum and attraction tickets", expenseDate: new Date("2026-09-13") },
    { category: ExpenseCategory.MEAL, amount: 5000, description: "Meals across all three cities", expenseDate: new Date("2026-09-14") },
  ];

  const existingExpenses = await prisma.expense.count({ where: { tripId: trip.id } });
  if (existingExpenses === 0) {
    await prisma.expense.createMany({
      data: expenseData.map((e) => ({ tripId: trip.id, ...e })),
    });
  }

  // Saved destination
  await prisma.savedDestination.upsert({
    where: { userId_cityId: { userId: demoUser.id, cityId: cityRecords["Tokyo"].id } },
    update: {},
    create: { userId: demoUser.id, cityId: cityRecords["Tokyo"].id },
  });

  // Community post
  const existingPost = await prisma.communityPost.findFirst({
    where: { userId: demoUser.id, title: "3 Days That Changed How I See Europe" },
  });
  if (!existingPost) {
    await prisma.communityPost.create({
      data: {
        userId: demoUser.id,
        tripId: trip.id,
        title: "3 Days That Changed How I See Europe",
        content: "Paris, London and Amsterdam in one trip — here's how I planned it and what I'd do differently.",
        imageUrl: "https://images.example.com/community/european-adventure-post.jpg",
      },
    });
  }

  // Trip share
  const existingShare = await prisma.tripShare.findFirst({ where: { tripId: trip.id } });
  if (!existingShare) {
    await prisma.tripShare.create({
      data: {
        tripId: trip.id,
        shareToken: crypto.randomBytes(24).toString("hex"),
        isActive: true,
      },
    });
  }

  console.log("Seed complete.");
  console.log(`Admin login: admin@globetrotter.app / Admin@123`);
  console.log(`Demo login:  demo@globetrotter.app / Demo@123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
