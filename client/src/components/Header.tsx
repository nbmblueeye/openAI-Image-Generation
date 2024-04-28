import { Link, useLocation, useNavigate } from 'react-router-dom'
import Assets from '../assets'

const Header = () => {

  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className='bg-slate-200 w-full h-[70px] px-4'>
        <div className="container max-w-7xl mx-auto w-full flex justify-between items-center h-full">
          <Link to="/" className='hover:bg-slate-400 p-2 rounded bg-slate-300'>
              <img src={Assets.logo} alt="logo" className="h-[30px] md:h-[50px] object-contain"/>
          </Link>
          {pathname == "/" && <button className="px-3 md:px-4 py-2 md:py-3 bg-slate-300 text-black text-base md:text-lg font-sans font-medium rounded hover:bg-slate-400" onClick={() => navigate("/post")}>
            Create a Image
          </button>}
        </div>
    </header>
  )
}

export default Header