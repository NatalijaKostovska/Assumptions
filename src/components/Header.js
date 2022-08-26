import React from 'react';
import iwconnectLogo from './assets/images/iwconnect-logo.png'

function Header() {

    return (
        <div className="header">
            <img src={iwconnectLogo} alt="iw-logo" className="iw-logo" />
        </div>
    )
}

export default Header