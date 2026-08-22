const unsplash = (id, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const adminStats = {
  totalUsers: 12480,
  totalUsersDelta: 8.4,
  totalTrips: 3164,
  totalTripsDelta: 12.1,
  activeTrips: 487,
  activeTripsDelta: -2.3,
  revenue: 2840000,
  revenueDelta: 5.7,
}

export const adminSignupTrend = [
  { month: 'Mar', users: 640, trips: 180 },
  { month: 'Apr', users: 780, trips: 224 },
  { month: 'May', users: 910, trips: 268 },
  { month: 'Jun', users: 1180, trips: 331 },
  { month: 'Jul', users: 1420, trips: 402 },
  { month: 'Aug', users: 1685, trips: 468 },
]

export const adminPopularDestinations = [
  { id: 'd-paris', name: 'Paris', country: 'France', trips: 612, share: 19.4, image: unsplash('photo-1502602898657-3e91760cbb34') },
  { id: 'd-tokyo', name: 'Tokyo', country: 'Japan', trips: 548, share: 17.3, image: unsplash('photo-1540959733332-eab4deabeeaf') },
  { id: 'd-bali', name: 'Bali', country: 'Indonesia', trips: 471, share: 14.9, image: unsplash('photo-1537996194471-e657df975ab4') },
  { id: 'd-dubai', name: 'Dubai', country: 'UAE', trips: 396, share: 12.5, image: unsplash('photo-1512453979798-5ea266f8880c') },
  { id: 'd-goa', name: 'Goa', country: 'India', trips: 358, share: 11.3, image: unsplash('photo-1512343879784-a960bf40e7f2') },
]

export const adminActivityMix = [
  { name: 'Sightseeing', value: 34, color: '#ff7a59' },
  { name: 'Food', value: 24, color: '#19a7a8' },
  { name: 'Adventure', value: 18, color: '#0ea5e9' },
  { name: 'Culture', value: 15, color: '#f59e0b' },
  { name: 'Nature', value: 9, color: '#8b5cf6' },
]

export const adminRecentUsers = [
  { id: 'u-1', name: 'Ananya Rao', email: 'ananya.rao@example.com', initials: 'AR', joinedAt: '2026-08-21', trips: 4, status: 'active' },
  { id: 'u-2', name: 'Kabir Menon', email: 'kabir.menon@example.com', initials: 'KM', joinedAt: '2026-08-20', trips: 11, status: 'active' },
  { id: 'u-3', name: 'Meera Iyer', email: 'meera.iyer@example.com', initials: 'MI', joinedAt: '2026-08-19', trips: 14, status: 'active' },
  { id: 'u-4', name: 'Rohan Shah', email: 'rohan.shah@example.com', initials: 'RS', joinedAt: '2026-08-18', trips: 2, status: 'pending' },
  { id: 'u-5', name: 'Priya Nair', email: 'priya.nair@example.com', initials: 'PN', joinedAt: '2026-08-17', trips: 6, status: 'active' },
  { id: 'u-6', name: 'Sana Qureshi', email: 'sana.q@example.com', initials: 'SQ', joinedAt: '2026-08-16', trips: 7, status: 'suspended' },
]

export const adminRecentTrips = [
  { id: 't-1', name: 'European Escape', owner: 'Ananya Rao', destinations: 3, startDate: '2026-09-12', budget: 78500, status: 'upcoming' },
  { id: 't-2', name: 'Tokyo to Kyoto by Rail', owner: 'Meera Iyer', destinations: 3, startDate: '2026-11-05', budget: 92000, status: 'planning' },
  { id: 't-3', name: 'Slow Mornings in Bali', owner: 'Kabir Menon', destinations: 2, startDate: '2026-10-08', budget: 54000, status: 'upcoming' },
  { id: 't-4', name: 'A Long Weekend in Goa', owner: 'Priya Nair', destinations: 1, startDate: '2026-10-02', budget: 18000, status: 'upcoming' },
  { id: 't-5', name: 'Desert & Skyline: Dubai', owner: 'Rohan Shah', destinations: 1, startDate: '2027-01-15', budget: 46000, status: 'planning' },
  { id: 't-6', name: 'New York in Autumn', owner: 'Devika Bose', destinations: 1, startDate: '2025-03-20', budget: 88000, status: 'completed' },
]

export const adminQuickActions = [
  { id: 'qa-users', label: 'Manage users', description: 'Review, suspend, or restore accounts', to: '/admin/users' },
  { id: 'qa-destinations', label: 'Add destination', description: 'Publish a new city to the catalog', to: '/admin/destinations' },
  { id: 'qa-activities', label: 'Moderate activities', description: '6 submissions awaiting review', to: '/admin/activities' },
  { id: 'qa-analytics', label: 'Full analytics', description: 'Growth, retention, and revenue', to: '/admin/analytics' },
]

// ---- Admin Users (Step 14) ----

export const adminUsers = [
  { id: 'u-1', name: 'Ananya Rao', email: 'ananya.rao@example.com', initials: 'AR', joinedAt: '2026-08-21', trips: 4, totalSpend: 142000, status: 'active', role: 'traveler', country: 'India', lastActive: '2026-08-22' },
  { id: 'u-2', name: 'Kabir Menon', email: 'kabir.menon@example.com', initials: 'KM', joinedAt: '2026-08-20', trips: 11, totalSpend: 486000, status: 'active', role: 'creator', country: 'India', lastActive: '2026-08-22' },
  { id: 'u-3', name: 'Meera Iyer', email: 'meera.iyer@example.com', initials: 'MI', joinedAt: '2026-08-19', trips: 14, totalSpend: 612000, status: 'active', role: 'creator', country: 'India', lastActive: '2026-08-21' },
  { id: 'u-4', name: 'Rohan Shah', email: 'rohan.shah@example.com', initials: 'RS', joinedAt: '2026-08-18', trips: 2, totalSpend: 64000, status: 'pending', role: 'traveler', country: 'UAE', lastActive: '2026-08-18' },
  { id: 'u-5', name: 'Priya Nair', email: 'priya.nair@example.com', initials: 'PN', joinedAt: '2026-08-17', trips: 6, totalSpend: 198000, status: 'active', role: 'traveler', country: 'India', lastActive: '2026-08-20' },
  { id: 'u-6', name: 'Sana Qureshi', email: 'sana.q@example.com', initials: 'SQ', joinedAt: '2026-08-16', trips: 7, totalSpend: 231000, status: 'suspended', role: 'creator', country: 'Türkiye', lastActive: '2026-07-30' },
  { id: 'u-7', name: 'Devika Bose', email: 'devika.bose@example.com', initials: 'DB', joinedAt: '2026-08-14', trips: 9, totalSpend: 374000, status: 'active', role: 'creator', country: 'India', lastActive: '2026-08-21' },
  { id: 'u-8', name: 'Arjun Pillai', email: 'arjun.pillai@example.com', initials: 'AP', joinedAt: '2026-08-12', trips: 3, totalSpend: 88000, status: 'active', role: 'traveler', country: 'Netherlands', lastActive: '2026-08-19' },
  { id: 'u-9', name: 'Nikhil Verma', email: 'nikhil.verma@example.com', initials: 'NV', joinedAt: '2026-08-10', trips: 1, totalSpend: 22000, status: 'pending', role: 'traveler', country: 'India', lastActive: '2026-08-11' },
  { id: 'u-10', name: 'Tara Sethi', email: 'tara.sethi@example.com', initials: 'TS', joinedAt: '2026-08-08', trips: 12, totalSpend: 529000, status: 'active', role: 'admin', country: 'India', lastActive: '2026-08-22' },
  { id: 'u-11', name: 'Imran Khan', email: 'imran.khan@example.com', initials: 'IK', joinedAt: '2026-08-05', trips: 5, totalSpend: 167000, status: 'active', role: 'traveler', country: 'UAE', lastActive: '2026-08-17' },
  { id: 'u-12', name: 'Leela Krishnan', email: 'leela.k@example.com', initials: 'LK', joinedAt: '2026-08-03', trips: 8, totalSpend: 289000, status: 'suspended', role: 'traveler', country: 'India', lastActive: '2026-07-22' },
  { id: 'u-13', name: 'Farhan Ali', email: 'farhan.ali@example.com', initials: 'FA', joinedAt: '2026-07-30', trips: 2, totalSpend: 54000, status: 'active', role: 'traveler', country: 'India', lastActive: '2026-08-16' },
  { id: 'u-14', name: 'Ishita Ghosh', email: 'ishita.ghosh@example.com', initials: 'IG', joinedAt: '2026-07-28', trips: 10, totalSpend: 412000, status: 'active', role: 'creator', country: 'India', lastActive: '2026-08-20' },
  { id: 'u-15', name: 'Yusuf Sheikh', email: 'yusuf.sheikh@example.com', initials: 'YS', joinedAt: '2026-07-25', trips: 0, totalSpend: 0, status: 'pending', role: 'traveler', country: 'Türkiye', lastActive: '2026-07-25' },
  { id: 'u-16', name: 'Nandini Joshi', email: 'nandini.joshi@example.com', initials: 'NJ', joinedAt: '2026-07-22', trips: 6, totalSpend: 203000, status: 'active', role: 'traveler', country: 'India', lastActive: '2026-08-15' },
  { id: 'u-17', name: 'Vikram Desai', email: 'vikram.desai@example.com', initials: 'VD', joinedAt: '2026-07-18', trips: 15, totalSpend: 688000, status: 'active', role: 'creator', country: 'India', lastActive: '2026-08-22' },
  { id: 'u-18', name: 'Aisha Rahman', email: 'aisha.rahman@example.com', initials: 'AR', joinedAt: '2026-07-14', trips: 4, totalSpend: 121000, status: 'suspended', role: 'traveler', country: 'UAE', lastActive: '2026-07-14' },
]

export const adminUserStatusOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
]

export const adminUserRoleOptions = [
  { value: 'all', label: 'All roles' },
  { value: 'traveler', label: 'Traveler' },
  { value: 'creator', label: 'Creator' },
  { value: 'admin', label: 'Admin' },
]

export const adminUserSortOptions = [
  { value: 'recent', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'trips', label: 'Most trips' },
  { value: 'spend', label: 'Highest spend' },
]
