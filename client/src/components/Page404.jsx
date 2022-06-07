import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Page404() {
    return (
        <Box className="container centerFlex">
            <Typography variant='h2'>Page not found</Typography>
            <Typography >We are sorry, but this page is not available, please go back
                <Link to={'/'} className='link'> HOME</Link>
            </Typography>
        </Box>
    )
}
