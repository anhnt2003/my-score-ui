export const DefaultPagingOptions = {
    pageSize: 30,
    pageSizeOptions: [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 15, value: 15 }
    ]
}



export const ChartOptions = {
    indexAxis: 'y',
    plugins: {
        legend: {
            labels: {
                color: '#black'
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#black'
            },
            grid: {
                color: 'rgba(255,255,255,0.2)'
            }
        },
        y: {
            ticks: {
                color: '#black'
            },
            grid: {
                color: 'rgba(255,255,255,0.2)'
            }
        }
    }
}