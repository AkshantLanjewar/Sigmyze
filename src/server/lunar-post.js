const fs = require('fs')

function ReadPost(path) {
    let pack = { blogElements: [] }
    const fileLines = fs.readFileSync(path, 'utf-8')
        .split('\n')
        .filter(Boolean)

    let contentStart = false

    for(let i = 0; i < fileLines.length; i++) {
        let line  = fileLines[i]
        let split = line.split(' ')
        
        let indicator = split[0]

        if(indicator == "__TITLE") {
            let nSplit = line.split('=')
            pack["title"] = nSplit[1].trim()
        } else if (indicator == "__AUTHOR") {
            let nSplit = line.split('=')
            pack["author"] = nSplit[1].trim()
        } 
        
        if (indicator == "__CONTENT") {
            contentStart = true
            continue
        }
        if (indicator == "__ENDCONTENT")
            contentStart = false

        if(contentStart) {
            let trimmed_line = line.trim()
            let trim_split = trimmed_line.split(" ")

            let item = { indicator: "__PARAGRAPH", content: "" }

            for(let x = 0; x < trim_split.length; x++) {
                let word = trim_split[x]

                if(word.includes("__")) {
                    item["indicator"] = word
                    continue
                }
                
                item["content"] += word + " "
            }

            item["content"] = item["content"].trim()
            pack["blogElements"].push(item)
        }
    }

    return pack
}

module.exports.ReadPost = ReadPost