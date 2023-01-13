import { v4 } from "uuid"
import { ITextNode } from "./types"

function ParseContentInput(value: string) {
    let tagActive = false
    let tagName = ''
    let tokens = [
        {
            id: "genesis",
            type: "text",
            value: ""
        }
    ] as ITextNode[]

    for(let i = 0; i < value.length; i++) {
        let character = value[i]
        
        if(character === '<') {
            tagActive = true
            continue
        }
        if(character === '>' && tagActive === true) {
            tagActive = false

            //create the text node
            let node = {} as ITextNode
            node.id = v4()
            node.type = tagName
            node.value = ""
            tagName = ''

            if(node.type[0] === '/') {
                if(i + 1 < value.length && value[i + 1] !== '<')
                    tokens.push({
                        id: v4(),
                        type: "text",
                        value: ""
                    })

                continue
            }

            tokens.push(node)
            continue
        }
        if(tagActive === true) {
            tagName += character
            continue
        }

        //append the text
        tokens[tokens.length - 1].value += character
    }

    //prune the tokens
    let textTokens = [] as ITextNode[]
    for(let i = 0; i < tokens.length; i++) {
        let token = tokens[i]
        if(token.type === "br")
            continue

        textTokens.push(token)
    }

    return textTokens
}

export { ParseContentInput }