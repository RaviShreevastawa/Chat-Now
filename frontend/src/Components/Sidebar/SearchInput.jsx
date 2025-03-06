import React from 'react'
import { IoSearchSharp } from "react-icons/io5";
import useConversation from '../../zustand/useConversation';
import useGetConversation from '../../hooks/useGetConversations'
import toast from 'react-hot-toast';
import { useState } from 'react';

function SearchInput() {

  const [search, setSearch] = useState("");
  const {setSelectedConversation} = useConversation();
  const { conversations } = useGetConversation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!search) return;

    if (search.length < 3){
      return toast.error("Search term must be three charecters long ")
    }

    const conversation = conversations.find((c) => c.fullname.toLowerCase().includes(search.toLowerCase()))

    if(conversation){
      setSelectedConversation(conversation)
      setSearch('')
    }else{
      toast.error("No User Found!")
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}
      className='flex items-center gap-2'>
        <input 
        type="text" 
        placeholder='Search'
        className='input input-bordered rounded-full bg-transparent'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
