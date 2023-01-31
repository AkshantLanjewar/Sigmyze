import { IDocumentMenuItem } from "../../../data/lunar/types/document-types"
import { RegisterData } from "../blocks/data/register-data"
import RegisterMediaBlocks from "../blocks/media/register-media"
import RegisterTextBlocks from "../blocks/text/register-text"

function RegisterMenu() {
    let menuItems = [] as IDocumentMenuItem[]

    menuItems = [
        ...menuItems, 
        ...RegisterTextBlocks(),
        ...RegisterMediaBlocks(),
        ...RegisterData()
    ]

    return menuItems
}

export default RegisterMenu