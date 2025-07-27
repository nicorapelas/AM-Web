import React, { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import BackButton from '../../common/backButton/BackButton'
import './header.css'
import { Context as AuthContext } from '../../../context/AuthContext'
import { Context as StoresContext } from '../../../context/StoresContext'
import { Context as FinancialsContext } from '../../../context/FinancialsContext'
import { Context as GamesContext } from '../../../context/GamesContext'
import { Context as StaffContext } from '../../../context/StaffContext'
import logo from '../../../assets/images/logo/arcadeManagerLogoLong.png'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const {
    state: { user },
    signout,
  } = useContext(AuthContext)

  const {
    state: { storeSelected, userStores, storeToEdit },
  } = useContext(StoresContext)

  const {
    state: { storeFinancials },
  } = useContext(FinancialsContext)

  const {
    state: { storeGames },
  } = useContext(GamesContext)

  const {
    state: { storeStaff },
  } = useContext(StaffContext)

  const handleSignOut = () => {
    navigate('/')
    signout()
  }

  const handleAddNewGame = () => {
    navigate('/add-game')
  }

  const handleAddNewStore = () => {
    navigate('/add-store')
  }

  const handleAddNewFinancial = () => {
    navigate('/add-financial')
  }

  const handleAddNewStaff = () => {
    navigate('/add-staff')
  }

  const handleLogoClick = () => {
    navigate('/dashboard')
  }

  const handleManageAccount = () => {
    navigate('/manage-account')
  }

  const handleContactSupport = () => {
    navigate('/contact-support')
  }

  const renderLeft = () => {
    switch (location.pathname) {
      case '/dashboard':
        return null
      case '/stores':
        return <BackButton to="/dashboard" />
      case '/store-details':
        return <BackButton to="/stores" />
      case '/add-game':
        return storeGames && storeGames.length > 0 ? (
          <BackButton to="/games" />
        ) : (
          <BackButton to="/store-details" />
        )
      case '/games':
        return <BackButton to="/store-details" />
      case '/add-financial':
        return storeFinancials && storeFinancials.length > 0 ? (
          <BackButton to="/financials" />
        ) : (
          <BackButton to="/store-details" />
        )
      case '/financials':
        return <BackButton to="/store-details" />
      case '/financial-detail':
        return <BackButton to="/financials" />
      case '/edit-game':
        return <BackButton to="/games" />
      case '/edit-store':
        return <BackButton to="/stores" />
      case '/add-staff':
        return storeStaff && storeStaff.length > 0 ? (
          <BackButton to="/staff" />
        ) : (
          <BackButton to="/store-details" />
        )
      case '/staff':
        return <BackButton to="/store-details" />
      case '/add-store':
        return userStores && userStores.length > 0 ? (
          <BackButton to="/stores" />
        ) : (
          <BackButton to="/dashboard" />
        )
      case '/edit-financial':
        return <BackButton to="/financials" />
      case '/edit-staff':
        return <BackButton to="/staff" />
      case '/manage-account':
        return <BackButton to="/dashboard" />
      case '/billing':
        return <BackButton to="/add-store" />
      case '/all-billing-history':
        return <BackButton to="/manage-account" />
      case '/contact-support':
        return <BackButton to="/dashboard" />
      default:
        break
    }
  }

  const renderCenter = () => {
    switch (location.pathname) {
      case '/dashboard':
        return <div className="nav-header-title">Arcade Manager Dashboard</div>
      case '/stores':
        return <div className="nav-header-title">Arcade Stores</div>
      case '/store-details':
        return (
          <div className="nav-header-title-container">
            <div className="nav-header-title">Store Details</div>
            <div className="nav-header-title-store-name">
              {storeSelected && storeSelected.storeName}
            </div>
          </div>
        )
      case '/add-game':
        return (
          <div className="nav-header-title-container">
            <div className="nav-header-title">Add New Game</div>
            <div className="nav-header-title-store-name">
              {storeSelected && storeSelected.storeName}
            </div>
          </div>
        )
      case '/games':
        return (
          <div className="nav-header-title-container">
            <div className="nav-header-title">Arcade Games</div>
            <div className="nav-header-title-store-name">
              {storeSelected && storeSelected.storeName}
            </div>
          </div>
        )
      case '/add-financial':
        return (
          <div className="nav-header-title-container">
            <div className="nav-header-title">Add Financial Record</div>
            <div className="nav-header-title-store-name">
              {storeSelected && storeSelected.storeName}
            </div>
          </div>
        )
      case '/financials':
        return (
          <div className="nav-header-title-container">
            <div className="nav-header-title">Financial Records</div>
            <div className="nav-header-title-store-name">
              {storeSelected && storeSelected.storeName}
            </div>
          </div>
        )
      case '/financial-detail':
        return (
          <div className="nav-header-title-container">
            <div className="nav-header-title">Financial Record Details</div>
            <div className="nav-header-title-store-name">
              {storeSelected && storeSelected.storeName}
            </div>
          </div>
        )
      case '/edit-game':
        return (
          <div className="nav-header-title-container">
            <div className="nav-header-title">Edit Game</div>
            <div className="nav-header-title-store-name">
              {storeSelected && storeSelected.storeName}
            </div>
          </div>
        )
      case '/edit-store':
        return (
          <div className="nav-header-title-container">
            <div className="nav-header-title">Edit Store</div>
            <div className="nav-header-title-store-name">
              {storeToEdit && storeToEdit.storeName}
            </div>
          </div>
        )
      case '/add-staff':
        return (
          <div className="nav-header-title-container">
            <div className="nav-header-title">Add New Staff</div>
            <div className="nav-header-title-store-name">
              {storeSelected && storeSelected.storeName}
            </div>
          </div>
        )
      case '/staff':
        return (
          <div className="nav-header-title-container">
            <div className="nav-header-title">Staff Members</div>
            <div className="nav-header-title-store-name">
              {storeSelected && storeSelected.storeName}
            </div>
          </div>
        )
      case '/add-store':
        return (
          <div className="nav-header-title-container">
            <div className="nav-header-title">Add New Store</div>
          </div>
        )
      case '/edit-financial':
        return (
          <div className="nav-header-title-container">
            <div className="nav-header-title">Edit Financial Record</div>
          </div>
        )
      case '/edit-staff':
        return (
          <div className="nav-header-title-container">
            <div className="nav-header-title">Edit Staff Member</div>
          </div>
        )
      case '/manage-account':
        return (
          <div className="nav-header-title-container">
            <div className="nav-header-title">Manage Account</div>
          </div>
        )
      case '/billing':
        return (
          <div className="nav-header-title-container">
            <div className="nav-header-title">Billing</div>
          </div>
        )
      case '/all-billing-history':
        return (
          <div className="nav-header-title-container">
            <div className="nav-header-title">Billing History</div>
          </div>
        )
      case '/contact-support':
        return (
          <div className="nav-header-title-container">
            <div className="nav-header-title">Contact Support</div>
          </div>
        )
      default:
        break
    }
  }

  const renderRight = () => {
    switch (location.pathname) {
      case '/dashboard':
        return (
          <button className="nav-signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        )
      case '/stores':
        return (
          <button className="nav-header-right-btn" onClick={handleAddNewStore}>
            + Add New Store
          </button>
        )
      case '/games':
        return (
          <button className="nav-header-right-btn" onClick={handleAddNewGame}>
            + Add New Game
          </button>
        )
      case '/financials':
        return (
          <button
            className="nav-header-right-btn"
            onClick={handleAddNewFinancial}
          >
            + Add New Financial Record
          </button>
        )
      case '/staff':
        return (
          <button className="nav-header-right-btn" onClick={handleAddNewStaff}>
            + Add New Staff
          </button>
        )
      default:
        break
    }
  }
  return (
    <div>
      <div className="nav-header-top-container">
        <img
          src={logo}
          alt="logo"
          className="nav-header-logo"
          onClick={handleLogoClick}
        />
        <div className="nav-header-username-container">
          <div className="nav-header-username">{user && user.username}</div>
        </div>
        <div className="nav-header-right-btn-bed">
          <div className="nav-header-right-btn-container">
            {userStores && userStores.length > 1 && (
              <button
                className={
                  location.pathname === '/manage-account' ||
                  userStores.length < 1
                    ? 'nav-header-right-account-btn-hidden'
                    : 'nav-header-right-account-btn'
                }
                onClick={handleContactSupport}
              >
                Support
              </button>
            )}
            <button
              className={
                location.pathname === '/manage-account' || userStores.length < 1
                  ? 'nav-header-right-account-btn-hidden'
                  : 'nav-header-right-account-btn'
              }
              onClick={handleManageAccount}
            >
              Account
            </button>
          </div>
        </div>
      </div>
      <div className="nav-header-bed">
        <div className="nav-header-container">
          <div className="nav-header-left">{renderLeft()}</div>
          <div className="nav-header-center">{renderCenter()}</div>
          <div className="nav-header-right">{renderRight()}</div>
        </div>
      </div>
    </div>
  )
}

export default Header
