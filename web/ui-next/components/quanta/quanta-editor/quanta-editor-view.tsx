import { Dispatch, RefObject, SetStateAction, memo } from "react"
import 'reactflow/dist/style.css'
import ContextButtons from "./editor-toolkit/context-buttons"
import ExecutionContext from "./execution-engine/context"
import { IQuantaEditorGlobals, IQuantaFormField, IQuantaRFEdge, IQuantaRFNode, IQuantaStore } from "./types/types"
import { QuantaEditorContext } from "./quanta-editor"
import EngineWrapper from "./execution-engine/engine-wrapper"
import ModalManager from "../../ui/modal-manager"
import FormBuilder from "../../ui/form-builder/form-builder"
import DeleteNodeForm from "./forms/delete-node-form"
import QuantaFlow from "./quanta-flow"
import { ReactFlowInstance } from "reactflow"

interface IViewProps {
    ref: RefObject<HTMLDivElement>,
    requiresCache: boolean,
    viewOnly: boolean,
    fileId: string,
    memoValue: IQuantaEditorGlobals,
    engineWrapperToggle: boolean,
    engineCacheToggle: boolean,
    nodes: IQuantaRFNode[],
    edges: IQuantaRFEdge[],
    quantaStore: IQuantaStore,
    storeModal: string | null,
    formTitle: string | undefined,
    formContent: IQuantaFormField[],
    projectLoaded: boolean,
    setNodes: Dispatch<SetStateAction<IQuantaRFNode[]>>,
    setEdges: Dispatch<SetStateAction<IQuantaRFEdge[]>>,
    setReactFlowInstance: Dispatch<SetStateAction<ReactFlowInstance | null>>,
    closeStoreModal: () => void,
    toggleEngineWrapper: () => void,
    toggleEngineCache: () => void,
    submitStoreModal_: (forms: IQuantaFormField[], valStore: {
        [key: string]: string;
    }) => void    
}

const QuantaEditorView: React.FC<IViewProps> = memo(({
    ref,
    requiresCache,
    viewOnly,
    fileId,
    memoValue,
    engineWrapperToggle,
    engineCacheToggle,
    nodes,
    edges,
    quantaStore,
    storeModal,
    formTitle,
    formContent,
    projectLoaded,
    setNodes,
    setEdges,
    setReactFlowInstance,
    closeStoreModal,
    toggleEngineWrapper,
    toggleEngineCache,
    submitStoreModal_
}) => {
    return (
        <div
            style={{ width: "100%", height: "100%", position: 'relative' }}
            className={".editor__wrapper"}
            ref={ref}
        >
            <ContextButtons 
                hasCache={requiresCache}
                viewOnly={viewOnly}
                toggleEngineWrapper={toggleEngineWrapper}
                toggleEngineCache={toggleEngineCache}
            />

            <ExecutionContext fileId={fileId}>
                <QuantaEditorContext.Provider value={memoValue}>
                    <>
                        <EngineWrapper
                            subscribeExecute={engineWrapperToggle}
                            engineCacheToggle={engineCacheToggle}
                            nodes={nodes}
                            edges={edges}
                            store={quantaStore}
                        />

                        <ModalManager
                            modalState={storeModal}
                            close={closeStoreModal}
                        >
                            <ModalManager.Modal
                                id="store"
                                title={formTitle!}
                            >
                                <FormBuilder 
                                    forms={formContent} 
                                    closeModal={closeStoreModal}
                                    submit={submitStoreModal_}
                                />
                            </ModalManager.Modal>

                            <ModalManager.Modal
                                id={"delete_node"}
                                title={"Are you Sure?"}
                            >
                                <DeleteNodeForm     
                                    opened={storeModal === "delete_node"} 
                                    closeModal={closeStoreModal}
                                />
                            </ModalManager.Modal>
                        </ModalManager>

                        <QuantaFlow
                            nodes={nodes}
                            edges={edges}
                            quantaStore={quantaStore}
                            setNodes={setNodes}
                            setEdges={setEdges}
                            setReactFlowInstance={setReactFlowInstance}
                            projectLoaded={projectLoaded}
                            fileId={fileId}
                        />
                    </>
                </QuantaEditorContext.Provider>
            </ExecutionContext>
        </div>
    )
})

export default QuantaEditorView