import React, {useEffect, useState} from "react"

import Navbar from '../../components/navbar';

function WeoDef() {

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
                Definitions & Notes
              </div>
              <div>
                  <table className='aboutTable'>
                      <tr>
                          <th>#</th>
                          <th>Indicator</th>
                          <th>Name</th>
                          <th>Definition and Notes</th>
                      </tr>
                      {
                        definitions.map((defi, index) =>{
                          let ind = Object.keys(defi)
                          let name = defi[ind]['name']
                          let def = defi[ind]['def']
                          let sn = index+1
                          return(
                            <tr>
                              <td>{sn}</td>
                              <td>{ind}</td>
                              <td>{name}</td>
                              <td>{def}</td>
                            </tr>
                          )
                        })
                      }
                  </table>
              </div>
          </div>

    </div>
  )
}

export default WeoDef
