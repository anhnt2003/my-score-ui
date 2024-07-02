export const DefaultPagingOptions = {
    pageSize: 30,
    pageSizeOptions: [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 15, value: 15 }
    ]
}

const documentStyle = getComputedStyle(document.documentElement);
const textColor = documentStyle.getPropertyValue('--text-color');
const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
export const ChartOptions = {
    plugins: {
        legend: {
            labels: {
                color: textColor
            }
        }
    },
    scales: {
        r: {
            grid: {
                color: textColorSecondary
            },
            pointLabels: {
                color: 'black'
            }
        }
    }
};