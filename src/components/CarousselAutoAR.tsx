import { useEffect, useState} from 'react';
import FetchData from '../components/FetchData';

interface CarrouselProps {
    id: number,
    image: string,
    prioriteImage: number,
  }

  interface TempoProps{
    tempo : number,
  }

// CarrousselAutoAR: bloc1: décalage automatique du contenu en fonction de la temporisation; bloc2: positionnement des flêches; bloc3: positionnement des boutons de pagination
const CarrousselAutoAR: React.FC<TempoProps> = ({tempo}) => {
    const [slides, setSlides] = useState<CarrouselProps[]>([]);

    FetchData('carrousel/?format=json', setSlides);

    let [currentSlide, setCurrentSlide] = useState(0);
    let [sensDéfilement, setSensDéfilement] = useState("droite");

    // sélectionner slide précédente
    let previousSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1)
        } else setSensDéfilement("droite");  
    } ;

    // sélectionner slide suivante
    let nextSlide = () => {
        if (currentSlide < slides.length-1) {
            setCurrentSlide(currentSlide + 1)
        } else setSensDéfilement("gauche");        
    };

    // Défilement automatique des diapos en fonction de la temporisation
    useEffect(() => {
         const interval = setInterval(() => { sensDéfilement == "droite" ? nextSlide() : previousSlide(); }, tempo); 

         return () => clearInterval(interval); // Nettoyer l'intervalle lors du démontage du composant
    }, [currentSlide,sensDéfilement]);

    return (
        <div className={`rounded-lg border relative overflow-hidden md:w-1/2 md:mx-auto mt-1 ${slides.length > 0 ? "" : "hidden"}`}>
            <div className="flex transition ease-out duration-700" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
	            {slides.map((slide, index) => ( <img key={index} src={slide.image} alt={"Slide"} className="w-full h-48 md:h-64 lg:h-96 flex-shrink-0" /> ))}
            </div>

            <div className="absolute top-0 h-full w-full flex justify-between items-center text-white text-md px-2">
                <button onClick={previousSlide}>
                    <p className='rounded-full border bg-white/30 px-2 active:bg-white/75'>❮</p>
                </button>
                <button onClick={nextSlide}>
                    <p className='rounded-full border bg-white/30 px-2 active:bg-white/75'>❯</p>
                </button>
            </div>
            
            <div className="absolute bottom-0 pb-1 flex justify-center gap-5 w-full">
                {slides.map((slide, index) => {
                    return (
                        <div
                            onClick={() => {
                                setCurrentSlide(index);
                            }}
                            key={slide && index} 
                            className={`rounded-full size-3 border cursor-pointer text-center active:bg-white/75
                            ${ index == currentSlide ? "bg-blue-600/75" : ""                                
                            }`}>
                            {/* <p className='invisible md:visible font-bold'>{index+1}</p> */}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default CarrousselAutoAR;