import Assets from '../assets';
import { Link } from 'react-router-dom';

type Props = {
    _id: string,
    name: string,
    description: string,
    image: string,
}

const Card = ({_id, name, description, image}:Props) => {
  return (
    <div className="group max-w-[300px] max-h-[300px] relative cursor-pointer overflow-hidden">
        <Link to={`/detail/${_id}`}>
            <img src={`${image}`} alt={description} className='w-full h-full object-contain'/>
        </Link>
        
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-[#00000033] max-h-0 opacity-0 group-hover:max-h-[40%] group-hover:opacity-100 ease-in-out duration-300">
            <p className='font-sans font-normal text-base text-white mb-2'>
                {description.slice(0, 60)} <span>...</span>
            </p>
            <div className="w-full flex justify-between">
                <div className="flex flex-row">
                <div className="w-7 h-7 rounded-full bg-green-100 me-2 flex justify-center items-center">     
                    <h5 className='font-sans font-bold text-lg'>{name[0]}</h5>
                </div>
                <h5 className='font-sans font-bold text-medium text-white'>{name}</h5>
                </div>
                <Link to={image} className="w-7 h-7 rounded-full bg-green-100 hover:bg-green-200  flex justify-center items-center">
                <img src={Assets.download} alt="download" className='w-full h-full object-contain'/>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default Card
