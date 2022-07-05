import WEOLogo from '../../assets/imf.png'

function ParseWEOData(data) {
    let t_data = []
    for(let i = 0; i < data.length; i++) {
        let dp = data[i]
        dp['date'] = new Date(dp['date'], 1)
        t_data.push(dp)
    }

    return t_data
}

const Datasets_Table = {
    'weo': "World Economic Outlook"
}

const Logo_Table = {
    'weo': WEOLogo
}

export default ParseWEOData
export { Datasets_Table, Logo_Table }