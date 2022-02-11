export const DROPDOWN = {
    dates: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
    months: [{ id: '01', name: 'Jan' }, { id: '02', name: 'Feb' }, { id: '03', name: 'Mar' }, { id: '04', name: 'Apr' }, { id: '05', name: 'May' }, { id: '06', name: 'Jun' }, { id: '07', name: 'Jul' }, { id: '08', name: 'Aug' }, { id: '09', name: 'Sept' }, { id: '10', name: 'Oct' }, { id: '11', name: 'Nov' }, { id: '12', name: 'Dec' }],
    years: generateArrayOfYears(),
    nextYears: generateArrayOfNextYears(),
    gender: [{ id: '0', name: 'Male' }, { id: '1', name: 'Female' }, { id: '2', name: 'Other' }],
    genderVendor: [{ id: 'male', name: 'Male' }, { id: 'female', name: 'Female' }, { id: 'other', name: 'Other' }]
}

function generateArrayOfYears() {
    let max = new Date().getFullYear()
    let min = max - 80;
    let years = []

    for (let i = max; i >= min; i--) {
        years.push(i)
    }
    return years
}

function generateArrayOfNextYears() {
    let min = new Date().getFullYear()
    let max = min + 20;
    let nextYears = []
    for (let i = min; i <= max; i++) {
        nextYears.push(i)
    }
    return nextYears
}