// import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import { useState } from 'react';


export default function Register() {
    const [open, setOpen] = useState(false)

    const navigate = useNavigate()

    const registration = async (data) => {
        const res = await fetch('http://localhost:1000/users/register', {
            method: "POST",
            headers: { "content-type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ firstName: data.firstName, lastName: data.lastName, email: data.email, password: data.password })
        })

        if (res.status === 201) {
            navigate('/login')
        }
        if (res.status === 400) {
            setOpen(true)
        }
    }

    const onErrors = errors => console.error(errors)
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            firstName: "",
            lastName: ""
        },
        mode: 'onBlur',
    })

    return (
        <div className="container centerFlex">

            <form className="border" noValidate onSubmit={handleSubmit(registration, onErrors)}>
                <Box className="titleForm">
                    timetofly.com
                    <Typography color="#78909c">Sign up to see vacations all over the world </Typography>
                </Box>

                <TextField
                    id="firstName"
                    label="First name"
                    type="text"
                    variant="filled"
                    required
                    error={errors.firstName ? true : false}
                    {...register("firstName", {
                        required: "First name is required",
                        minLength: {
                            value: 2,
                            message: "First name must be at least 2 letters"
                        }
                    })}
                />
                <Box className="error">
                    {errors.firstName?.message}
                </Box>

                <TextField
                    id="lastName"
                    label="Last name"
                    type="text"
                    variant="filled"
                    required
                    error={errors.lastName ? true : false}
                    {...register("lastName", {
                        required: "Last name is required",
                        minLength: {
                            value: 2,
                            message: "Last name must be at least 2 letters"
                        }
                    })}
                />
                <Box className="error">
                    {errors.lastName?.message}
                </Box>

                <TextField
                    id="email"
                    label="Email"
                    type="Email"
                    variant="filled"
                    required
                    error={errors.email ? true : false}
                    {...register("email", {
                        required: "Email is required", pattern: {
                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: 'Email is invalid '
                        }
                    })}
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
                    error={errors.password ? true : false}
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 6,
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
                <Button type='submit' xs={{ textTransform: "lowerCase" }} variant="contained">Sign up</Button>
            </form>

            {/* if email already exist the dialog will be open */}
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Email already exist"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Please sign up with another email
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpen(false) }}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

