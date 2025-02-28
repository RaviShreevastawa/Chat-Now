import React, { useState } from 'react'
import GenderCheckBox from './GenderCheckBox'
import { Link } from 'react-router-dom'
import useSignUp from '../../hooks/useSignUp.js';

function SignUp() {

    const [input, setInput] = useState({
        fullname : '',
        username : '',
        password : '',
        confirmPassword : '',
        gender : ''
    });

    const {loading, signup} = useSignUp();

    const handleCheckboxChange = (gender) => {
        setInput({...input, gender})
    }

    const handleSubmit =  async (e) => {
        e.preventDefault()
        await signup(input)
    }
  return (
    <>
    <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
        <div className='w-full p-6 rounded-lg shadow-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 bg-transparent'>
            <h1 className='text-3xl font-semibold text-center text-gray-300'>Register</h1>
            <span className='text-blue-500'>ChapApp</span>

            <form onSubmit={handleSubmit}>
                <div>
                    <label className='label p-2'>
                        <span className='text-base label-text'>FullName</span>
                    </label>
                    <input 
                    type="text" 
                    placeholder='Enter FullName'
                    value={input.fullname}
                    onChange={(e) => setInput({...input, fullname: e.target.value})}
                    className='w-full input input-bordered h-10 bg-transparent'
                    />
                </div>
                <div>
                    <label className='label p-2'>
                        <span className='text-base label-text'> Username</span>
                    </label>
                    <input 
                    type="text" 
                    placeholder='Enter username'
                    value={input.username}
                    onChange={(e) => setInput({...input, username: e.target.value})}
                    className='w-full input input-bordered h-10 bg-transparent'
                    />
                </div>
                <div>
                    <label className='label p-2'> 
                        <span className='text-base label-text'>Password</span>
                    </label>
                    <input 
                    type="text" 
                    placeholder='Password'
                    value={input.password}
                    onChange={(e) => setInput({...input, password: e.target.value})}
                    className='w-full input input-bordered h-10 bg-transparent'
                    />
                </div>
                <div>
                    <label className='label p-2'> 
                        <span className='text-base label-text'>Confirm Password</span>
                    </label>
                    <input 
                    type="text" 
                    placeholder='Confirm Password'
                    value={input.confirmPassword}
                    onChange={(e) => setInput({...input, confirmPassword: e.target.value})}
                    className='w-full input input-bordered h-10 bg-transparent'
                    />
                </div>
                 
                 <GenderCheckBox onCheckboxChange = {handleCheckboxChange} selectedGender={input.gender}/>

                <Link 
                    to={'/login'}
                    className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block' >
                    Already have an account
                </Link>
                <div>
                    <button
                    className='btn btn-block btn-sm mt-2 bg-transparent'
                    disabled={loading}
                    >{loading ? <span className='loading loading-spinner'></span> : "SignUp"}</button>
                </div>
            </form>
        </div>
    </div>
    </>
  )
}

export default SignUp
