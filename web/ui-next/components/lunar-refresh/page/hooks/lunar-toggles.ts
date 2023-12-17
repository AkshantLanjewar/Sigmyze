import { useCallback, useState } from "react"

/**
 * @description
 * - this is the hook that handles all the UX toggles that need to be activated by a portal button
 * @emits addIndicatorFlowToggle
 *  - this is the toggle that activates the add indicator flow
 * @emits settingsFlowToggle
 *  - this is the toggle that activates the settings flow
 * @emits deleteIndicatorFlowToggle
 *  - this is the toggle that activates the delete indicator flow
 * @emits openAddIndicatorFlow
 *  - this is the function that activates the add indicator flow
 * @emits openSettingsFlow
 *  - this is the function that activates the open settings flow
 * @emits openDeleteIndicatorFlow
 *  - this is the function that activates the delete indicator flow
 */
const useLunarToggles = () => {
    //this is a controlled toggle to activate the add indicator UX flow
    const [addIndicatorFlowToggle, setAddIndicatorFlowToggle] = useState<boolean>(false)
    const openAddIndicatorFlow = useCallback(() => { setAddIndicatorFlowToggle((step) => !step) }, [])

    //this is a controlled toggle to activate the settings page for the chart
    const [settingsFlowToggle, setSettingsFlowToggle] = useState<boolean>(false)
    const openSettingsFlow = useCallback(() => setSettingsFlowToggle((step) => !step), [])

    //this is a controlled toggle to activate the delete indicator flow
    const [deleteIndicatorFlowToggle, setDeleteIndicatorFlowToggle] = useState<boolean>(false)
    const openDeleteIndicatorFlow = useCallback(() => setDeleteIndicatorFlowToggle((step) => !step), [])

    return {
        addIndicatorFlowToggle,
        settingsFlowToggle,
        deleteIndicatorFlowToggle,
        openAddIndicatorFlow,
        openSettingsFlow,
        openDeleteIndicatorFlow
    }
}

export { useLunarToggles }