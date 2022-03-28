function ProcessSigmyzeData(data, dataset) {
    let cData = []

    for(let i = 0; i < data.length; i++) {
        let obj = {}
        let dt  = new Date(data[i]["date"])

        if(dataset == "WEO")
            obj['date'] = dt.getUTCFullYear()
        if(dataset == "COVID")
            obj['date'] = dt
        
        obj['value'] = data[i]["value"]
        cData.push(obj)
    }

    return cData
}

export { ProcessSigmyzeData }