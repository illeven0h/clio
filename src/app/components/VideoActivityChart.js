"use client";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function VideoActivityChart({ labels, counts }) {
    const data = {
        labels,
        datasets: [
            {
                label: "Videos Generated",
                data: counts,
                fill: false,
                borderColor: "#ff9800",
                tension: 0.2,
                pointRadius: 5,
                pointHoverRadius: 6,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: "index",
                intersect: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Date",
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
                title: {
                    display: true,
                    text: "Videos",
                },
            },
        },
        elements: {
            line: {
                tension: 0.2,
            },
        },
    };

    return <Line data={data} options={options} />;
}
