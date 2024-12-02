import { useState} from 'react';
import FetchData from '../components/FetchData';

interface MsgProps {
    id: number,
    information: string,
    prioriteInfo: number,
  }

// Carrousel de messages: bloc1: décalage du contenu; bloc2: positionnement des flêches; bloc3: positionnement des boutons de pagination
function AfficherCarrouselInfos () {
    const [infos, setInfos] = useState<MsgProps[]>([]);

    FetchData('informations/?format=json', setInfos);

    let [currentSlide, SetCurrentSlide] = useState(0);

    // sélectionner slide précédente
    let previousSlide = () => {
        if (currentSlide > 0) SetCurrentSlide(currentSlide - 1)
    };

    // sélectionner slide suivante
    let nextSlide = () => {
        if (currentSlide < infos.length-1) SetCurrentSlide(currentSlide + 1)
    };

    return (
        <div className={`rounded-md shadow-md shadow-black border-1 border-blue-500 relative overflow-hidden bg-gray-100/90 md:w-1/2 md:mx-auto ${infos.length > 0 ? "" : "hidden"}`}>
            <p className='text-center bg-blue-600 font-bold'>!! INFOS !!</p>
            <div className="flex transition ease-out duration-700" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
	            {infos.map((msg, index) => ( 
                    <p key={index} className="italic text-md text-blue-800 font-bold md:text-center w-full h-24 flex-shrink-0 pt-2 md:pt-5 px-8">
                        {msg.information}
                    </p>
                ))}
            </div>

            <div className="absolute top-0 h-full w-full flex justify-between items-center text-blue-500 text-xl px-2">
                <button onClick={previousSlide}>
                    <p className='rounded-full bg-gray-500/20 px-2 active:text-2xl active:text-blue-700'>❮</p>
                </button>
                <button onClick={nextSlide}>
                    <p className='rounded-full bg-gray-500/20 px-2 active:text-2xl active:text-blue-700'>❯</p>
                </button>
            </div>
            
            <div className="absolute bottom-0 pb-1 flex justify-center gap-5 w-full">
                {infos.map((msg, index) => {
                    return (
                        <div
                            onClick={() => {
                                SetCurrentSlide(index);
                            }}
                            key={msg.id && index} 
                            className={`rounded-full size-3 border border-blue-700 cursor-pointer text-center active:bg-white/75
                            ${ index == currentSlide ? "bg-blue-700/75" : ""                                
                            }`}>
                            {/* <p className='invisible md:visible font-bold'>{index+1}</p> */}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default AfficherCarrouselInfos;