import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./Pages/home/Home.jsx"
import Login from "./Pages/login/Login.jsx"
import SignUp from "./Pages/signup/SignUp.jsx"
import {Toaster} from 'react-hot-toast'
import { useAuthContext } from "./Context/AuthContext.jsx"
import Profile from "./Pages/profile/Profile.jsx"

function App() {
   const {authUser} = useAuthContext();

  return (
    <>
       <div className="h-screen flex items-center justify-center">
        <Routes>
          <Route path="/" element={authUser ? <Home/> : <Navigate to={'/login'}/>} />
          <Route path="/login" element={authUser ? <Navigate to={'/'} /> : <Login/>} />
          <Route path="/signup" element={authUser ? <Navigate to={'/'}/> : <SignUp/>} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Toaster/>
       </div>
    </>
  )
}

export default App


