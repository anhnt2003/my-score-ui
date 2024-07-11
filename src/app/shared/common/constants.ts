export const DefaultPagingOptions = {
    pageSize: 30,
    pageSizeOptions: [
        { label: 10, value: 5 },
        { label: 20, value: 10 },
        { label: 30, value: 15 }
    ]
}

export enum SortOrderOptions {
    ASC = 1,
    DESC = -1
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