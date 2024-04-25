import { Link, useLocation, useNavigate } from 'react-router-dom'
import Assets from '../assets'

const Header = () => {

  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className='bg-slate-200 w-full h-[70px] px-10'>
        <div className="container max-w-7xl mx-auto w-full flex justify-between items-center h-full">
            <Link to="/" className='hover:bg-slate-300 p-2 rounded'>
                <img src={Assets.logo} alt="logo" className="h-[50px] object-contain"/>
            </Link>
           {pathname == "/" && <button className="px-4 py-3 bg-slate-400 text-black text-base font-sans font-medium rounded hover:bg-slate-500" onClick={() => navigate("/post")}>Create a Image</button>}
        </div>
    </header>
  )
}

export default Header