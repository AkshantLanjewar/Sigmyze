import { BsAlignStart, BsAlignCenter, BsAlignEnd } from 'react-icons/bs'

let align_templates = [
    {
        name: "Align Left",
        position: "bottom-end",
        justify: "left",
        icon:  <BsAlignStart size={14} />,

        active: true
    },
    {
        name: "Align Center",
        position: "bottom",
        justify: "center",
        icon:  <BsAlignCenter size={14} />,

        active: false
    },
    {
        name: "Align Right",
        position: "bottom-start",
        justify: "right",
        icon:  <BsAlignEnd size={14} />,

        active: false
    }
]

export default align_templates