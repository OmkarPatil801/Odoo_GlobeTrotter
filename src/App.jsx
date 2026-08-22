import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
