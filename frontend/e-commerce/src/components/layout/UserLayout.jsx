import { Outlet } from "react-router-dom"
import Footer from "../common/Footer"
import Header from "../common/Header"


const UserLayout = () => {
  return (
   <>
    {/* header */}
    <Header/>

     {/* main content */}
     <main>
      <Outlet/>
     </main>


      {/* footer */}
      <Footer/>
   </>
  )
}

export default UserLayout