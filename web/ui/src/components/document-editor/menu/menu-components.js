import { MdTitle } from 'react-icons/md'

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

export default [...text_blocks]