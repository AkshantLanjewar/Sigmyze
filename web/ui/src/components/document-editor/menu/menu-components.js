import { MdTitle }         from 'react-icons/md'
import { BiImageAlt }      from 'react-icons/bi'
import { BsClipboardData } from 'react-icons/bs'

function ExtractTags(list) {
    let nList = []
    for(let i = 0; i < list.length; i++) {
        let elem = list[i]
        if('tag' in elem)
            nList.push(elem['tag'])
    }

    return nList
}

let multimedia_blocks = [
    {
        type: "Title",
        category: "Image",
        title: "Multimedia Nodes"
    },
    {
        category: "Image",
        id_name: "image",
        fullname: "Image",
        tag: "img",

        icon: <BiImageAlt size={14} />
    },
    {
        category: "Image",
        id_name: "chart",
        fullname: "Chart",
        tag: "chart",

        icon: <BsClipboardData size={14} />
    }
]

let text_blocks = [
    {
        type: "Title",
        category: "Text",
        title: "Text Nodes"
    },
    {
        category: "Text",
        id_name: "paragraph",
        fullname: "Paragraph",
        tag: "p",
        
        icon: <MdTitle size={14} />
    },
    {
        category: "Text",
        id_name: "title",
        fullname: "Title",
        tag: "h1",

        icon: <MdTitle size={14} />
    },
    {
        category: "Text",
        id_name: "subtitle",
        fullname: "Subtitle",
        tag: "h2",

        icon: <MdTitle size={14} />
    },
    {
        category: "Text",
        id_name: "heading",
        fullname: "Heading",
        tag: "h3",

        icon: <MdTitle size={14} />
    },
    {
        category: "Text",
        id_name: "heading_2",
        fullname: "Heading 2",
        tag: "h4",

        icon: <MdTitle size={14} />
    },
    {
        category: "Text",
        id_name: "heading_3",
        fullname: "Heading 3",
        tag: "h5",

        icon: <MdTitle size={14} />
    },
    {
        category: "Text",
        id_name: "subheading",
        fullname: "Subheading",
        tag: "h6",

        icon: <MdTitle size={14} />
    }
]

export { ExtractTags }
export { text_blocks, multimedia_blocks }
export default [...text_blocks, ...multimedia_blocks]