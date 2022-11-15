import ParseWEOData     from "../../data/backend/weo-data"
import { GetIndicator } from "../../data/server-interface"

async function HydrateChart(obj) {
    var indicator = obj['indicator']
    var indicator_data = await GetIndicator(indicator['dataset'], indicator['object_id'], indicator['indicator_id'])
    obj['data'] = indicator_data['indicator_data']

    return obj
}

function DehydrateProject(project) {
    var documents = project['project_data']['documents']
    for(var i = 0; i < documents.length; i++) {
        var document = documents[i]
        var content  = document['document_content']
        if(content === "")
            content = []

        for(var x = 0; x < content.length; x++) {
            var block = content[x]

            if(block.tag == "chart") {
                var indicators = []
                if('data' in block) {
                    if('indicators' in block['data'] && block['data']['indicators'] !== undefined)
                        indicators = block['data']['indicators']
                } else
                    block['data'] = {}
                
                for(var z = 0; z < indicators.length; z++) {
                    var indicator     = indicators[z]
                    indicator['data'] = []

                    indicators[z] = indicator
                }

                block['data']['indicators'] = indicators
            }

            content[x] = block
        }

        document['document_content'] = content
        documents[i] = document
    }

    project['project_data']['documents'] = documents
    return project
}

async function rehydrateDocumentContent(content) {
    let nContent = []
    for(let i = 0; i < content.length; i++) {
        var block = content[i]
        if(block.tag == "chart") {
            let indicators = block['data']['indicators']
            for(var z = 0; z < indicators.length; z++) {
                var indicator      = indicators[z]
                var indicator_info = indicator['indicator']
                
                var i_data = []
                var names  = [`${indicator_info['indicator_id']}: ${indicator_info['object_id']}`]
                
                var data = await GetIndicator(indicator_info['dataset'], indicator_info['object_id'], indicator_info['indicator_id'])
                var indicator_data = data.indicator_data
                indicator_data     = ParseWEOData(indicator_data)

                for(var y = 0; y < indicator_data.length; y++) {
                    var point = indicator_data[y]
                    var date  = new Date(point['date'])
                    var val   = point['value']

                    var pkg       = {}
                    pkg['date']   = date
                    pkg[names[0]] = val
                    i_data.push(pkg)
                }
                
                const new_data = {
                    r_data: i_data,
                    names: names
                }

                const nObject = { ...indicator, ...new_data }
                indicators[z] = nObject
            }
            
            block['data']['indicators'] = [...indicators]
        }

        nContent.push(block)
    }

    return nContent
}

async function RehydrateProject(project) {
    var documents  = project['project_data']['documents']
    let nDocuments = []

    for(var i = 0; i < documents.length; i++) {
        var document = documents[i]
        var content  = document['document_content']
        if(content == "")
            content = []
        else
            content = await rehydrateDocumentContent(content)

        document['document_content'] = [...content]
        nDocuments.push(document)
    }

    project['project_data']['documents'] = nDocuments
    return project
}

export { 
    HydrateChart,
    DehydrateProject,
    RehydrateProject 
}