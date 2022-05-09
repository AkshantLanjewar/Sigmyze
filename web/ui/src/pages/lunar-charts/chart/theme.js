import * as am5 from "@amcharts/amcharts5"
import { useMantineTheme } from "@mantine/core"

class LunarTheme extends am5.Theme {
    

    setupDefaultRules() {
        //theme rules
        this.rule("Grid").setAll({
            strokeWidth: 1,
            stroke: am5.color("#141517")
        })

        this.rule("AxisLabel").setAll({
            fill: am5.color("#C1C2C5"),
            fontSize: `14px`,
            paddingTop: 10,
            textAlign: "center"
        })

        this.rule("AxisRendererY").setAll({
            background: am5.Rectangle.new(this._root, { fill: am5.color("#212529") }),
            fill: am5.color("#212529"),
            fillOpacity: 1,
            visible: true
        })

        this.rule("Rectangle", ["axis", "header"]).setAll({
            fill: am5.color("#212529")
        })

        this.rule("PointedRectangle", ["tooltip", "background"]).setAll({
            stroke: "none",
            opacity: 1,
            fill: am5.color("#212529"),
            marginTop: 0
        })
    }
}

export default LunarTheme