import React, {useState} from 'react';

import UnloggedView from './views/unlog'
import LoggedView from './views/log'

function Homepage(props) {
    let setLoginState = props.setLoginState
    let loggedIn = props.loggedIn.logged

    return (
        <div>
            <div className='main'>
                { loggedIn ? <LoggedView /> : <UnloggedView setLoginState={setLoginState}  /> }
            </div>
        </div>
    )
}

export default Homepage
