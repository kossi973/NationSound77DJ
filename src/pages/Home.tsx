import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ProgrammeProps } from '../config/Context';
import FormaterDate from '../components/FormaterDate';
import AfficherTitre from '../components/AfficherTitre';
import FetchData from '../components/FetchData';
import { ArtisteProps } from '../config/Context';
import { CalendrierProps } from '../config/Context';
import AfficherCarrouselMsgUrgents from '../components/AfficherCarrouselMsgUrgents';
import AfficherCarrouselInfos from '../components/AfficherCarrouselInfos';
import CarrousselAutoAR from '../components/CarousselAutoAR';

const logoUrl = '/images/logo-ns.png';

// Afficher la page d'accueil avec le programme du festival et les liens vers la programmation, la billeterie et la carte interactive
function Home() {
    const [calendrier, setCalendrier] = useState<CalendrierProps[]>([]);
    const [programme, setProgramme] = useState<ProgrammeProps[]>([]);
    const [artistesList, setArtistesList] = useState<ArtisteProps[]>([]);
    const [events, setEvents] = useState<{[key: string]: ProgrammeProps[]}>({});

    FetchData('calendriers/?format=json', setCalendrier); // Récupérer le calendrier du festival trié par jour
    FetchData('programmes/?format=json', setProgramme); // Récupérer le programme du festival trié par jour et horaire
    FetchData('artistes/?format=json', setArtistesList); // Récupérer la liste des artistes trié par nom

    useEffect(() => {
        // Grouper les événements par jours
        const grouperJours = programme.reduce((acc: { [key: string]: ProgrammeProps[] }, event: ProgrammeProps) => {
            if (!acc[event.jour_festival]) {
                acc[event.jour_festival] = [];
            }
            acc[event.jour_festival].push(event);
            return acc;
        }, {} as { [key: string]: ProgrammeProps[] });
        setEvents(grouperJours); // Définir le programme journalier

    },[programme]);

    return (
        // page principale SOUND NATION: afficher la synthèse du nombre d'artistes, de concerts, de jours et le programme par jour avec le visuel des artistes
        <main className='min-h-screen bg-hero'>
            <div className='min-h-screen bg-amber-600/90 flex contain-fluid overflow-hidden grid text-yellow-100'>
                <AfficherTitre titre="FESTIVAL NATION SOUND" />
                <AfficherCarrouselMsgUrgents />
                <CarrousselAutoAR tempo={3000}/> 
                <div>
                    <p className='text-center text-yellow-200 font-bold italic text-2xl lg:text-3xl xl:text-4xl bg-blue-800/80 py-1 w-full md:w-1/2 mx-auto my-1 border rounded-lg'>{artistesList.length} artistes - {programme.filter(prog => prog.event === "Live").length} concerts - {calendrier.length} jours</p>
                </div>
                <div className='font-bold h-auto w-full md:w-1/2 mx-auto bg-blue-800/80 border rounded-lg shadow-lg shadow-orange-300'>
                    { Object.keys(events).map((jour: string ) => (
                        <div key={jour} className='mb-16'>
                            <p className='mt-4 text-xl md:text-2xl text-center'>-- JOUR {jour} --</p>
                            <p className='text-yellow-400 text-xl md:text-2xl text-center'>{calendrier.map((cal) => cal.jour_festival == +jour ? FormaterDate(cal.date_festival) : "")}</p>
                            <hr className='my-2'></hr>
                            <ul className='pl-8 xl:pl-64'>
                                {events[jour].map((event, index) => (
                                    <li key={index} className='my-4'>                                                                              
                                        <div className='flex'>
                                            <img src={event.artiste?.visuel || logoUrl} alt="Nation Sound" className='rounded-md w-12 h-12 lg:size-24'/>
                                            <div className='pl-4 my-auto italic text-lg md:text-xl'>                                                
                                                <p>{event.horaire.slice(0,5)} {event.event} {event.artiste?.nom}</p>
                                                <div className='text-yellow-100/75'>
                                                    <span className='pl-2 text-md'>» </span>
                                                    <span>scène {event.scene}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <hr className='my-2'></hr>  
                        </div>
                    ))}
                </div>

                <AfficherCarrouselInfos />
                
                <button className='h-14 w-full mb-1 md:w-1/2 px-8 mx-auto text-xl font-bold border rounded-lg bg-blue-800/80 shadow-lg shadow-orange-300 hover:ring hover:ring-violet-300 active:shadow-xl active:bg-amber-500'>
                  <Link to={"/Programmation"}>PROGRAMMATION</Link>
                </button>
                <button className='h-14 w-full mb-1 md:w-1/2 px-8 mx-auto text-xl font-bold border rounded-lg bg-blue-800/80 shadow-lg shadow-orange-300 hover:ring hover:ring-violet-300 active:shadow-xl active:bg-amber-500'>
                    <a href="https://widget.weezevent.com/ticket/E1243365/?code=2782&locale=fr-FR&width_auto=1&color_primary=0032FA">BILLETTERIE</a>
                </button>
                <button className='h-14 w-full mb-1 md:w-1/2 px-8 mx-auto text-xl font-bold border rounded-lg bg-blue-800/80 shadow-lg shadow-orange-300 hover:ring hover:ring-violet-300 active:shadow-xl active:bg-amber-500'>
                  <Link to={"/NationMap"}>CARTE INTERACTIVE</Link>
                </button>
            </div>
        </main>
    );
}

export default Home;