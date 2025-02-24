import React from 'react'
import Sidebar from '../../Components/Sidebar/Sidebar'
import MessageContainer from '../../Components/messages/MessageContainer'

function Home() {
  return (
    <>
      <div className='flex sm:h-[450px] md:h[550px] rounded-lg overflow-hidden bg-transparent bg-clip-padding'>
        <Sidebar/>
        <MessageContainer/>
      </div>
    </>
  )
}

export default Home
