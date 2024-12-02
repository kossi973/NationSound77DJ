import { useState, useEffect} from 'react';
import FetchData from '../components/FetchData';

interface MsgProps {
    id: number,
    msgUrgent: string,
    prioriteMsg: number,
  }

// Carrousel de messages: bloc1: décalage du contenu; bloc2: positionnement des flêches; bloc3: positionnement des boutons de pagination
function AfficherCarrouselMsgUrgents () {
    const [messagesUrgents, setMessagesUrgents] = useState<MsgProps[]>([]);

    FetchData('messagesUrgents/?format=json', setMessagesUrgents);

    // gérer le clignotement du message
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(!visible)}, visible ? 3000 : 500); // Change l'état visible 3s, invisible 0,5s
        return () => clearInterval(interval); // Nettoyer l'intervalle lors du démontage du composant
    }, [visible]);

    // gérer la sélection des slides
    let [currentSlide, SetCurrentSlide] = useState(0);
    // sélectionner slide précédente
    let previousSlide = () => {
        if (currentSlide > 0) SetCurrentSlide(currentSlide - 1)
    };

    // sélectionner slide suivante
    let nextSlide = () => {
        if (currentSlide < messagesUrgents.length-1) SetCurrentSlide(currentSlide + 1)
    };

    return (
        <div className={`rounded-md shadow-md shadow-white border-1 border-red-500 relative overflow-hidden bg-gray-100/90 md:w-1/2 md:mx-auto mt-1 ${messagesUrgents.length > 0 ? "" : "hidden"}`}>
            <p className='text-center bg-red-600 font-bold'>!!! ALERTES !!!</p>
            <div className="flex transition ease-out duration-700" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
	            {messagesUrgents.map((msg, index) => ( 
                    <p key={index} className="italic text-md text-red-500 font-bold md:text-center w-full h-24 flex-shrink-0 pt-2 px-8" style={{ opacity: visible ? 1 : 0 }}>
                        {msg.msgUrgent}
                    </p>
                ))}
            </div>

            <div className="absolute top-0 h-full w-full flex justify-between items-center text-red-500 text-xl px-2">
                <button onClick={previousSlide}>
                    <p className='rounded-full bg-gray-500/20 px-2 active:text-2xl active:text-red-700'>❮</p>
                </button>
                <button onClick={nextSlide}>
                    <p className='rounded-full bg-gray-500/20 px-2 active:text-2xl active:text-red-700'>❯</p>
                </button>
            </div>
            
            <div className="absolute bottom-0 pb-1 flex justify-center gap-5 w-full">
                {messagesUrgents.map((msg, index) => {
                    return (
                        <div
                            onClick={() => {
                                SetCurrentSlide(index);
                            }}
                            key={msg.id && index} 
                            className={`rounded-full size-3 border border-red-700 cursor-pointer text-center active:bg-white/75
                            ${ index == currentSlide ? "bg-red-700/75" : ""                                
                            }`}>
                            {/* <p className='invisible md:visible font-bold'>{index+1}</p> */}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default AfficherCarrouselMsgUrgents;