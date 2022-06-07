import { Container } from '@mui/material'
import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import AddVacation from './AddVacation'
import Chart from './Chart'
import EditVacation from './EditVacation'
import Feed from './Feed'
import Page404 from './Page404'

export default function Main({ user }) {
    const [update, setUpdate] = useState(false)

    return (
        <Container className='main'>
            <Routes>
                <Route exact path='/' element={<Feed update={update} user={user} setUpdate={setUpdate} />} />
                {
                    user.isAdmin ?
                        <>
                            <Route path='new' element={<AddVacation setUpdate={setUpdate} />} />
                            <Route path='vacation/:vacationId' element={<EditVacation setUpdate={setUpdate} />} />
                            <Route path='chart' element={<Chart />} />
                            <Route path='*' element={<Page404 />} />
                        </>
                        : ""
                }
            </Routes>
        </Container>
    )
}
