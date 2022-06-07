import { Box, Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import DateRangePicker from '@mui/lab/DateRangePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

export default function AddVacation({ setUpdate }) {

    const [destination, setDestination] = useState("")
    const [description, setDescription] = useState("")
    const [img_src, setImg_src] = useState("")
    const [vacationDates, setVacationDates] = useState([null, null])
    const [price, setPrice] = useState("")

    const navigate = useNavigate()

    const addVacation = async () => {
        // I didn't found how to register date range picker to validation
        if (vacationDates.includes(null)) {
            return
        }

        const startDate = vacationDates[0].format('YYYY-MM-DD');
        const endDate = vacationDates[1].format('YYYY-MM-DD');

        const res = await fetch(`http://localhost:1000/feed/new`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ destination, description, img_src, start: startDate, end: endDate, price }),
            credentials: "include"
        })
        // const data = await res.json()
        if (res.status === 201) {
            setUpdate(upd => !upd)
            navigate('/')
        }
    }

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            firstName: "",
            lastName: ""
        },
        mode: 'onBlur',
    })

    const onErrors = errors => console.error(errors)

    return (
        <div className="container centerFlex">
            <form className='border' noValidate onSubmit={handleSubmit(addVacation, onErrors)}>
                <Box className="titleForm">  Add Vacation</Box>

                <TextField
                    id="destination"
                    label="Destination"
                    type="text"
                    variant="filled"
                    required
                    fullWidth
                    onInput={e => setDestination(e.target.value)}
                    error={errors.destination ? true : false}
                    {...register("destination", {
                        required: "Destination is required",
                        minLength: {
                            value: 2,
                            message: "Destination must be at least 2 letters"
                        }
                    })}
                />
                <Box className="error">
                    {errors.destination?.message}
                </Box>

                <TextField
                    id="description"
                    label="Description"
                    multiline
                    minRows={3}
                    maxRows={3}
                    variant="filled"
                    fullWidth
                    onInput={e => setDescription(e.target.value)}
                    required
                    error={errors.description ? true : false}
                    {...register("description", {
                        required: "Description is required",
                        minLength: {
                            value: 2,
                            message: "Description must be at least 2 letters"
                        },
                        maxLength: {
                            value: 150,
                            message: "Description max length is 150 characters"
                        }
                    })}
                />
                <Box className="error">
                    {errors.description?.message}
                </Box>

                <TextField
                    id="img_src"
                    defaultValue={img_src}
                    label="Img url"
                    type="text"
                    variant="filled"
                    fullWidth
                    required
                    onInput={e => setImg_src(e.target.value)}
                    error={errors.img_src ? true : false}
                    {...register("img_src", {
                        required: "Img url is required",
                    })}
                />
                <Box className="error">
                    {errors.img_src?.message}
                </Box>

                <LocalizationProvider dateAdapter={DateAdapter}>
                    <DateRangePicker
                        value={vacationDates}
                        inputFormat="DD/MM/yyyy"
                        startText="Check-in"
                        endText="Check-out"
                        fullWidth
                        onChange={(newValue) => {
                            setVacationDates(newValue)
                        }}
                        disablePast
                        renderInput={(startProps, endProps) => (
                            <React.Fragment>
                                <TextField {...startProps} />
                                <Box sx={{ mx: 2 }}> to </Box>
                                <TextField {...endProps} />
                            </React.Fragment>
                        )}
                    />
                </LocalizationProvider>
                <Box className="error">
                    {errors.vacationDates?.message}
                </Box>

                <TextField
                    id="price"
                    defaultValue={price}
                    label="Price"
                    type="number"
                    variant="filled"
                    fullWidth
                    required
                    onInput={e => setPrice(e.target.valueAsNumber)}
                    error={errors.price ? true : false}
                    {...register("price", {
                        required: "Price is required",
                        min: {
                            value: 1,
                            message: "Price must be bigger then 0"
                        },
                    })}
                />
                <Box className="error">
                    {errors.price?.message}
                    {(typeof price.value === 'bigint') ? "work" : ""}
                </Box>

                <Button type='submit' xs={{ textTransform: "lowerCase" }} variant="contained">Add vacation</Button>
                <Button onClick={() => navigate('/')}>cancel</Button>
            </form>
        </div >
    )
}
