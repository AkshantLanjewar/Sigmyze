import React, { useRef, useEffect } from "react"
import { init, getInstanceByDom } from "echarts"
import type { CSSProperties } from "react"
import type { EChartsOption, ECharts, SetOptionOpts } from "echarts"

export interface ReactEChartsProp {
    option: EChartsOption;
    settings?: SetOptionOpts;
    style?: CSSProperties;
    loading?: boolean;
    theme?: "light" | "dark";
}

