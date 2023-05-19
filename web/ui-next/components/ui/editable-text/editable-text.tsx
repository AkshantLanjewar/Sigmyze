import { FocusTrap, Input, Textarea, Tooltip, UnstyledButton } from '@mantine/core'
import { useEffect, useState } from 'react'
import styles from './editable-text.module.scss'

interface IEditableTextProps {
    className?: string,
    value?: string,
    setValue?: (value: string) => void,
    inputType?: string,
    defaultValue?: boolean,
    emitBlur?: () => void,
    emitEditState?: (edit: boolean) => void
}

const EditableText: React.FC<IEditableTextProps> = ({ 
    className, 
    value, 
    setValue, 
    inputType, 
    defaultValue, 
    emitBlur, 
    emitEditState 
}) => {
    const [edit, setEdit] = useState(defaultValue ? defaultValue : false)
    let inputTypeReal = "text"
    if(inputType !== undefined)
        inputTypeReal = inputType

    useEffect(() => {
        if(edit === false && emitBlur !== undefined)
            emitBlur()

        if(emitEditState === undefined)
            return
        emitEditState(edit)
    }, [edit])
    
    return (
        <>
            {edit
                ? (
                    <FocusTrap active={true}>
                        <div>
                            {inputTypeReal === "text" && (
                                <Input
                                    variant={'unstyled'}
                                    value={value}
                                    classNames={{ input: className, wrapper: styles.input__wrapper }}
                                    data-autoFocus
                                    multiline
                                    onBlur={() => { setEdit(false) }}
                                    onChange={(e) => setValue ? setValue(e.target.value) : null}
                                />
                            )}

                            {inputTypeReal === "textarea" && (
                                <Textarea
                                    variant={"unstyled"}
                                    value={value}
                                    classNames={{ input: className }}
                                    data-autoFocus
                                    sx={{ height: "auto!important" }}
                                    onBlur={() => { setEdit(false) }}
                                    onChange={(e) => setValue ? setValue(e.target.value) : null}
                                />
                            )}
                        </div>
                    </FocusTrap>
                )
                : (
                    <Tooltip
                        openDelay={250}
                        label={"Click to Edit"}
                        transition={"slide-down"}
                        position={"top"}
                        styles={{ tooltip: { backgroundColor: "#08090A" } }}
                        withArrow
                    >
                        <div 
                            className={`${className} ${styles.editable__wrapper}`} 
                            onClick={() => { setEdit(true) }}
                            aria-label={'editable'}
                        >
                            {value}
                        </div>
                    </Tooltip>
                )
            }
        </>
    )
}

export default EditableText