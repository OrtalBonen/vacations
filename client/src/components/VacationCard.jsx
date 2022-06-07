import { Badge, Card, CardActions, CardContent, CardMedia, IconButton, Typography } from '@mui/material'
// import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import moment from "moment-timezone"
export default function VacationCard({ vacation, user, setUpdate }) {

    const navigate = useNavigate()

    const deleteVacation = async () => {
        const res = await fetch(`http://localhost:1000/feed/${vacation.id}`, {
            method: "DELETE",
            headers: { "content-type": "application/json" },
            credentials: "include"
        })
        if (res.status === 201) {
            setUpdate(upd => !upd)
        }
    }

    const addOrRemoveFollow = async () => {
        const str = vacation.isUserFollow ? "unFollow" : "follow"
        const res = await fetch(`http://localhost:1000/feed/${str}/${vacation.id}`, {
            method: "PUT",
            credentials: "include"
        })
        if (res.status === 201) {
            setUpdate(upd => !upd)
        }
    }

    return (
        <Card sx={{ width: 345 }}>
            <CardMedia
                component="img"
                height="200"

                image={vacation.img_src}
                alt={`${vacation.destination} image`}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {vacation.destination}
                </Typography>
                <Typography gutterBottom >
                    {moment(vacation.start).format("DD/MM/YYYY")} - {moment(vacation.end).format("DD/MM/YYYY")}
                </Typography><Typography variant="body2" color="text.secondary" sx={{ height: 60 }}>
                    {vacation.description}
                </Typography>
                {
                    user.isAdmin ?
                        <Typography variant='h5' sx={{
                            marginLeft: "auto",
                            marginTop: '12px',
                            display: 'flex',
                            alignItems: "center",
                        }}>
                            ${vacation.price}
                        </Typography> : ""
                }
            </CardContent>
            <CardActions disableSpacing>
                {
                    user.isAdmin ?
                        <>
                            <Typography>{vacation.follows ? vacation.follows : "No"} likes </Typography>
                            <IconButton sx={{ marginLeft: "auto" }} size="medium"
                                onClick={() => navigate(`vacation/${vacation.id}`)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton size="large" onClick={() => deleteVacation()}><DeleteForeverIcon /></IconButton>
                        </>
                        :
                        <>
                            <IconButton size="large"
                                onClick={() => { addOrRemoveFollow() }}
                            >
                                <Badge badgeContent={vacation.follows} color="primary">
                                    {
                                        vacation.isUserFollow ?
                                            <FavoriteIcon color="secondary" /> :
                                            <FavoriteBorderIcon />
                                    }
                                </Badge>
                            </IconButton>

                            <Typography variant='h5' sx={{
                                marginLeft: "auto",
                                display: 'flex',
                                alignItems: "center"
                            }}>
                                ${vacation.price}
                            </Typography>
                        </>
                }
            </CardActions>
        </Card >
    )
}
