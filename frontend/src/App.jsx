import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./Pages/home/home"
import Login from "./Pages/login/Login"
import SignUp from "./Pages/signup/SignUp"
import {Toaster} from 'react-hot-toast'
import { useAuthContext } from "./Context/AuthContext"

function App() {
   const {authUser} = useAuthContext();

  return (
    <>
       <div className="p-4 h-screen flex items-center justify-center">
        <Routes>
          <Route path="/" element={authUser ? <Home/> : <Navigate to={'/login'}/>} />
          <Route path="/login" element={authUser ? <Navigate to={'/'} /> : <Login/>} />
          <Route path="/signup" element={authUser ? <Navigate to={'/'}/> : <SignUp/>} />
        </Routes>
        <Toaster/>
       </div>
    </>
  )
}

export default App


