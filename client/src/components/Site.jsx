import React from 'react'
import Header from './Header'
import Main from './Main'

export default function Site({ user }) {
    return (
        <div className='site'>
            <Header user={user} />
            <Main user={user} />
        </div>
    )
}
