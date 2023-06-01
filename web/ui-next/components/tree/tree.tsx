import styles from './tree.module.scss'
import Node   from './node'
import { IIndicator } from '../data/datasets/DatasetsTypes'

interface ITreeNode {
    node_id: string,
    node_type: string,
    node_title: string,

    opened?: boolean,
    active?: boolean,
    context?: boolean,
    useActive?: boolean,
    data?: ITreeNodeData,

    children: Array<ITreeNode>,
    actions?: Array<ITreeAction>,
    contextItems?: Array<IContextMenuItem>
}

interface ITreeNodeData {
    indicator?: IIndicator
}

interface IContextMenuItem {
    type: string,
    name: string,
    icon?: JSX.Element,
    cb: () => void
}

interface ITreeAction {
    name: string,
    icon: JSX.Element,
    cb: Function
}

interface ITreeProps {
    nodes: Array<ITreeNode>,
    setActive?: (id: string, type: string) => void
}

const Tree: React.FC<ITreeProps> = ({ nodes, setActive }): JSX.Element => {
    return (
        <div className={styles.tree}>
            {nodes.map((step) => (
                <Node 
                    node={step} 
                    key={step.node_id}
                    additional_padding={0}
                    root={true}
                    setActive={setActive}
                />
            ))}
        </div>
    )
}

export type { ITreeNode, IContextMenuItem, ITreeNodeData, ITreeAction }
export default Tree