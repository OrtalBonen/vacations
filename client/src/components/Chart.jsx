import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS } from "chart.js/auto"; //required

export default function Chart() {
    const [vacationsData, setVacationsData] = useState(null)
    const getOnlyVacationsWithFollows = async () => {
        const res = await fetch('http://localhost:1000/feed/vacations_with_follows', {
            credentials: "include"
        })
        const vacations = await res.json()

        if (res.status === 200 && vacations.length) {
            setVacationsData({
                labels: vacations.map((vacation) => `${vacation.destination} ${vacation.start.split("T")[0]} ${vacation.end.split("T")[0]}`),
                datasets: [
                    {
                        label: "Followers",
                        data: vacations.map((vacation) => vacation.followers),
                        backgroundColor: [
                            "rgba(75,192,192,1)"
                        ],
                        borderColor: "black",
                        borderWidth: 2,
                    },
                ],
            })
        }
    }

    useEffect(() => {
        getOnlyVacationsWithFollows()
    }, [])

    return (
        <div className="chartDiv">  {
            vacationsData ?
                <Bar className="chart"
                    data={vacationsData}
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: "Vacation Followers",
                                font: {
                                    size: 32
                                }
                            }
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    precision: 0
                                }
                            }]
                        }

                    }}
                />
                : <h1 className="loading">Loading data</h1>
        } </div>
    )
}
