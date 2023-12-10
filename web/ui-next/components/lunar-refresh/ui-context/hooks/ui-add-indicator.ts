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
 */
const useAddQueue = () => {
    //these are the amount of messages within the queue
    const [messages, setMessages] = useState<number>(0)
    //these are the indicators to be added in the queue
    const addIndicatorQueue = useRef<IQuantaIndicatorLoc[]>([])

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
        consumeIndicator
    }
}

export { useAddQueue }