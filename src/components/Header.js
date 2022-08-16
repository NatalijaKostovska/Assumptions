import React from 'react';
import iwconnectLogo from './assets/images/iwconnect-logo.png'

function Header() {

    return (
        <div className="header">
            Assumptions
            <img src={iwconnectLogo} className="iw-logo" />
        </div>
    )
}

export default Header