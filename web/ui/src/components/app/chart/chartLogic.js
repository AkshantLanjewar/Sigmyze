const BuildCharts = (
    svgRef, 
    margin,
    setFUNCS
) => {
    const setSvgDims  = setFUNCS['setSvgDims']
    const setSvgPoint = setFUNCS['setSvgPoint']

    if(svgRef.current == null)
        return
    
    let boundingBox = svgRef.current.getBoundingClientRect()
    let svgPoint    = svgRef.current.createSVGPoint()

    const rawWidth  = boundingBox.width;
    const rawHeight = boundingBox.height - margin.top - margin.bottom

    setSvgDims({ width: rawWidth, height: rawHeight, paddedHeight: rawHeight })
    setSvgPoint(svgPoint)
}

export default BuildCharts