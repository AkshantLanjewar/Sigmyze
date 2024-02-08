import { Dispatch, SetStateAction, useCallback } from "react"

/**
 * @description
 *  - this is the hook that handles all grip logic
 * @param setActive
 *  - this is the function that can set whether or not the note is active
 */
const useGrip = (
    setActive: Dispatch<SetStateAction<boolean>>
) => {
    const gripHandler = useCallback(() => {
        setActive(true)
    }, [])

    return {
        gripHandler
    }
}

export default useGrip