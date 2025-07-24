import React from 'react'
import SearchInput from './SearchInput'
import Conversations from './Conversations'
import LogoutButton from './LogoutButton'

function Sidebar() {
  return (
    <>
      <div className='border-slate-500 mt-8 flex flex-col w-1/5'>
        <SearchInput/>
        <div className='divider px-3'></div>
        <Conversations/>
        <LogoutButton/>
      </div>
    </>
  )
}

export default Sidebar
