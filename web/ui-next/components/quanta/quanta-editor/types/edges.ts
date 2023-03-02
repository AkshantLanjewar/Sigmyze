import { CSSProperties } from "react"

/**
 * Implementation for an edge within the node editor
 */
interface IQuantaRFEdge {
    /**
     * Unique id for the edge
     */
    id?: string,

    /**
     * the type of edge, using default bezeir
     */
    type?: "bezier",

    /**
     * the id of the node emitting the edge
     */
    source?: string,

    /**
     * the id of the socket the edge is emitted from
     */
    sourceHandle?: string,

    /**
     * the id of the node receiving the edge
     */
    target?: string,

    /**
     * the id of the socket the edge going to
     */
    targetHandle?: string,

    /**
     * style for the line of the edge
     */
    style?: CSSProperties
}

export type { IQuantaRFEdge }