import DateAdapter from '@mui/lab/AdapterMoment'
import DateRangePicker from '@mui/lab/DateRangePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { Button, TextField } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
// import moment from 'moment'
import moment from "moment-timezone"

export default function EditVacation({ setUpdate }) {
    const [destination, setDestination] = useState("")
    const [description, setDescription] = useState("")
    const [img_src, setImg_src] = useState("")
    const [vacationDates, setVacationDates] = useState([null, null])
    const [price, setPrice] = useState("")
    const [isVacationLoaded, setIsVacationLoaded] = useState(false)
    const { vacationId } = useParams()
    const navigate = useNavigate()

    const getVacation = async () => {
        const res = await fetch(`http://localhost:1000/feed/${vacationId}`, {
            credentials: "include"
        })

        const vacation = await res.json()

        if (res.status === 200) {

            const start = moment(vacation.start)
            const end = moment(vacation.end)

            setDestination(vacation.destination)
            setDescription(vacation.description)
            setImg_src(vacation.img_src)
            setVacationDates([start, end])
            setPrice(vacation.price)
            setIsVacationLoaded(true)

        }
    }

    useEffect(() => {
        getVacation()
    }, [])

    const editVacation = async () => {
        const res = await fetch(`http://localhost:1000/feed/${vacationId}`, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ destination, description, img_src, start: vacationDates[0]["_d"], end: vacationDates[1]["_d"], price }),
            credentials: "include"
        })

        if (res.status === 200) {
            setUpdate(upd => !upd)
            navigate('/')
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
            {
                isVacationLoaded ?
                    <>
                        <form className='border' noValidate onSubmit={handleSubmit(editVacation, onErrors)}>
                            <Box className="titleForm"> Edit Vacation</Box>

                            <TextField
                                id="destination"
                                fullWidth
                                defaultValue={destination}
                                onInput={e => setDestination(e.target.value)}
                                label="Destination"
                                type="text"
                                variant="filled"
                                required
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
                                defaultValue={description}
                                label="Description"
                                multiline
                                fullWidth
                                minRows={3}
                                maxRows={3}
                                variant="filled"
                                onInput={e => setDescription(e.target.value)}
                                required
                                error={errors.description ? true : false}
                                {...register("description", {
                                    required: "Description is required",
                                    minLength: {
                                        value: 2,
                                        message: "Description must be at least 2 letters"
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
                                    onChange={(newValue) => {
                                        setVacationDates(newValue);
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

                            <Button type='submit' fullWidth xs={{ textTransform: "lowerCase" }} variant="contained">Edit vacation</Button>
                            <Button fullWidth onClick={() => navigate('/')}>cancel</Button>
                        </form>
                    </>
                    : <h1 className="loading">Loading data</h1>
            }
        </div>
    )
}






















//     return (
//         <div>
//             <input type="tetx" value={destination} placeholder='Destination' onChange={e => setDestination(e.target.value)} />
//             <input type="tetx" value={description} placeholder='Description' onChange={e => setDescription(e.target.value)} />
//             <input type="tetx" value={img_src} placeholder='Img url' onChange={e => setImg_src(e.target.value)} />
//             <input type="date" value={start} onChange={e => setStart(e.target.value)} />
//             <input type="date" value={end} onChange={e => setEnd(e.target.value)} />
//             <input type="number" value={price} placeholder="price" min={1} onChange={e => setEnd(e.target.value)} />
//             <button disabled={(!destination || !description || !img_src || !start || !end || !price)} onClick={() => editVacation()}>OK</button>
//             <button onClick={() => navigate('/')}>Cancel</button>
//         </div >
//     )
// }
