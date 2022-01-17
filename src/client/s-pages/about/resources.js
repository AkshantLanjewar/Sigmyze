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
              <td>Apr 2021</td>
              <td>
                Dataset includes 45+ economic indicators for 190+ countries and regions.
                Data for most countries is from 1980 through 2025.
                Sourced from World Economic Outlook published by the IMF (International Monetary Fund).
              </td>
              <td>
                Bi-annual
                <br/>Apr and Oct
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
          </table>
        </div>


      </div>

    </div>
  )
}

export default ResourcesPage
