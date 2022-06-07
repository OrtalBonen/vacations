// import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from "react-hook-form";

import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles, Paper, TextField, Typography } from '@mui/material';
import { height } from '@mui/system';
import { useState } from 'react';


export default function Login({ setUser }) {
    const [open, setOpen] = useState(false)

    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            firstName: "",
            lastName: ""
        },
        mode: 'onBlur',
    })

    const logIn = async (data) => {
        const res = await fetch('http://localhost:1000/users/login', {
            method: "POST",
            headers: { "content-type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email: data.email, password: data.password })
        })
        const user = await res.json()
        if (res.status === 200) {
            setUser(user)
            navigate('/')
        }
        if (res.status === 400) {
            setOpen(true)
        }
    }

    const onErrors = errors => console.error(errors)

    return (
        <div className='container  centerFlex'>
            <form noValidate className="border" onSubmit={handleSubmit(logIn, onErrors)}>
                <Box className="titleForm" variant="h4" align="center" gutterBottom>timetofly.com</Box>
                <TextField
                    required
                    id="email"
                    label="Email"
                    type="Email"
                    variant="filled"
                    {...register("email", {
                        required: 'Email is required', pattern: {
                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: 'Email is invalid'
                        }
                    })}
                    error={errors.email ? true : false}
                />
                <Box className="error" >
                    {errors.email?.message}
                </Box>

                <TextField
                    required
                    id="password"
                    label="Password"
                    type="password"
                    variant="filled"
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 4,
                            message: "Password must be 6 to 10 characters"
                        },
                        maxLength: {
                            value: 10,
                            message: "Password must be 6 to 10 characters"
                        }
                    })}
                />
                <Box className="error">
                    {errors.password?.message}
                </Box>
                <Button type='submit' xs={{ textTransform: "lowerCase" }} variant="contained">Log in</Button>
            </form>

            <Box className='signUpLink'>
                <span>Don't have an acoount? </span>
                <Link className="link" to={'/register'} >Sign up</Link>
            </Box>

            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"The email or password are incorrect"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Please try again
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpen(false) }}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
