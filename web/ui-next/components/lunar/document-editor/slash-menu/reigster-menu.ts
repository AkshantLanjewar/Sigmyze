import { IDocumentMenuItem } from "../../../data/lunar/document-types"
import RegisterMediaBlocks from "../blocks/media/register-media"
import RegisterTextBlocks from "../blocks/text/register-text"

function RegisterMenu() {
    let menuItems = [] as IDocumentMenuItem[]

    menuItems = [
        ...menuItems, 
        ...RegisterTextBlocks(),
        ...RegisterMediaBlocks()
    ]

    return menuItems
}

export default RegisterMenu