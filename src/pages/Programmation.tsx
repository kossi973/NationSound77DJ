import { CalendrierProps, ArtisteProps } from '../config/Context';
import { useState, useEffect, ChangeEvent } from 'react';
import { ProgrammeProps } from '../config/Context';
import FicheArtiste from '../components/FicheArtiste';
import FetchData from '../components/FetchData';
import AfficherTitre from '../components/AfficherTitre';
import Tranche2H from '../components/Tranche2H';

type SelectFilters1Props = {
    defaultValue: number;
    onSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options : number[];
};

type SelectFilters2Props = {
    defaultValue: string;
    onSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

type SelectFilters3Props = {
    defaultValue: string;
    onSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options : string[];
};

// Initialiser les valeurs de filtres par défaut
const defaultStylesList = ["Styles","Blues","Jazz","Reggae","Rock","Salsa","Zouk"];
const defaultJoursList = [1,2,3];
const defaultScenesList = [1,2,3,4,5];
const defaultHoraire = "00:00";

function SelectJour({defaultValue, onSelect, options}: SelectFilters1Props) {  // Afficher la liste des jours
    return (
        <div className='font-bold'>
            <select value={defaultValue} className="text-amber-200 bg-amber-700 rounded-lg border border-amber-200 active:bg-amber-500" onChange={(e) => onSelect(e)}>
                <option value={0}>Jours</option>
                {options.map((jour, index) =>
                    <option key={index} value={jour}>Jour {jour}</option>
                )}
            </select>
        </div>
    );
}

function SelectHoraire({defaultValue, onSelect}: SelectFilters2Props) {  // Afficher la liste des horaires
    return (
        <div className='md:ml-10 font-bold'>
            <select value={defaultValue} className="text-amber-200 bg-amber-700 rounded-lg border border-amber-200 active:bg-amber-500" onChange={(e) => onSelect(e)}>
                <option value={"00:00"}>Horaires</option>
                <option value={"12:00"}>12h→14h</option>
                <option value={"14:00"}>14h→16h</option>
                <option value={"16:00"}>16h→18h</option>
                <option value={"18:00"}>18h→20h</option>
                <option value={"20:00"}>20h→22h</option>
                <option value={"22:00"}>22h→00h</option>
            </select>
        </div>
    );
}

function SelectStyle({defaultValue, onSelect, options}: SelectFilters3Props) {  // Afficher la liste des styles
    return (
        <div className='md:ml-10 font-bold'>
            <select value={defaultValue} className="text-amber-200 bg-amber-700 rounded-lg border border-amber-200 active:bg-amber-500" onChange={(e) => onSelect(e)}>
                {options.map((style, index) =>
                    <option key={index} value={style}>{style}</option>
                 )}
            </select>
        </div>
    );
}

function SelectScene({defaultValue, onSelect, options}: SelectFilters1Props) {  // Afficher la liste des scènes
    return (
        <div className='md:ml-10 font-bold'>
            <select value={defaultValue} className="text-amber-200 bg-amber-700 rounded-lg border border-amber-200 active:bg-amber-500" onChange={(e) => onSelect(e)}>
                <option value={0}>Scènes</option>
                    {options.map((scene, index) =>
                        <option key={index} value={scene}>Scène {scene}</option>
                )}
            </select>
        </div>
    );
}

// Afficher la programmation: liste des artistes du festival avec leur fiche détaillée, filtrée par jours, horaires, styles et scènes
function Programmation() {
    const [calendrier, setCalendrier] = useState<CalendrierProps[]>([]);
    const [artistesList, setArtistesList] = useState<ArtisteProps[]>([]);
    const [filteredArtistes, setFilteredArtistes] = useState<ArtisteProps[]>([]);
    const [jour, setJour] = useState(0);
    const [joursList, setJoursList] = useState(defaultJoursList);
    const [horaire, setHoraire] = useState(defaultHoraire);
    const [style, setStyle] = useState(defaultStylesList[0]);
    const [stylesList, setStylesList] = useState(defaultStylesList);
    const [scene, setScene] = useState(0);
    const [scenesList, setScenesList] = useState(defaultScenesList);
    const [programme, setProgramme] = useState<ProgrammeProps[]>([]);

    FetchData('calendriers/?format=json', setCalendrier); // Récupérer le calendrier du festival trié par jour
    FetchData('programmes/?format=json', setProgramme); // Récupérer le programme du festival trié par jour et horaire
    FetchData('artistes/?format=json', setArtistesList); // Récupérer la liste des artistes trié par nom

    useEffect(() => { // créer la liste des options du filtre de jours à partir du calendrier du festival
        const jours = calendrier.map((jour: CalendrierProps)  => jour.jour_festival);
        setJoursList(jours);
      }, [calendrier]);

    useEffect(() => { // créer la liste des options du filtre des scènes à partir du programme        
        //récupérer les scènes
        const scenes = programme.map((scene: ProgrammeProps)  => scene.scene);
        //supprimer les doublons et trier la liste
        const trierScenesUniques: any = [...new Set(scenes)].sort();
        setScenesList(trierScenesUniques);

    }, [programme]);
    
    useEffect(() => { // créer la liste des options du filtre de styles
        //récupérer les styles des artistes
        const styleOptions = artistesList.map((artiste : ArtisteProps)  => artiste.style);
        //supprimer les doublons et trier la liste
        const trierOptionsUniques: any = [...new Set(styleOptions)].sort();
        //rajouter l'option "Styles" au début
        trierOptionsUniques.unshift(defaultStylesList[0]);
        setStylesList(trierOptionsUniques);             
    
    }, [artistesList]);

    useEffect(() => {
        // Croiser deux listes distinctes pour identifier les artistes filtrés :
            // filtrer le programme par jour, horaire et scene et artiste non null
        const eventsFiltres = programme.filter((event) => (event.jour_festival === jour || jour === 0) && (event.horaire >= horaire) && (event.horaire < Tranche2H(horaire)) && (event.scene === scene || scene === 0) && (event.artiste));
            // puis récupérer la liste des artistes résultant de ce filtrage
        const artistesEvents = (eventsFiltres.map(event => event.artiste.nom));
            // enfin, filtrer la liste des artistes programmés selon le style et croiser avec la liste précédente
        setFilteredArtistes(artistesList.filter((artiste) => (artiste.style === style || style === defaultStylesList[0]) && (artistesEvents.includes(artiste.nom))));

    }, [jour,horaire,style,scene]);

    useEffect(() => {
        window.scrollTo(0, 0);
        // Afficher toute la liste des artistes par défaut
        setFilteredArtistes(artistesList);

    }, [artistesList]);

    const handleOnSelectJour = (event: ChangeEvent<HTMLSelectElement>) => { // gérer la sélection des jours
        const jour = Number(event.target.value);        
        setJour(jour);
    };

    const handleOnSelectHoraire = (event: ChangeEvent<HTMLSelectElement>) => { // gérer la sélection des horaires
        const horaire = event.target.value;        
        setHoraire(horaire);
    };

    const handleOnSelectStyle = (event: ChangeEvent<HTMLSelectElement>) => { // gérer la sélection des styles
        const style = event.target.value;        
        setStyle(style);
    };

    const handleOnSelectScene = (event: ChangeEvent<HTMLSelectElement>) => { // gérer la sélection des scenes
        const scene = Number(event.target.value);        
        setScene(scene);
    };

    const AfficherTousArtistes = () => { // reset des filtres aux valeurs par défaut pour afficher toute la programmation
        setJour(0);
        setHoraire(defaultHoraire);
        setStyle(defaultStylesList[0]);
        setScene(0);
    };

    return (
        // page programmation: afficher le bloc de filtres et la liste des artistes avec le lien vers la fiche détaillée
        <main className='min-h-screen bg-hero'>
            <div className='min-h-screen bg-amber-600/90 '>
                <div className='bg-amber-600/30 flex contain-fluid overflow-hidden grid text-yellow-100'>
                    <AfficherTitre titre="PROGRAMMATION" /> 
                    <div className='mt-3 py-3 px-4 bg-blue-800/80 border rounded-lg flex flex-col justify-center'>
                        {/* Définir les listes de filtres; jours, horaires, styles et scènes */}
                        <div className='flex justify-between md:justify-center'>
                            <div> 
                                {<SelectJour defaultValue={jour} onSelect={handleOnSelectJour} options={joursList} />} 
                            </div>
                            <div> 
                                {<SelectHoraire defaultValue={horaire} onSelect={handleOnSelectHoraire} />}
                            </div>
                            <div> 
                                {<SelectStyle defaultValue={style} onSelect={handleOnSelectStyle} options={stylesList}/>}
                            </div>
                            <div> 
                                {<SelectScene defaultValue={scene} onSelect={handleOnSelectScene} options={scenesList} />}
                            </div>
                        </div>
                        <button className='mt-3 font-bold w-full md:w-1/5 md:mx-auto' onClick={AfficherTousArtistes}>
                            <p className="text-amber-200 bg-amber-700 rounded-lg border border-amber-200 active:shadow-xl active:bg-amber-500">Tous les artistes</p>                            
                        </button>
                    </div>

                    <div className='min-h-screen my-3 shadow-lg shadow-orange-300 bg-blue-800/80 border rounded-lg'>
                        <p className='pt-2 flex justify-center font-bold italic text-2xl mb-4 pb-2 border-b'>Les artistes du festival</p>
                        <ul className='px-10 xl:px-96 flex flex-wrap justify-center'>
                            {filteredArtistes.map((artiste) => (
                                <li key={artiste.id} className='w-40 md:w-64 rounded text-white italic mb-10 md:mb-32 mx-5 bg-yellow-700/20 shadow-lg shadow-cyan-300'>
                                    {/* afficher la fiche de l'artiste et le lien vers le détail de la fiche */}
                                    <img src={artiste.visuel} alt={artiste.nom} className='rounded-t w-40 h-40 md:size-64'/>
                                    <p className='font-bold pl-2'>{artiste.nom}</p>
                                    <p className='pl-2'>{artiste.style}</p>                                                                
                                    {<FicheArtiste {...{artiste: artiste, eventsArtiste: programme.filter((event) => (event.artiste && (event.artiste.nom === artiste.nom)))}}/>}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Programmation;