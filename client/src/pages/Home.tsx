import { useEffect, useState } from 'react'
import { Loader } from '../components/Loader';
import Card from '../components/Card';
import Pagination from '../components/Pagination';

const Home = () => {

  const [datas, setDatas] = useState<any>([]);
  const [paginationDatas, setPaginationDatas] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [clearSearchTimeOut, setClearSearchTimeOut] = useState<any>(null);
  
  useEffect(() => {
    let setLoadingTimeOut:any = null;
    let getDatas = async() => {
      setLoading(true);
      try {
        let response = await fetch(`/api/v1/post`, {
          method:"GET",
          headers:{
            'Content-type': 'application/json',
          },
        });
        
        let datas = await response.json();
        setDatas(datas.data);
      } catch (error) {
        console.log(error);
      }finally{
        setLoadingTimeOut = setTimeout(() => {
          setLoading(false);
        }, 1000);
      };
    };
    getDatas();
    
    return () => {
      clearTimeout(setLoadingTimeOut);
    }
  }, []);


  const handleSearchFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(clearSearchTimeOut);
    let search = e.target.value;
    setSearchParams(search);
    setClearSearchTimeOut(
      setTimeout(() => {
        let searchItems = datas.filter((list:any) => list.name.toLowerCase().includes(search.toLowerCase()) || list.description.toLowerCase().includes(search.toLowerCase()));
        setSearchList(searchItems);
        console.log(searchParams);
      }, 200)
    );
  }
  
  return (
    <div className='container max-w-7xl mx-auto w-full min-h-[calc(100vh-70px)] py-[30px]'>
      <h1 className='font-sans font-bold text-2xl mb-4'>The Available Image were created by OpenAI</h1>
      <p className='font-sans font-normal text-base mb-4'>
        MidJourney and DALL-E are taking over social media. Dive into the world of artificial intelligence and build your own version of these tools that can generate everything from memes and art to beautiful UI/UX designs!
      </p>
      <div className="py-5 w-full flex flex-col items-start">
        <h5 className='font-sans font-bold text-lg mb-3'>Find a available Image by Prompt</h5>
        <form className="flex justify-start max-w-2xl w-full">   
          <label htmlFor="prompt-search" className="sr-only">Search</label>
          <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 me-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input type="text" id="prompt-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by your prompt..." value={searchParams} onChange={(e)=>handleSearchFunc(e)}/>
          </div>
        </form>
        {
          searchParams !== "" && 
          <p className='font-sans font-normal text-base mt-4'>
            Search results for {searchParams}...
          </p>
        }
      </div>
      <div className="w-full min-h-[500px] flex flex-col justify-center items-center pt-10 pb-20 relative">
          {
            loading ?
            <Loader/>
            :
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {
                paginationDatas.length > 0 ?
                <>
                  {
                    paginationDatas.map((list:any) => (
                    <Card {...list} key={list._id}/>
                    ))
                  }
                </>
                :
                <h5 className='font-sans font-bold text-lg mb-3'>Your searching are not found</h5>            
              }
            </div>
          }
          {
            searchParams == "" ?
            <Pagination datas={datas} setPaginationDatas={setPaginationDatas}/>
            :
            <Pagination datas={searchList} setPaginationDatas={setPaginationDatas}/>
          }
      </div>
    </div>
  )
}

export default Home