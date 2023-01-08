import { IContextMenuItem } from "../../tree/tree"
import { VscNewFolder, VscNewFile } from 'react-icons/vsc'
import { BiChart } from 'react-icons/bi'
import { TbTrash } from 'react-icons/tb'

export const folderMenu = [
    {
        type: "item",
        name: "Create Folder",
        icon: <VscNewFolder size={16} />,
        cb: () => {  }
    },
    {
        type: "item",
        name: "Create Document",
        icon: <VscNewFile size={16} />,
        cb: () => {  }
    },
    {
        type: "item",
        name: "Create Chart",
        icon: <BiChart size={16} />,
        cb: () => {  }
    },
    {
        type: "divider"
    },
    {
        type: "item",
        name: "Delete Folder",
        icon: <TbTrash size={16} color={"red"} />,
        cb: () => {  }
    }
] as IContextMenuItem[]