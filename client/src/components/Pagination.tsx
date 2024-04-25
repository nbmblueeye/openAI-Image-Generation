import { useEffect, useState } from 'react'

const Pagination = ({datas, setPaginationDatas}:any) => {

    const [currentPages, setCurrentPages] = useState(1);
    const [limit] = useState<number>(12);
    const totalPages:number = Math.ceil(datas.length/limit);
    let startIndex = (currentPages - 1) * limit;
    let endIndex = (startIndex + limit) - 1;
  
    const pages = [];
    for(let i = 1; i <= totalPages; i++) {
       pages[i] = i
    }

    useEffect(() => {
        let setPaginationTO = setTimeout(() => {
            setPaginationDatas(() => datas.slice(startIndex, endIndex + 1));
        }, 300);
        return () => {
            clearTimeout(setPaginationTO);
        }
    }, [datas, currentPages])

    return ( 
        <div className="w-full flex justify-center items-center absolute bottom-0 left-0 right-0">
            {
                totalPages > 1 && 
                <ul className="list-style-none flex">
                    <li className='me-2'>
                        <button className="relative block rounded bg-neutral-200 px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-300 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white" onClick={() => setCurrentPages(()=>currentPages > 1 ? currentPages - 1:currentPages)}>
                            Previous
                        </button>
                    </li>
                    {
                    pages.map(page => (
                        <li className='me-2' key={page}>
                            <button className={`relative block rounded  px-3 py-1.5 text-sm text-neutral-800 transition-all duration-300 hover:bg-neutral-300 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white ${ page == currentPages ? "bg-neutral-400":"bg-neutral-200"}`} onClick={() => setCurrentPages(page)}>
                                {page}
                            </button>
                        </li>
                    ))
                    }
                    <li className='ms-2'>
                        <button className="relative block rounded bg-neutral-200 px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-300 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white" onClick={() => setCurrentPages(()=>currentPages < totalPages ? currentPages + 1 : currentPages)}>
                            Next
                        </button>
                    </li>
                </ul>
            }
        </div>
    )
}

export default Pagination