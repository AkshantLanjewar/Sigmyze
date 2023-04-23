interface IExplorerFolder {
    folder_id: string,
    folder_name: string,
    action: () => void
}

interface IExplorerItem {
    item_id: string,
    item_type: string,
    item_name: string,
    action: () => void
}

export type { 
    IExplorerFolder,
    IExplorerItem 
}