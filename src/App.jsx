import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MyTrips from './pages/MyTrips'
import CreateTrip from './pages/CreateTrip'
import TripDetails from './pages/TripDetails'
import ItineraryBuilder from './pages/ItineraryBuilder'
import BudgetBreakdown from './pages/BudgetBreakdown'
import Calendar from './pages/Calendar'
import CitySearch from './pages/CitySearch'
import ActivitySearch from './pages/ActivitySearch'
import Community from './pages/Community'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminTrips from './pages/AdminTrips'
import AdminDestinations from './pages/AdminDestinations'
import AdminActivities from './pages/AdminActivities'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminSettings from './pages/AdminSettings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trips" element={<MyTrips />} />
            <Route path="/trips/create" element={<CreateTrip />} />
            <Route path="/trips/:id" element={<TripDetails />} />
            <Route path="/trips/:id/itinerary" element={<ItineraryBuilder />} />
            <Route path="/trips/:id/budget" element={<BudgetBreakdown />} />
            <Route path="/trips/:id/calendar" element={<Calendar />} />
            <Route path="/search/cities" element={<CitySearch />} />
            <Route path="/search/activities" element={<ActivitySearch />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="trips" element={<AdminTrips />} />
            <Route path="destinations" element={<AdminDestinations />} />
            <Route path="activities" element={<AdminActivities />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
