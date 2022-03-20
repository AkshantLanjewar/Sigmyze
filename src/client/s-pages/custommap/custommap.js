import React, { useEffect, useState } from "react"
import DeckGL from "@deck.gl/react"
import {LineLayer} from "@deck.gl/layers"
import {GeoJsonLayer} from '@deck.gl/layers'
import {BASEMAP} from '@deck.gl/carto'
import {StaticMap} from 'react-map-gl';
import Navbar from '../../components/navbar';
import IndicatorList from './components/indicator-list'
import AddModal from './components/add-modal'
import {FaExchangeAlt} from "react-icons/fa"
import {MdExpandMore, MdExpandLess} from "react-icons/md"
import * as d3 from "d3"

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -10,
  latitude: 37.7853,
  zoom: 1,
  pitch: 0,
  bearing: 0
};

// Data to be used by the LineLayer
const data = [
  {sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}
];

//const MAPBOX_TOKEN = 'pk.eyJ1Ijoicm1sYW5qZXdhciIsImEiOiJjazdoMW9pdXowNTUwM2RvOHVkNXppMGJsIn0.EWYFAyEpJqrBK8vpL0xmGw'

// DeckGL react component
function CustomMap() {
  const [dataset, setDataset] = useState("")
  const [mapTitle, setMapTitle] = useState("")
  const [modalState, setModalState] = useState(false)
  const [metricCode, setMetricCode] = useState('')
  const [metricName, setMetricName] = useState('')
  const [year, setYear] = useState('2021')
  const [month, setMonth] = useState("0")
  const [mapData, setMapData] = useState({})
  const [layers, setLayers] = useState([])
  const [colorscale, setColorScale] = useState({min: 0, max: 0})
  const [legendColors, setLegendColors] = useState([])
  const [globalscale, setGloblalScale] = useState({})
  const [timeframe, setTimeframe] = useState(['2020' ,'2021'])
  const [mapInfo, setMapInfo] = useState({})
  const [moreState, setMoreState] = useState(false)
  const [topC, setTopC] = useState([])
  const [topCState, setTopCState] = useState(false)


  function HexToArr(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return [ parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16) ]
  }
  //const interpolater = d3.scaleSequential(d3.interpolatePlasma).domain([colorscale.min, colorscale.max])
  const interpolater = d3.scaleLinear().domain([colorscale.min, colorscale.max]).range([[255,255,150], [51,102,0]])
  const interpolaterRGB = d3.scaleLinear().domain([colorscale.min, colorscale.max]).range(["rgb(255,255,150)", "rgb(51,102,0)"])

  useEffect(() =>{
    setDataset('WEO')
    setMetricCode('NGDP_RPCH')
    setMetricName('GDP Growth-Const. Prices')
  },[])

  useEffect(()=>{
    setMapTitle(metricName + ' - ' + year)
  },[metricName, year])

  useEffect(()=>{
    let url = `/api/data/v2map/datasets/${dataset}/timeframe`

    fetch(url)
      .then(response => response.json())
      .then(async(result) => {
        let dispYears = result['years']
        //setTimeframe(result['years'])
        setTimeframe(dispYears.reverse())
      })
  },[dataset])

  useEffect(()=>{
    let url = `/api/data/v2map/datasets/${dataset}/${metricCode}/${year}/${month}`
    let url1 = `/api/data/v2map/datasets/${dataset}/topC/${metricCode}/${year}/${month}`

    fetch(url)
      .then(response => response.json())
      .then(async(result) => {
        setMapData(result['geo'])
        setColorScale({min: Math.floor(result["min2"]), max: Math.ceil(result["max2"])})
      })

    fetch(url1)
      .then(response => response.json())
      .then(async(result) => {
        setTopC(result.slice(0,20))
      })
    },[dataset, metricCode, year])


  function AddIndicator(indicator) {
      let iShort = indicator.indicator
      let indicatorF = indicator.name

      setMetricCode(iShort)
      setMetricName(indicatorF)
  }

  function onChangeClick(e){
    e.preventDefault
    if (modalState == true){
      setModalState(false)
    }
    else if (modalState == false) {
      setModalState(true)
    }
  }

  useEffect(()=>{
    let stops = 40
    let incr = (colorscale.max-colorscale.min)/stops
    let colorList = []

    for(let i=0;i<stops;i++){
      let color = interpolaterRGB(colorscale.min+incr*i)
      colorList.push(color)
    }

    setLegendColors(colorList)

    const geoLayer = new GeoJsonLayer({
        id: "geomap",
        data: mapData,
        opacity: 0.9,
        stroked: true,
        visible: true,
        filled: true,
        extruded: false,
        wireframe: true,
        lineWidthMinPixels: 1,
        getElevation: (f) => 1000,
        getFillColor: (f) => {
            let metric = f.properties.metric

            if(metric != null){
              //return HexToArr(interpolater(metric/100))
              return(interpolater(metric))
              //return[230,100,150]
            }
            else {
              return [200,200,200,0.8]
            }
        },
        getLineColor: [200,200,200],
        getLineWidth: 1,
        pickable: true,
        onClick: info => setMapInfo(info),
        onHover: info => setMapInfo(info)
    })

    setLayers([geoLayer])
  },[colorscale])

  function timeClick(e){
    e.preventDefault;
    setYear(e.target.innerHTML);
  }

  function moreClick(e){
    e.preventDefault()
    setMoreState(true)
  }

  function lessClick(e){
    e.preventDefault()
    e.stopPropagation()
    setMoreState(false)
  }

  function topCShow(e){
    e.preventDefault()
    e.stopPropagation()
    setTopCState(true)
  }

  function topCClose(e){
    e.preventDefault()
    e.stopPropagation()
    setTopCState(false)
  }



  return (
    <div>
      <Navbar />
        <div className='mapBody'>
            <div className='mapIndicatorSelector'>
              <AddModal modalState={modalState} setModalState={setModalState} addIndicator={AddIndicator} />
            </div>
            <div className='mapTimeSelectorGroup'>
              {timeframe.slice(0,10).map((value)=>{
                return(<div className='mapTimeDiv' onClick={timeClick}>{value}</div>)
              })}
              <div className='mapTimeDiv mapTimeDivMore' onClick={()=>{setMoreState(true)}}>
                More
                <div className='iconMoreLess' onClick={moreClick}><MdExpandMore /></div>

                <div className='mapTimeMore' style={{display:moreState ? 'block':'none'}}>
                  <div className='iconMoreLess' onClick={lessClick}><MdExpandLess /></div>
                  <table className='mapTimeMoreTable'>
                    <tr onClick={lessClick}><th>Select One</th></tr>
                    {timeframe.slice(10).map((value)=>{
                      return(<tr onClick={timeClick}><td>{value}</td></tr>)
                    })}
                  </table>
                </div>
              </div>

              <div className='mapTopC'>
                Top 20 Countries
                <div className='iconMoreLess' onClick={topCShow}><MdExpandMore /></div>

                <div className='mapTopCBox' style={{display:topCState ? 'block':'none'}}>
                  <div className='iconMoreLess' onClick={topCClose}><MdExpandLess /></div>
                  <table className='mapTopCTable'>
                    <tr onClick={topCClose}><th colspan='2'>Top 20 Countries</th></tr>
                    {topC.map((value)=>{
                      return(<tr><td>{value.name}</td><td>{value.value}</td></tr>)
                    })}
                  </table>
                </div>
              </div>

            </div>

            <div className='mapDiv'>
              <div className='mapIcon'>
                <FaExchangeAlt onClick={onChangeClick}/>
              </div>
              <div className='mapTitle'>
                {mapTitle}
              </div>
              <DeckGL initialViewState={INITIAL_VIEW_STATE} layers={layers} controller={true}>
                <StaticMap mapStyle={BASEMAP.POSITRON} />
                {mapInfo.object && (
                  <div className='mapToolTip' style={{position:'absolute', zIndex: 999, pointerEvents: 'none', left:mapInfo.x+10, top:mapInfo.y-10}}>
                    {mapInfo.object.properties.ADMIN + ', '+mapInfo.object.properties.metric}
                  </div>
                )}
              </DeckGL>
              <div className='mapLegend'>
                {legendColors.map((color)=>{
                  return(<div className='mapLegendTile' style={{backgroundColor:color}}></div>)
                })}
                <div className='mapLegendTileLeft'>{colorscale.min}</div>
                <div className='mapLegendTileRight'>{colorscale.max}</div>
                <div className='mapLegendTitle'><p>Scale Range</p></div>
              </div>
            </div>


        </div>
    </div>
  )
}

export default CustomMap
