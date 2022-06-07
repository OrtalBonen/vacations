import { AppBar, Button } from '@mui/material'
import { Box, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BarChartIcon from '@mui/icons-material/BarChart';

export default function Header({ user }) {
    const navigate = useNavigate()
    const logout = async () => {
        const res = await fetch('http://localhost:1000/users/logout', {
            method: "DELETE",
            headers: { "content-type": "application/json" },
            credentials: "include"
        })
        // const data = await res.json()
        if (res.status === 200) {
            navigate('/login')
        }
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Link className="logo" to={"/"}>
                    <Typography variant="h5" component="h1">
                        timetofly.com
                    </Typography>
                </Link>
                <div className="borderRight"></div>
                {user.isAdmin ?
                    <Link className="chartLink" to={"/chart"}>
                        <BarChartIcon fontSize="large" />Chart
                    </Link>
                    : ""}
                <Box className="marginLeftAuto">
                    <span>hello {user.firstName}</span>
                    <Button color="inherit" onClick={() => logout()}> Logout</Button>
                </Box>
            </Toolbar>
        </AppBar >
    )
}
