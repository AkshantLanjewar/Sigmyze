import { 
    IUnparsedIndicator,
    IIndicatorData 
} from '../data/datasets/DatasetsTypes'

export const date_options = { month: 'long', day: 'numeric', year: 'numeric' }
export const date_locale  = "en-US"

async function FindNext(data: Array<any>, index: number, key: string) {
    let value = null
    let i     = index + 1

    while(value === null && i < data.length) {
        let point = data[i]
        if(key in point)
            value = point[key]

        i = i + 1
    }

    return value
}

async function PrepareData(indicators: Array<IUnparsedIndicator>) {
    let unsorted_data = [] as Array<any>
    let identifiers   = [] as Array<string>

    for(let i = 0; i < indicators.length; i++) {
        let indicator    = indicators[i]
        let indicator_id = indicator.indicator.indicator.indicator_id
        let object_id    = indicator.indicator.object.object_id

        let identifier = `${object_id}:${indicator_id}`
        let indi_data  = indicator.indicator_data
        for(let x = 0; x < indi_data.length; x++) {
            let point = indi_data[x]

            let date = new Date(point['year'] as string)
            let val  = point.value as any
            if(typeof val === 'string') {
                if(val === 'NaN')
                    val = null
                else
                    val = parseFloat(val)
            }
                

            const index = unsorted_data.findIndex(element => {
                return element['date'] === date
            })
            
            if(index !== -1 && val !== null) {
                let pkg              = unsorted_data[index]
                pkg[identifier]      = val
                unsorted_data[index] = pkg
            } else if (val !== null) {
                let pkg         = { date: date } as any
                pkg[identifier] = val
                unsorted_data.push(pkg)
            }
        }

        identifiers.push(identifier)
    }

    //look for the holes
    for(let i = 0; i < unsorted_data.length; i++) {
        let point = unsorted_data[i]
        for(let x = 0; x < identifiers.length; x++) {
            let identifier = identifiers[x]
            if(identifier in point === false)
                point[identifier] = await FindNext(unsorted_data, x, identifier)
        }

        unsorted_data[i] = point
    }
    
    unsorted_data.sort(function(a, b) {
        let aDate = a['date']
        let bDate = b['date']

        if(aDate < bDate) return -1
        if(bDate < aDate) return 1
        return 0
    })

    let labels      = []
    let sorted_data = []
    for(let i = 0; i < unsorted_data.length; i++) {
        let point = unsorted_data[i]
        let pkg   = {} as any

        for(let x = 0; x < identifiers.length; x++) {
            let identifier  = identifiers[x]
            pkg[identifier] = point[identifier]
        }

        labels.push(point.date.toLocaleDateString(date_locale, date_options))
        sorted_data.push(pkg)
    }

    let datasets = []
    for(let i = 0; i < identifiers.length; i++) {
        let identifier      = identifiers[i]
        let identifier_data = []

        for(let x = 0; x < sorted_data.length; x++)
            identifier_data.push(sorted_data[x][identifier])
        datasets.push({
            label: identifier,
            data: identifier_data
        })
    }

    return { labels: labels, data: datasets }
}

function toLocaleUTCDateString(date: Date, locales: any, options: any): string {
    const timeDiff = date.getTimezoneOffset() * 60000
    const adjustedDate = new Date(date.valueOf() + timeDiff)
    return adjustedDate.toLocaleDateString(locales, options)
}

export { 
    PrepareData,
    toLocaleUTCDateString 
}