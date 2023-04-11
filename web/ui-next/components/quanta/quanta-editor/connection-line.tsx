interface IConnectionLineProps {
    fromX: any,
    fromY: any,
    fromPosition: any,
    toX: any,
    toY: any,
    toPosition: any,
    connectionLineType: any,
    connectionLineStyle: any,
}

const ConnectionLine: React.FC<IConnectionLineProps> = ({
    fromX,
    fromY,
    fromPosition,
    toX,
    toY,
    toPosition,
    connectionLineType,
    connectionLineStyle
}) => {
    return (
        <g>
            <path
                fill="none"
                stroke="#c1c2c5"
                strokeWidth={2}
                className="animated"
                d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
            />
            <circle cx={toX} cy={toY} fill="#fff" r={3} stroke="#222" strokeWidth={1.5} />
        </g>
    )
}

export default ConnectionLine