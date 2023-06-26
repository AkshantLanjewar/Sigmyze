import { Group, Stack } from "@mantine/core"
import { useCallback, useContext, useEffect, useState } from "react"
import TextInputQuanta from '../../ui/form-builder/form-elements/text-input'
import { IconTooltip } from "@tabler/icons"
import { QuantaContextData } from "../../data/quanta/context"
import { IQuantaState } from "../../data/quanta/types"
import FormatterPreview from "./preview"

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
                    />

                    <TextInputQuanta
                        name={"Short Title"}
                        icon={<IconTooltip />}
                        value={shortValue}
                        setValue={setShortTitle}
                    />
                </Stack>

                <FormatterPreview />
            </Group>
        </>
    )
}

export default Formatters