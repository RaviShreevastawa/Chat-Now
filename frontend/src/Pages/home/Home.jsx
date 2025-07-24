import Sidebar from '../../Components/Sidebar/Sidebar'
import MessageContainer from '../../Components/messages/MessageContainer'
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div className='flex flex-col md:flex-row w-full h-full bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 bg-transparent rounded-lg'>
        <Sidebar/>
        <MessageContainer/>
      </div>
      <Link to="/profile">Profile</Link>
    </>
  )
}

export default Home
