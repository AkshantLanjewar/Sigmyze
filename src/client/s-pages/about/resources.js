import React, {useEffect, useState} from "react"

import Navbar from '../../components/navbar';

function ResourcesPage() {

  const [definitions, setDefinitions] = useState([])

  const getDef = async() =>{
    let url = `/api/data/v2/datasets/WEO/definitions`
    const response = await fetch(url)
    const data = await response.json()
    setDefinitions(data['data'])
  }

  useEffect(()=>{
    getDef();
  },[])

  return(
    <div>
      <Navbar />
      <div className='aboutBody'>

        <div className='aboutResource'>
          Datasets Live
        </div>

        <div>
          <table className='aboutTable'>
            <tr>
              <th>#</th>
              <th>Dataset</th>
              <th>Source</th>
              <th>Version</th>
              <th>Description</th>
              <th>Update Frequency</th>
            </tr>
            <tr>
              <td>1</td>
              <td>World Economic Outlook (WEO)</td>
              <td>IMF</td>
              <td>Oct 2021</td>
              <td>
                <p>
                  Dataset includes 45+ economic indicators for 190+ countries and regions under 5 primary categories - GDP, Govt Finance, People, Trade and Investment. Savings and inflation are under Investment.
                  Data for most countries is from 1980 through 2026.
                </p>
                <p style={{marginTop:'3px'}}>
                  Sourced from World Economic Outlook published by the IMF (International Monetary Fund).
                </p>
              </td>
              <td>
                <p>Bi-annual - Apr and Oct</p>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>COVID</td>
              <td>Johns Hopkins</td>
              <td>Daily</td>
              <td>
                <p>
                  4 important Covid indicators at the national level for 190+ countries - Confirmed Cases (cumulative), Confirmed Deaths (Cumulative), New Cases (Daily), New Deaths (Daily).
                  Data for most countries is from 1980 through 2026.
                </p>
                <p style={{marginTop:'3px', fontStyle:'italic', fontSize:'0.6rem'}}>Coming Soon! - State and County-wise breakdown and maps</p>
              </td>
              <td>
                <p>Daily</p>
              </td>
            </tr>
          </table>
        </div>

        <div className='aboutResource'>
          Data Definitions & Notes
        </div>

        <div>
          <table className='aboutTable'>
            <tr>
              <th>#</th>
              <th>Dataset</th>
              <th>Definitions & Notes</th>
            </tr>
            <tr>
              <td>1</td>
              <td>WEO</td>
              <td><a href='/weodef' className='resURL'> Click here </a></td>
            </tr>
            <tr>
              <td>2</td>
              <td>COVID</td>
              <td><a href='/coviddef' className='resURL'> Click here </a></td>
            </tr>
          </table>
        </div>


      </div>

    </div>
  )
}

export default ResourcesPage
