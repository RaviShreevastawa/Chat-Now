import React from 'react'
import { IoSearchSharp } from "react-icons/io5";

function SearchInput() {
  return (
    <>
      <form className='flex items-center gap-2'>
        <input 
        type="text" 
        placeholder='Search'
        className='input input-bordered rounded-full bg-transparent'
        />
        <button 
        type='submit'
        className='btn btn-circle bg-transparent text-white'>
          <IoSearchSharp  className='w-6 h-6 outline-none'/>
        </button>
      </form>
    </>
  )
}

export default SearchInput
