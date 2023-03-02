import { Dispatch, SetStateAction } from "react"
import { v4 } from "uuid"
import { IQuantaFormField, IQuantaStore, IQuantaStoreData, IQuantaStoreItem, IQuantaTypeRef } from "../types/types"

function getStoreValue(storeKey: string, quantaStore: IQuantaStore) : IQuantaStoreData | undefined {
    let storeKeys = Object.keys(quantaStore)
    if(storeKeys.includes(storeKey) === undefined)
        return undefined

    let store = quantaStore[storeKey]
    return store
}

function createStore(
    storeKey: string, 
    storeName: string, 
    createFields: IQuantaFormField[], 
    formTitle: string, 
    quantaStore: IQuantaStore,
    toggleUpdateStore: () => void,
    setQuantaStore: Dispatch<SetStateAction<IQuantaStore>>
) {
    let newStore = {} as IQuantaStoreData
    newStore.name = storeName
    newStore.items = []
    newStore.form = createFields
    newStore.formTitle = formTitle

    let nStore = quantaStore
    nStore[storeKey] = newStore

    toggleUpdateStore()
    setQuantaStore({ ...nStore })
}

function createStoreModal(
    modalKey: string, 
    quantaStore: IQuantaStore,
    setFormTitle: Dispatch<SetStateAction<string | undefined>>,
    setFormContent: Dispatch<SetStateAction<IQuantaFormField[]>>,
    setStoreKey: Dispatch<SetStateAction<string | undefined>>,
    openStoreModal: () => void
) {
    let storeKeys = Object.keys(quantaStore)
    if(storeKeys.includes(modalKey) === false)
        return

    let store = quantaStore[modalKey]

    setFormTitle(store.formTitle)
    setFormContent([ ...store.form! ])
    setStoreKey(modalKey)
    openStoreModal()
}

function createStoreItem(
    storeKey: string, 
    data: any, 
    quantaStore: IQuantaStore, 
    setQuantaStore: Dispatch<SetStateAction<IQuantaStore>>
) {
    let storeKeys = Object.keys(quantaStore)
    if(storeKeys.includes(storeKey) === undefined)
        return

    let store = quantaStore[storeKey]
    let items = store.items
    if(items === undefined)
        items = []

    let nItem = {} as IQuantaStoreItem
    nItem.id = v4()
    nItem.data = data
    nItem.addedKeys = Object.keys(data)
    items.push(nItem)

    let nStore = quantaStore
    store.items = items
    nStore[storeKey] = store

    setQuantaStore({ ...nStore })
}

function submitStoreModal(
    forms: IQuantaFormField[], 
    valStore: {[key: string]: string},
    storeKey: string | undefined,
    quantaStore: IQuantaStore, 
    setQuantaStore: Dispatch<SetStateAction<IQuantaStore>>,
    closeStoreModal: () => void,
    toggleUpdateStore: () => void
) {
    let data = {} as any
    if(storeKey === undefined)
        return

    for(let i = 0; i < forms.length; i++) {
        let form = forms[i]
        if(form.type === "text" || form.type === "dropdown") {
            if(form.linkedKey === undefined)
                continue
            if(form.id === undefined)
                continue
            
            let val = valStore[form.id]
            if(val === undefined || val.length === 0)
                return

            data[form.linkedKey] = val
            if(form.type === "dropdown") {
                let type = {} as IQuantaTypeRef
                type.groupId = form.dropdownField
                type.typeId = val
                
                data[form.linkedKey] = type
            }
        }

        if(form.type === "additional") {
            let additionalAdds = form.additionalFields
            if(additionalAdds === undefined)
                continue

            for(let x = 0; x < additionalAdds.length; x++) {
                let field = additionalAdds[x]
                data[field.key] = field.value
            }
        }
    }
    
    createStoreItem(storeKey, data, quantaStore, setQuantaStore)
    closeStoreModal()
    toggleUpdateStore()
}

function editStoreValue(
    storeKey: string, 
    itemId: string, 
    key: string, 
    field: any,
    quantaStore: IQuantaStore, 
    setQuantaStore: Dispatch<SetStateAction<IQuantaStore>>,
    toggleUpdateStore: () => void
) {
    let storeKeys = Object.keys(quantaStore)
    if(storeKeys.includes(storeKey) === undefined)
        return

    let store = quantaStore[storeKey]
    let items = store.items
    if(items === undefined)
        return

    let nItems = []
    for(let i = 0; i < items.length; i++) {
        let item = items[i]
        if(item.id === itemId)
            item.data[key] = field

        nItems.push(item)
    }

    let nQuantaStore = quantaStore
    store.items = nItems
    nQuantaStore[storeKey] = { ...store }
    
    setQuantaStore({ ...nQuantaStore })
    toggleUpdateStore()
}

function deleteStoreItem(
    storeKey: string, 
    itemId: string,
    quantaStore: IQuantaStore, 
    setQuantaStore: Dispatch<SetStateAction<IQuantaStore>>,
    toggleUpdateStore: () => void
) {
    let storeKeys = Object.keys(quantaStore)
    if(storeKeys.includes(storeKey) === undefined)
        return

    let store = quantaStore[storeKey]
    let items = store.items
    if(items === undefined)
        return

    let nItems = []
    for(let i = 0; i < items.length; i++) {
        let item = items[i]
        if(item.id === itemId)
            continue

        nItems.push(item)
    }

    let nQuantaStore = quantaStore
    store.items = nItems
    nQuantaStore[storeKey] = { ...store }
    
    setQuantaStore({ ...nQuantaStore })
    toggleUpdateStore()
}


export {
    getStoreValue,
    createStore,
    createStoreModal,
    createStoreItem,
    submitStoreModal,
    editStoreValue,
    deleteStoreItem
}