import { v4 } from "uuid"
import { ITextNode } from "./types"

function ConvertToInput(textNodes: ITextNode[]) {
    let output = ""
    for(let i = 0; i < textNodes.length; i++) {
        let textNode = textNodes[i]
        
        if(textNode.type === "text")
            output += textNode.value
        if(textNode.type === "div")
            output += textNode.value
    }

    return output
}

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

function placeCaretAtEnd(el: HTMLDivElement) {
    if(typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
        let range = document.createRange()
        range.selectNodeContents(el)
        range.collapse(false)
        let sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
    }
}

function getCaretCoordinates() {
    const selection = document.getSelection()
    const r = selection?.getRangeAt(0)!
    let rect, r2

    const node = r?.startContainer as any
    const offset = r?.startOffset
    if(offset > 0) {
        r2 = document.createRange()
        r2.setStart(node, (offset - 1))
        r2.setEnd(node, offset)

        rect = r2.getBoundingClientRect()
        return { x: rect.right, y: rect.top }
    } else if(offset < node.length) {
        r2 = document.createRange()

        r2.setStart(node, offset)
        r2.setEnd(node, (offset + 1))
        rect = r2.getBoundingClientRect()
        return { x: rect.left, y: rect.top }
    } else {
        rect = node.getBoundingClientRect()
        const styles = getComputedStyle(node)
        const lineHeight = parseInt(styles.lineHeight)
        const fontSize = parseInt(styles.fontSize)

        const delta = (lineHeight - fontSize) / 2
        return { x: rect.left, y: (rect.top + delta) }
    }

    return { x: 0, y: 0}
}

export { 
    ParseContentInput,
    ConvertToInput,
    placeCaretAtEnd,
    getCaretCoordinates 
}