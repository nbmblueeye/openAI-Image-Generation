import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

const App = () => {

  return (
    <>
        <Header/>
        <main className="bg-slate-50 px-10">
            <Outlet/>
        </main>
    </>
  )
}

export default App