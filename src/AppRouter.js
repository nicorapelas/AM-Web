import React, { useContext, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'

import LoaderFullScreen from './components/common/loaders/fullScreenLoader/LoaderFullScreen'
import NotFound from './components/common/notFound/NotFound'
import SignupHR from './components/screens/authScreens/signup/Signup'
import Login from './components/screens/authScreens/login/Login'
import EmailVerified from './components/screens/authScreens/emailVerified/EmailVerified'
import PasswordReset from './components/screens/authScreens/passwordReset/PasswordReset'
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
import ResendVerificationEmail from './components/screens/authScreens/reSendVerifivationEmail/ResendVerificationEmail'
import UpdatePassword from './components/screens/authScreens/updatePassword/UpdatePassword'
import Pricing from './components/screens/pricing/Pricing'
import ManageAccount from './components/screens/manageAccount/ManageAccount'
import Billing from './components/screens/billing/Billing'
import BillingSuccess from './components/screens/billing/BillingSuccess'
import BillingCancel from './components/screens/billing/BillingCancel'
import AllBillingHistory from './components/screens/allBillingHistory/AllBillingHistory'
import ContactSupport from './components/screens/contactSupport/ContactSupport'
import { Context as AuthContext } from './context/AuthContext'
import { Context as GuidedTourContext } from './context/GuidedTourContext'
import GuideNote from './components/common/guideNote/GuideNote'
import guideNotesArray from './components/common/guideNote/guideNotesArray'

// Component to handle guide logic inside Router context
function GuideHandler() {
  const location = useLocation()
  const {
    state: { guideEnabled, guidePartIndex },
    setGuideEnabled,
    setGuidePartIndex,
  } = useContext(GuidedTourContext)

  // Define auth routes where guide should not be shown
  const authRoutes = [
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/password-reset',
    '/email-verified',
    '/resend-verification',
    '/update-password',
    '/network-error',
    '/email-verified',
    '/resend-verification-email',
    '/pricing',
    '/contact-support',
  ]

  // Check if current route is an auth route
  const isAuthRoute = authRoutes.includes(location.pathname)

  const totalSteps = guideNotesArray.length
  const currentStep = guidePartIndex
  const showGuide = guideEnabled && currentStep < totalSteps && !isAuthRoute

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setGuidePartIndex(currentStep + 1)
    } else {
      setGuideEnabled(false)
    }
  }
  const handlePrev = () => {
    if (currentStep > 0) {
      setGuidePartIndex(currentStep - 1)
    }
  }
  const handleClose = () => {
    setGuideEnabled(false)
  }

  return (
    <>
      {showGuide && (
        <GuideNote
          message={guideNotesArray[currentStep].message}
          onNext={handleNext}
          onPrev={currentStep > 0 ? handlePrev : null}
          onClose={handleClose}
          step={currentStep}
          totalSteps={totalSteps}
        />
      )}
    </>
  )
}

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
          <GuideHandler />
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
            <Route
              path="/forgot-password"
              element={
                token ? <Navigate to="/dashboard" replace /> : <PasswordReset />
              }
            />
            <Route path="/reset-password/:token" element={<UpdatePassword />} />
            <Route path="/network-error" element={<NetworkError />} />
            <Route path="/email-verified/:id" element={<EmailVerified />} />
            <Route
              path="/resend-verification-email"
              element={<ResendVerificationEmail />}
            />
            <Route path="/pricing" element={<Pricing />} />
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
                <Route path="/manage-account" element={<ManageAccount />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/billing/success" element={<BillingSuccess />} />
                <Route path="/billing/cancel" element={<BillingCancel />} />
                <Route
                  path="/all-billing-history"
                  element={<AllBillingHistory />}
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
                <Route path="/contact-support" element={<ContactSupport />} />
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
