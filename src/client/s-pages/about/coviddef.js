import React, {useEffect, useState} from "react"

import Navbar from '../../components/navbar';

function CovidDef() {


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
                      <tr>
                          <td>1</td>
                          <td>WCC</td>
                          <td>Confirmed COVID Cases - Cumulative</td>
                          <td>Cumulative, daily confirmed COVID cases for the region, since the start of the COVID pandemic, based on data collected and reported at the national level. Data updated on a daily basis.</td>
                      </tr>
                      <tr>
                          <td>2</td>
                          <td>WCD</td>
                          <td>Confirmed COVID Deaths - Cumulative</td>
                          <td>Cumulative, daily confirmed COVID deaths for the region, since the start of the COVID pandemic, based on data collected and reported at the national level. Data updated on a daily basis.</td>
                      </tr>
                      <tr>
                          <td>3</td>
                          <td>NCC</td>
                          <td>Confirmed COVID Cases - New</td>
                          <td>New, daily confirmed COVID cases for the region. Based on data collected and reported at the national level. Data updated on a daily basis.</td>
                      </tr>
                      <tr>
                          <td>4</td>
                          <td>NCD</td>
                          <td>Confirmed COVID Deaths - New</td>
                          <td>New, daily confirmed COVID deaths for the region. Based on data collected and reported at the national level. Data updated on a daily basis.</td>
                      </tr>
                  </table>
              </div>
          </div>

    </div>
  )
}

export default CovidDef
