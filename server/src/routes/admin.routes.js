const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticate = require('../middleware/auth');
const prisma = new PrismaClient();

const router = express.Router();

router.get('/data', authenticate, async (req, res) => {
  try {
    // Check if admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const totalUsers = await prisma.user.count();
    const totalTrips = await prisma.trip.count();
    const activeTrips = await prisma.trip.count({ where: { status: 'ONGOING' } });
    const allExpenses = await prisma.expense.aggregate({ _sum: { amount: true } });
    const revenue = allExpenses._sum.amount || 0;

    const recentUsers = await prisma.user.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true,
        _count: { select: { trips: true } }
      }
    });

    const recentTrips = await prisma.trip.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        _count: { select: { tripStops: true } },
        expenses: { select: { amount: true } }
      }
    });

    const allUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { trips: true } }
      }
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalUsersDelta: 5.2,
          totalTrips,
          totalTripsDelta: 10.1,
          activeTrips,
          activeTripsDelta: 1.5,
          revenue,
          revenueDelta: 4.2
        },
        recentUsers: recentUsers.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          initials: u.name.substring(0, 2).toUpperCase(),
          joinedAt: u.createdAt,
          trips: u._count.trips,
          status: 'active'
        })),
        recentTrips: recentTrips.map(t => ({
          id: t.id,
          name: t.name,
          owner: t.user.name,
          destinations: t._count.tripStops,
          startDate: t.startDate,
          budget: t.expenses.reduce((sum, e) => sum + Number(e.amount), 0),
          status: t.status.toLowerCase()
        })),
        allUsers: allUsers.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          initials: u.name.substring(0, 2).toUpperCase(),
          joinedAt: u.createdAt,
          trips: u._count.trips,
          totalSpend: 0, // Placeholder
          status: 'active',
          role: u.role.toLowerCase(),
          country: u.country || 'Unknown',
          lastActive: u.updatedAt
        }))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
