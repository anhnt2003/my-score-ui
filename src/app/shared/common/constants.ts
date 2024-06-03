export const DefaultPagingOptions = {
    pageSize: 5,
    pageSizeOptions: [5, 10, 15]
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