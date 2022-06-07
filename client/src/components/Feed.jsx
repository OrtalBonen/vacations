import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import VacationCard from './VacationCard'
import AddIcon from '@mui/icons-material/Add';

export default function Feed({ update, setUpdate, user }) {
    const [vacations, setVacations] = useState([])
    const navigate = useNavigate()

    const getVacations = async () => {
        const res = await fetch(`http://localhost:1000/feed/${user.isAdmin ? "admin" : "user"}`, {
            credentials: "include"
        })
        const data = await res.json()

        if (res.status === 200) {
            setVacations(data)
        }
    }

    useEffect(() => {
        if (user.loggedIn) {
            getVacations()
        }

    }, [update, user])

    return (
        <Grid container spacing={3} justifyContent="flexStart" p={3}>
            {
                user.isAdmin ? <button className='addBtn centerFlex' onClick={() => navigate('new')}><AddIcon /></button> : ""
            }
            {vacations.map(vacation =>
                <Grid item key={vacation.id}>
                    <VacationCard key={vacation.id} vacation={vacation} user={user} setUpdate={setUpdate}>
                    </VacationCard>
                </Grid>
            )}
        </Grid >
    )
}


