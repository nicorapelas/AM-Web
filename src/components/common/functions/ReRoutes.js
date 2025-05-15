import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context as StoresContext } from '../../../context/StoresContext'

const ReRoutes = () => {
  const navigate = useNavigate()

  const {
    state: { userStores },
  } = useContext(StoresContext)

  useEffect(() => {
    if (!userStores || userStores.length === 0) {
      navigate('/dashboard')
    }
  }, [userStores])
}

export default ReRoutes
