import React, { useContext, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import LoaderFullScreen from './components/common/loaders/fullScreenLoader/LoaderFullScreen'
import NotFound from './components/common/notFound/NotFound'
import SignupHR from './components/screens/authScreens/signup/Signup'
import Login from './components/screens/authScreens/login/Login'
import Dashboard from './components/screens/dashboard/Dashboard'
import InitDataFetch from './components/InitDataFetch'
import CheckoutPage from './components/screens/checkout/Checkout'
import PaymentSuccess from './components/screens/checkout/PaymentSuccess'
import PaymentCancelled from './components/screens/checkout/PaymentCancelled'
import Home from './components/screens/home/Home'
import NetworkError from './components/common/netoworkError/NetworkError'
import Stores from './components/screens/stores/Stores'
import AddStore from './components/screens/addStore/AddStore'
import EditStore from './components/screens/editStore/EditStore'
import StoreDetails from './components/screens/storeDetails/StoreDetails'
import Games from './components/screens/games/Games'
import AddGame from './components/screens/addGame/AddGame'
import EditGame from './components/screens/editGame/EditGame'
import Financial from './components/screens/financial/Financial'
import AddFinancial from './components/screens/addFinancial/AddFinancial'
import FinancialDetail from './components/screens/financialDetail/FinancialDetail'
import EditFinancial from './components/screens/editFinancial/EditFinancial'
import AddStaff from './components/screens/addStaff/AddStaff'
import Staff from './components/screens/staff/Staff'
import StaffDashboard from './components/screens/staffDashboard/StaffDashboard'
import EditStaff from './components/screens/editStaff/EditStaff'
import { Context as AuthContext } from './context/AuthContext'

const AppRouter = () => {
  const {
    state: { user, token, isAuthChecked },
    tryLocalSignin,
    fetchUser,
    setIsAuthChecked,
    setStaffCredentials,
  } = useContext(AuthContext)

  const protectedRoute = (Component) => {
    if (!token) {
      return <Navigate to="/" replace />
    }

    // Redirect staff users to staff dashboard if they try to access other routes
    // except for FinancialDetail and AddFinancial
    if (
      user?.staffCreds &&
      Component !== StaffDashboard &&
      Component !== FinancialDetail &&
      Component !== AddFinancial &&
      Component !== EditFinancial
    ) {
      return <Navigate to="/staff-dashboard" replace />
    }

    return <Component />
  }

  useEffect(() => {
    if (!isAuthChecked) {
      const checkAuth = async () => {
        await tryLocalSignin()
        setIsAuthChecked(true)
      }
      checkAuth()
    }
  }, [isAuthChecked])

  useEffect(() => {
    if (token) {
      fetchUser()
    }
  }, [token])

  useEffect(() => {
    if (user?.staffCreds) {
      setStaffCredentials(user.staffCreds)
    }
  }, [user])

  // Don't render routes until we've checked auth
  if (!isAuthChecked) {
    return <LoaderFullScreen />
  }

  const router = () => {
    return (
      <>
        <InitDataFetch />
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={token ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route
              path="/signup"
              element={
                token ? <Navigate to="/dashboard" replace /> : <SignupHR />
              }
            />
            <Route path="/network-error" element={<NetworkError />} />

            {/* Protected routes - only accessible with token */}
            {token && (
              <>
                {/* Staff Route */}
                <Route
                  path="/staff-dashboard"
                  element={
                    user?.staffCreds ? (
                      <StaffDashboard />
                    ) : (
                      <Navigate to="/dashboard" replace />
                    )
                  }
                />

                {/* All other protected routes */}
                <Route path="/dashboard" element={protectedRoute(Dashboard)} />
                <Route path="/stores" element={protectedRoute(Stores)} />
                <Route path="/add-store" element={protectedRoute(AddStore)} />
                <Route path="/edit-store" element={protectedRoute(EditStore)} />
                <Route
                  path="/store-details"
                  element={protectedRoute(StoreDetails)}
                />
                <Route path="/games" element={protectedRoute(Games)} />
                <Route path="/add-game" element={protectedRoute(AddGame)} />
                <Route path="/edit-game" element={protectedRoute(EditGame)} />
                <Route path="/financials" element={protectedRoute(Financial)} />
                <Route
                  path="/add-financial"
                  element={protectedRoute(AddFinancial)}
                />
                <Route
                  path="/financial-detail"
                  element={protectedRoute(FinancialDetail)}
                />
                <Route
                  path="/edit-financial"
                  element={protectedRoute(EditFinancial)}
                />
                <Route path="/add-staff" element={protectedRoute(AddStaff)} />
                <Route path="/staff" element={protectedRoute(Staff)} />
                <Route path="/edit-staff" element={protectedRoute(EditStaff)} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route
                  path="/payment-cancelled"
                  element={<PaymentCancelled />}
                />
              </>
            )}

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </>
    )
  }

  return router()
}

export default AppRouter
