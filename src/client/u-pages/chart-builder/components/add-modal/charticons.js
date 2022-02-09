import React, { useState, useEffect } from "react"
import { FcAreaChart, FcLineChart } from "react-icons/fc"

const ChartIcons = (props) => {
  let name = props.icon

  const iconList={
    WEO: FcAreaChart,
    COVID: FcLineChart
  }

  const [activeIcon, setActiveIcon] = useState()

  useEffect(() => {
    setActiveIcon(iconList[name])
  }, [])

  return(
    <>
      <span>{activeIcon}</span>
    </>
  )
}

export default ChartIcons
