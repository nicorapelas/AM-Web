import React from 'react'
import { Provider as AuthProvider } from './context/AuthContext'
import { Provider as CommonProvider } from './context/CommonContext'
import { Provider as YocoProvider } from './context/YocoContext'
import { Provider as StoresProvider } from './context/StoresContext'
import { Provider as GamesProvider } from './context/GamesContext'
import { Provider as FinancialsProvider } from './context/FinancialsContext'
import { Provider as StaffProvider } from './context/StaffContext'
import AppRouter from './AppRouter'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <CommonProvider>
        <YocoProvider>
          <StoresProvider>
            <GamesProvider>
              <FinancialsProvider>
                <StaffProvider>
                  <div className="app-container">
                    <div className="scanline"></div>
                    <div className="grid-overlay"></div>
                    <AppRouter />
                  </div>
                </StaffProvider>
              </FinancialsProvider>
            </GamesProvider>
          </StoresProvider>
        </YocoProvider>
      </CommonProvider>
    </AuthProvider>
  )
}

export default App
