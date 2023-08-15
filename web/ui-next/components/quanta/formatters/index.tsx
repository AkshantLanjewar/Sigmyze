import { Group, Stack } from "@mantine/core"
import { useCallback, useContext, useEffect, useState } from "react"
import TextInputQuanta from '../../ui/form-builder/form-elements/text-input'
import { IconTooltip } from "@tabler/icons"
import { QuantaContextData } from "../../data/quanta/context"
import { IQuantaState } from "../../data/quanta/types"
import FormatterPreview from "./preview"

/**
 *  NOTE: Here are the testing requirements for the formatters component, which will include the 
 *  FormatterPreview component as well. 
 * 
 *  Formatters Unit Test Requirements:
 *      - indicator-title = Indicator Title
 *      - indicator-short = Short Title
 *  FormatterPreview Unit Test Requirements:
 *      - card-title = Type value in Title Text Field
 *      - card-short = Type value in Short Text Field
 *  FormatterPreview Unit Test (mocked context data)
 *      - card-title = testing-val
 *      - card-short = testing-short-val
 * 
 *  The E2E test will focus on typing a value into the input fields and then test if the preview has the same value
 *  E2E Steps:
 *      1) fill title input with testing value
 *      2) fill the short input with testing value
 *      3) make sure title preview matches with title input value
 *      4) make sure the short preview matches with the short input value
 * 
 *  Locators:
 *      1) indicator-title-input = the indicator title input
 *      2) indicator-short-input = the indicator short input
 *      3) preview-title = the preview title value
 *      4) preview-short = the preview short value
 */

const Formatters: React.FC = ({ }) => {    
    const { editText, textStore } = useContext(QuantaContextData) as IQuantaState

    const [titleValue, setTitleValue] = useState<string>("")
    const [shortValue, setShortValue] = useState<string>("")

    const setTitle = useCallback((val: string) => {
        setTitleValue(val)
        editText("formatter::title", val)
    }, [])

    const setShortTitle = useCallback((val: string) => {
        setShortValue(val)
        editText("formatter::short", val)
    }, [])

    useEffect(() => {
        let textStoreKeys = Object.keys(textStore)
        if(textStoreKeys.includes("formatter::title"))
            setTitleValue(textStore['formatter::title'])
        if(textStoreKeys.includes("formatter::short"))
            setShortValue(textStore['formatter::short'])
    }, [])
    
    return (
        <>
            <Group spacing={45}>
                <Stack spacing={"md"} sx={{ maxWidth: 450, minWidth: 450 }}>
                    <TextInputQuanta
                        name={"Indicator Title"}
                        icon={<IconTooltip />}
                        value={titleValue}
                        setValue={setTitle}
                        testingId="indicator-title-input"
                    />

                    <TextInputQuanta
                        name={"Short Title"}
                        icon={<IconTooltip />}
                        value={shortValue}
                        setValue={setShortTitle}
                        testingId="indicator-short-input"
                    />
                </Stack>

                <FormatterPreview />
            </Group>
        </>
    )
}

export default Formatters