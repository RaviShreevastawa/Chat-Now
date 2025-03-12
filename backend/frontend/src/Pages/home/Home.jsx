import React from 'react'
import Sidebar from '../../Components/Sidebar/Sidebar'
import MessageContainer from '../../Components/messages/MessageContainer'

function Home() {
  return (
    <>
      <div className='flex sm:h-[450px] md:h[550px] bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 bg-transparent rounded-lg'>
        <Sidebar/>
        <MessageContainer/>
      </div>
    </>
  )
}

export default Home
