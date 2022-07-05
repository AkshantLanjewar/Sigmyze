
function ParseWEOData(data) {
    let t_data = []

    for(let i = 0; i < data.length; i++) {
        let dp = data[i]
        if(dp['value'] == 'NaN' || dp['value'] == null)
            continue
            
        let date = new Date(dp['year'])
        date.setDate(date.getDate() + 1)
        dp['date'] = date.getTime()
        t_data.push(dp)
    }

    return t_data
}

const Datasets_Table = {
    'WEO': "World Economic Outlook"
}

const Logo_Table = {
    'WEO': null
}

export default ParseWEOData
export { Datasets_Table, Logo_Table }