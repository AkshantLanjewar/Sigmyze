import { useCallback, useRef, useState } from "react"
import { IQuantaIndicatorLoc } from "../../data-manager/state"

/**
 * @description
 *  - this is the hook that abstracts away the message queue
 * 
 * @emits message
 *  - this is how many add indicators are in the add queue
 * @emits addIndicator
 *  - this is the function that adds an indicator to the add queue
 * @emits consumeIndicator
 *  - this is the function that consumes an indicator from the queue
 * @emits delMessages
 *  - this is the amount of delete messages that are in the queue
 * @emits deleteIndicator
 *  - this is the function that adds an indicator to the delete indicator queue
 * @emits consumeDELIndicator
 *  - this is the function that consumes a delete indicaor request
 */
const useAddQueue = () => {
    //these are the amount of messages within the queue
    const [messages, setMessages] = useState<number>(0)
    //these are the indicators to be added in the queue
    const addIndicatorQueue = useRef<IQuantaIndicatorLoc[]>([])

    //these are the amount of messages within the delete queue
    const [delMessages, setDelMessages] = useState<number>(0)
    //these are the indicators to be deleted from the active chart
    const deleteIndicatorQueue = useRef<IQuantaIndicatorLoc[]>([])

    //this is the function that adds an indicator to the delete queue
    const deleteIndicator = useCallback((indicator: IQuantaIndicatorLoc) => {
        let indicators = deleteIndicatorQueue.current
        indicators.push(indicator)

        deleteIndicatorQueue.current = indicators
        setDelMessages(indicators.length)
    }, [])

    //this is the function that consumes an indicator from the delete queue
    const consumeDELIndicator = useCallback(() => {
        let indicators = deleteIndicatorQueue.current
        let indicator = indicators.shift()

        deleteIndicatorQueue.current = indicators
        setDelMessages(indicators.length)
        return indicator
    }, [])

    //this is the function that adds an indicator to the queue
    const addIndicator = useCallback((indicator: IQuantaIndicatorLoc) => {
        let indicators = addIndicatorQueue.current
        indicators.push(indicator)

        addIndicatorQueue.current = indicators
        setMessages(indicators.length)
    }, [])

    //this is the function that consumes an indicator from the queue
    const consumeIndicator = useCallback(() => {
        let indicators = addIndicatorQueue.current
        let indicator = indicators.pop()

        addIndicatorQueue.current = indicators
        setMessages(indicators.length)

        return indicator
    }, [])

    return {
        messages,
        addIndicator,
        consumeIndicator,
        delMessages,
        deleteIndicator,
        consumeDELIndicator
    }
}

export { useAddQueue }