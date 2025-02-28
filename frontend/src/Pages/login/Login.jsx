import React from 'react'
import { Link } from 'react-router-dom'

function Login() {
  return (
    <>
    <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
        <div className='w-full p-6 rounded-lg shadow-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 bg-transparent'>
            <h1 className='text-3xl font-semibold text-center text-gray-300'>Login</h1>
            <span className='text-blue-500'>ChapApp</span>

            <form>
                <div>
                    <label className='label p-2'>
                        <span className='text-base label-text'> Username</span>
                    </label>
                    <input 
                    type="text" 
                    placeholder='Enter username'
                    className='w-full input input-bordered h-10 bg-transparent'
                    />
                </div>
                <div>
                    <label className='label'> 
                        <span className='text-base label-text'>Password</span>
                    </label>
                    <input 
                    type="text" 
                    placeholder='Password'
                    className='w-full input input-bordered h-10'
                    />
                </div>
                <div>
                    <Link to={"/signup"}
                    className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block'>
                      {"Don't"} have an account?
                    </Link>
                </div>
                <div>
                    <button
                    className='btn btn-block btn-sm mt-2'
                    >Login</button>
                </div>
            </form>
        </div>
    </div>
    </>
  )
}

export default Login
