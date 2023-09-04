import { IconPlus, IconSettings, IconTrash } from "@tabler/icons";
import { IPortalButton } from "../types";

//NOTE: All onclicks have to be changed on a hydrate before being used in production mode
//gray = C1C2C5
//red = FF6B6B
//blue = 4C6EF5

const PORTAL_BUTTONS_FOLDER = [
    {
        buttonColor: "gray",
        buttonIcon: <IconPlus />,
        buttonId: "folder-create",
        onClick: () => {} //needs to be changed on hydrate
    },
    {
        buttonColor: "red",
        buttonIcon: <IconTrash />,
        buttonId: "folder-delete",
        onClick: () => {}
    }
] as IPortalButton[]

const PORTAL_BUTTONS_CHART = [
    {
        buttonColor: "blue",
        buttonIcon: <IconPlus />,
        buttonId: "chart-add",
        onClick: () => {}
    },
    {
        buttonColor: "gray",
        buttonIcon: <IconSettings />,
        buttonId: "chart-settings",
        onClick: () => {} //needs to be changed on hydrate
    },
    {
        buttonColor: "red",
        buttonIcon: <IconTrash />,
        buttonId: "chart-remove",
        onClick: () => {}
    }
] as IPortalButton[]

const PORTAL_BUTTONS_NOTE = [
    {
        buttonColor: "gray",
        buttonIcon: <IconSettings />,
        buttonId: "note-setting",
        onClick: () => {} //needs to be changed on hydrate
    },
    {
        buttonColor: "red",
        buttonIcon: <IconTrash />,
        buttonId: "note-delete",
        onClick: () => {}
    }
] as IPortalButton[]

export {
    PORTAL_BUTTONS_FOLDER,
    PORTAL_BUTTONS_CHART,
    PORTAL_BUTTONS_NOTE
}