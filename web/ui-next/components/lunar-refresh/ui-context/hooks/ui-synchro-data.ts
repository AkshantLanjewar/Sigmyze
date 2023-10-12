import { useCallback, useRef, useState } from "react"
import { ISynchroMessage } from "../types"
import { v4 } from "uuid"

/**
 * @description
 *  - this is the hook that abstracts away the synchro message logic
 * 
 * @emits synchroQueueLength
 *  - this is the length of the synchro message queue
 * @emits addCreateSynchroMessage
 *  - this is the function that adds a create syncrho message to the queue
 * @emits addDeleteSynchroMessage
 *  - this is the function that adds a delete synchro message to the queue
 * @emits consumeSynchroMessage
 *  - this is the function that consumes a synchro message from the queue
 */
const useSynchroMessage = () => {
    /**
     * in order for the data and ui to link, we will use a message system in order to synchronize big events such as file create
     * and delete, as those require actions within the data end as well in order to make sure the right components are initiated and removed.
     */
    const synchroMessageQueue = useRef<ISynchroMessage[]>([])
    //the amount of syncrho messages left to consume
    const [synchroQueueLength, setSynchroQueueLength] = useState<number>(0)

    /**
     * NOTE: This method is to be used only internally within the UI context.
     * This is a helper method that adds a synchro message to the list of synchro messages in order for the Data context to sync with the UI context.
     */
    const addCreateSynchroMessage = useCallback((fileName: string, fileType: string, fileId: string) => {
        let fileData = `${fileType}::${fileName}::${fileId}`
        const newMessage: ISynchroMessage = {
            messageId: v4(),
            messageType: "CREATE",
            messageData: fileData
        }

        //construct using new queue model
        let oldSyncrhoMessages = synchroMessageQueue.current
        let newSynchroMessages = [ ...oldSyncrhoMessages, newMessage ]
        //set ref and update length
        synchroMessageQueue.current = newSynchroMessages
        setSynchroQueueLength(newSynchroMessages.length)
    }, [])

    /**
     * NOTE: This method is to be used only internally within the UI context.
     * This is a helper method that adds a synchro message to delete a file
     */
    const addDeleteSynchroMessage = useCallback((fileType: string, fileId: string) => {
        let fileData = `${fileType}::${fileId}`
        const newMessage: ISynchroMessage = {
            messageId: v4(),
            messageType: "DELETE",
            messageData: fileData
        }

        //construct using new queue model
        let oldSyncrhoMessages = synchroMessageQueue.current
        let newSynchroMessages = [ ...oldSyncrhoMessages, newMessage ]
        //set ref and update length
        synchroMessageQueue.current = newSynchroMessages
        setSynchroQueueLength(newSynchroMessages.length)
    }, [])

    /**
     * NOTE: This method is shared out through the context.
     * This method pops a synchro message from the synchroMessages list, returns the message and removes the item from the list.
     */
    const consumeSynchroMessage = useCallback(() => {
        let newSynchroMessages = synchroMessageQueue.current
        let consumedMessage = newSynchroMessages.shift()

        synchroMessageQueue.current = newSynchroMessages
        setSynchroQueueLength(newSynchroMessages.length)
        return consumedMessage
    }, [])

    return {
        synchroQueueLength,
        addCreateSynchroMessage,
        addDeleteSynchroMessage,
        consumeSynchroMessage
    }
}

export default useSynchroMessage