import { FocusTrap, Input, Textarea, Tooltip } from '@mantine/core'
import { useState } from 'react'
import styles from './editable-text.module.scss'

interface IEditableTextProps {
    className?: string,
    value?: string,
    setValue?: (value: string) => void,
    inputType?: string
}

const EditableText: React.FC<IEditableTextProps> = ({ className, value, setValue, inputType }) => {
    const [edit, setEdit] = useState(false)
    let inputTypeReal = "text"
    if(inputType !== undefined)
        inputTypeReal = inputType
    
    return (
        <div>
            {edit
                ? (
                    <FocusTrap active={true}>
                        <div>
                            {inputTypeReal === "text" && (
                                <Input
                                    variant={'unstyled'}
                                    value={value}
                                    classNames={{ input: className }}
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
                        >
                            {value}
                        </div>
                    </Tooltip>
                )
            }
        </div>
    )
}

export default EditableText