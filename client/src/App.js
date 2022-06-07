import React, { useEffect, useState } from 'react'
import { Routes, useLocation, useNavigate } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Site from './components/Site'
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

export default function App() {
  const [user, setUser] = useState({})
  const navigate = useNavigate()
  const location = useLocation()

  const isUserLoggedIn = async () => {
    const res = await fetch('http://localhost:1000/users/isLoggedIn', {
      credentials: "include"
    })
    const user = await res.json()

    if (res.status === 200) {
      // if user is not logged in only 2 routes are possible:'/login' or 'register'
      //if user try to get another url will be navigate to '/login'
      if (!user.loggedIn && (location.pathname !== '/login' && location.pathname !== '/register')) {
        navigate('/login')
      }
      else {
        setUser(user)
      }
    }
  }

  useEffect(() => {
    isUserLoggedIn()
  }, [])

  return (
    <div className='app'>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <Routes>
          <Route path='/*' element={<Site setUser={setUser} user={user} />} />
          <Route path='/login' element={<Login setUser={setUser} />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </LocalizationProvider>
    </div>
  )
}
