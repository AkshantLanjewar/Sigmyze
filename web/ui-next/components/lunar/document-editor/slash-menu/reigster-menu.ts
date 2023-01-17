import { IDocumentMenuItem } from "../../../data/lunar/document-types"
import RegisterTextBlocks from "../blocks/register-text"

function RegisterMenu() {
    let menuItems = [] as IDocumentMenuItem[]

    menuItems = [...menuItems, ...RegisterTextBlocks()]
    return menuItems
}

export default RegisterMenu