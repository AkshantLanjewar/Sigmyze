import { ISigmyzeFilesystem } from "../../../ui/file-management/types"
import { IPortalButton, IPortalButtonMenuButton } from "../../types"

/**
 * this is the data structure that stores all the functions that we want to be hydrated into the portal buttons
 */
interface IHydrationMap {
    /**
     * this is the format the hydration functions are stored in.
     * the key is the testId of the component, and the function is the one that is going to be hydrated
     */
    [key: string]: () => void
}

/**
 * @description
 *  - this is the function that handles the insertion of functions into the portal buttons so they become functional.
 * @param portalButtons 
 *  - theese are the portal buttons we want to insert the functions into
 * @param hydrationMap 
 *  - this is the hydration map that contains the functions we want to be inserted
 * @returns 
 *  - this returns a list of hydrated portal buttons.
 */
const hydratePortalButtons = (portalButtons: IPortalButton[], hydrationMap: IHydrationMap) => {
    let hydrationKeys = Object.keys(hydrationMap)
    let hydratedPortalButtons: IPortalButton[] = []

    for(let i = 0; i < portalButtons.length; i++) {
        let portalButton = portalButtons[i]
        if(hydrationKeys.includes(portalButton.buttonId))
            portalButton.onClick = hydrationMap[portalButton.buttonId]

        let portalMenu = portalButton.portalMenu
        if(portalMenu !== undefined) {
            let menuButtons = portalMenu.menuButtons
            let newMenuButtons: IPortalButtonMenuButton[] = []

            for(let x = 0; x < menuButtons.length; x++) {
                let menuButton = menuButtons[x]
                if(menuButton.testId !== undefined && hydrationKeys.includes(menuButton.testId)) {
                    menuButton.onClick = hydrationMap[menuButton.testId]
                    menuButton.hydrated = true
                }

                newMenuButtons.push(menuButton)
            }

            portalMenu.menuButtons = newMenuButtons
        } 

        portalButton.portalMenu = portalMenu
        hydratedPortalButtons.push(portalButton)
    }

    return hydratedPortalButtons
}

export type { IHydrationMap }
export { hydratePortalButtons }