import { createStyles } from "@mantine/core"
const xAxisStyles = createStyles((theme: any) => ({
    xAxis: {
        height: "28px",
        borderTop: "1px solid #444444",
        backgroundColor: theme.colors.dark[9],
        overflow: "hidden",

        display: "flex",
        flexDirection: "row",
        position: "relative",
        fontSize: "12px"
    },

    tickValue: {
        position: "absolute",
        width: "110px",
        backgroundColor: "black",
        color: theme.colors.dark[0],

        height: "80%",
        zIndex: "10",

        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        borderBottomLeftRadius: "2.5px",
        borderBottomRightRadius: "2.5px"
    },

    tick: {
        position: "absolute",
        height: "80%",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.colors.dark[1],
    }
}))

const yAxisStyles = createStyles((theme: any) => ({
    yAxis: {
        width: "55px",
        background: theme.colors.dark[9],
        overflow: "hidden",
        position: "relative",
        borderLeft: "1px solid #444444"
    },

    inner: {
        display: "flex",
        flexDirection: "column",
        fontSize: "12px",
        position: "relative",
        height: "calc(100% - 28px)"
    },

    tickValue: {
        backgroundColor: "black",
        color: theme.colors.dark[0],

        width: "100%",
        height: "25px",
        zIndex: "10",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        position: "absolute",
        paddingLeft: "10px",
        borderTopRightRadius: "2.5px",
        borderBottomRightRadius: "2.5px"
    },

    tick: {
        position: "absolute",
        paddingLeft: "10px",
        color: theme.colors.dark[1]
    }
}))

export { xAxisStyles, yAxisStyles }