import { useEffect, useContext } from 'react'
import { Context as AuthContext } from '../context/AuthContext'
import { Context as StoresContext } from '../context/StoresContext'
import { Context as GamesContext } from '../context/GamesContext'
import { Context as FinancialsContext } from '../context/FinancialsContext'
import { Context as StaffContext } from '../context/StaffContext'

const InitDataFetch = () => {
  const {
    state: { user },
  } = useContext(AuthContext)

  const {
    state: { storeSelected },
    fetchUserStores,
  } = useContext(StoresContext)

  const { fetchUserGames, fetchStoreGames } = useContext(GamesContext)

  const { fetchUserFinancials } = useContext(FinancialsContext)

  const { fetchStoreStaff } = useContext(StaffContext)

  useEffect(() => {
    if (user) {
      fetchUserStores()
      fetchUserGames()
      fetchUserFinancials()
    }
  }, [user])

  useEffect(() => {
    if (storeSelected) {
      const { _id } = storeSelected
      fetchStoreGames({ storeId: _id })
      fetchStoreStaff({ storeId: _id })
    }
  }, [storeSelected])

  return null
}

export default InitDataFetch
