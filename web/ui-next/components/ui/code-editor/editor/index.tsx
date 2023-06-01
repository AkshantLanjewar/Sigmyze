import { useCallback, useContext, useEffect, useState } from "react"
import styles from './index.module.scss'
import { CodeEditorContextData } from ".."
import { ICodeEditorState } from "../state"
import { editor } from "monaco-editor"
import dynamic from "next/dynamic"

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

const InternalEditor: React.FC = ({ }) => {
    const [internalBuffer, setInternalBuffer] = useState<string | undefined>(undefined)
    const { activeFile, getFile } = useContext(CodeEditorContextData) as ICodeEditorState

    const monacoOptions = {
        cursorSmoothCaretAnimation: "on",
        cursorStyle: "block",
        cursorBlink: "smooth",
        cursorWidth: 32,
        fontFamily: 'Anonymous Pro!important',
        fontWeight: "bold",
        glyphMargin: true,
        smoothScrolling: true,
        fontSize: 18,
        autoIndent: 'full',
    } as editor.IStandaloneEditorConstructionOptions

    const activateMonacoJSXHighlighter = async (monacoEditor: any, monaco: any) => {
        const { default: traverse } = await import('@babel/traverse')
        const { parse } = await import('@babel/parser')
        const { default: MonacoJSXHighlighter } = await import(
            'monaco-jsx-highlighter'
        )

        const monacoJSXHighlighter = new MonacoJSXHighlighter(
            monaco,
            parse,
            traverse,
            monacoEditor
        )

        monacoJSXHighlighter.highlightOnDidChangeModelContent()
        monacoJSXHighlighter.addJSXCommentCommand()

        return {
            monacoJSXHighlighter,
        }
    }

    const handleEditorDidMount = useCallback(async (editor: any, monaco: any) => {
        activateMonacoJSXHighlighter(editor, monaco)
    }, [])

    useEffect(() => {
        if(activeFile === undefined)
            return

        let file = getFile(activeFile)
        let fileContents = file?.file_content
        if(fileContents === undefined)
            return

        setInternalBuffer(fileContents)

        if(file?.file_type === "tsx") {
            
        }
    }, [activeFile])
    
    const onChange = (value: string | undefined) => {
        setInternalBuffer(value)
    }

    return (
        <>
            <Editor
                height={"100%"}
                width={"100%"}
                defaultLanguage={"javascript"}
                value={internalBuffer}
                theme={"vs-dark"}
                defaultValue="// open a file from the sidebar to get started"
                onChange={(e) => onChange(e)}
                options={monacoOptions}
                className={styles.editor}
                onMount={handleEditorDidMount}
            />
        </>
    )
}

export default InternalEditor