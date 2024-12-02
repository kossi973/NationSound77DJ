import { useState} from 'react';

interface CarrouselProps {
    slides : string[];
}

// Carrousel: bloc1: décalage du contenu; bloc2: positionnement des flêches; bloc3: positionnement des boutons de pagination
const Carroussel: React.FC<CarrouselProps> = ({slides}) => {

    let [currentSlide, SetCurrentSlide] = useState(0);

    // sélectionner slide précédente
    let previousSlide = () => {
        if (currentSlide > 0) SetCurrentSlide(currentSlide - 1)
    };

    // sélectionner slide suivante
    let nextSlide = () => {
        if (currentSlide < slides.length-1) SetCurrentSlide(currentSlide + 1)
    };

    return (
        <div className="border relative overflow-hidden md:w-1/2 md:mx-auto mt-2">
            <div className="flex transition ease-out duration-700" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
	            {slides.map((slide, index) => ( <img key={index} src={slide} alt={"Slide"} className="w-full h-20 flex-shrink-0" /> ))}
            </div>

            <div className="absolute top-0 h-full w-full flex justify-between items-center text-white text-md px-2">
                <button onClick={previousSlide}>
                    <p className='rounded-full border bg-amber-500/80 px-2 active:bg-white/75'>❮</p>
                </button>
                <button onClick={nextSlide}>
                    <p className='rounded-full border bg-amber-500/80 px-2 active:bg-white/75'>❯</p>
                </button>
            </div>
            
            <div className="absolute bottom-0 pb-1 flex justify-center gap-5 w-full">
                {slides.map((slide, index) => {
                    return (
                        <div
                            onClick={() => {
                                SetCurrentSlide(index);
                            }}
                            key={slide && index} 
                            className={`rounded-full size-4 border cursor-pointer text-center active:bg-white/75
                            ${ index == currentSlide ? "bg-red-600/75" : "bg-amber-500"                                
                            }`}>
                            {/* <p className='invisible md:visible font-bold'>{index+1}</p> */}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Carroussel;