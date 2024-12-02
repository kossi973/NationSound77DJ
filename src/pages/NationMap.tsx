import { useRef, useState, useEffect } from "react";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import L from "leaflet";
import 'leaflet-routing-machine';
import "leaflet/dist/leaflet.css";
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import {PoiProps, FiltersMarkersProps, ProgrammeProps} from '../config/Context';
import FetchData from '../components/FetchData';

// Typescript nécessite le typage du contrôle Routing
declare module 'leaflet' {
  namespace Routing {
    function control(options: any): any;
  }
}

// Coordonnées du festival par défaut
const centerLat = 48.84700319524508;
const centerLong = 2.6713022118184906;
const locationRedIcon = 'https://cdn-icons-png.flaticon.com/512/684/684908.png';

// Définir un icône personnalisé: url de l'image, taille de l'icône et points d'ancrage icône et popup
function customIcon(urlMarker: string) { 
  return new L.Icon({
    iconUrl: urlMarker,
    iconSize: [40, 40],
    iconAnchor: [25, 25],
    popupAnchor: [1, -34],
});
};

// Définir les catégories de filtres
const filtresMarkers = [
  { id: "id1", label: "Le festival", check: true },
  { id: "id2", label: "infos", check: true },
  { id: "id3", label: "scenes", check: true },
  { id: "id4", label: "secours", check: true },
  { id: "id5", label: "snacks", check: true },
  { id: "id6", label: "shops", check: true },
  { id: "id7", label: "toilettes", check: true },
  { id: "id8", label: "parkings", check: true }
];

// Afficher la carte interactive: les filtres des points d'intérêts (POI), la carte et les POI, l'affichage de l'itinéraire
const NationMap = () => {
  const mapRef = useRef<L.Map>(null);
  const [markers, setMarkers] = useState<PoiProps[]>([]);
  const [filteredMarkers, setfilteredMarkers] = useState<PoiProps[]>([]);
  const [programme, setProgramme] = useState<ProgrammeProps[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isOpen, setIsOpen] = useState(false); // gestion du bouton "Itinéraire"
  const [control, setControl] = useState(null); // gestion du controle de l'affichage de la carte

  FetchData('programmes/?format=json', setProgramme); // Récupérer le programme du festival trié par jour et horaire
  FetchData('pois/?format=json', setMarkers ); // Importer la liste des points d'intérêts (POI)
 
  // Positionner la carte aux coordonnées avec le zoom indiqué
  const recadrerCarte = (latitude: number, longitude: number, zoom: number) => {
    if (mapRef.current) {
      mapRef.current.setView([latitude, longitude], zoom);
    }
  };

  // Récupérer les coordonnées de l'utilisateur
  function SituerVisiteur() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        }
      );
    }
  };

  // Calculer et afficher l'itinéraire de la position du visiteur vers le festival
  function AfficherItineraire(afficher: boolean) {
    const map = mapRef.current;
    
    SituerVisiteur();
    
    if (map && userLocation && afficher) {
       const newControl = L.Routing.control({
        waypoints: [
          L.latLng(userLocation[0], userLocation[1]), // Position du visiteur
          L.latLng(centerLat, centerLong) // Position du festival
        ],
        routeWhileDragging: true,
        language: 'fr',
        showAlternatives: true,
        numberOfAlternatives: 3,
        altLineOptions: 
          { styles: [ 
            { color: 'black', opacity: 0.15, weight: 9 },
            { color: 'white', opacity: 0.8, weight: 6 },
            { color: 'blue', opacity: 0.5, weight: 2 } 
           ]
          },
        createMarker: () => { return null; } // Supprimer les markers de départ et d'arrivée

      }).addTo(map);
      setControl(newControl);
      recadrerCarte(userLocation[0], userLocation[1],13); //adapter le zoom

      return () => {
        if (map && control) {          
          map.removeControl(control);
          setControl(null);
        }
      };
    } else if (map && control && !afficher) { // Effacer l'itinéraire manuellement              
        map.removeControl(control);
        setControl(null);
    };
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Reset des filtres au chargement de la page
    filtresMarkers.forEach(filter => filter.check = true);
  }, []);

  useEffect(() => {
    // Afficher les POI et la position de l'utilisateur au chargement de la liste 
    setfilteredMarkers(markers.filter((marker) => (filtresMarkers).some((filtre) => (filtre.label === marker.categoriePoi) && filtre.check ))); 
    SituerVisiteur();
  }, [markers]);

  // Afficher les POI filtrés, recentre la carte sur le festival et repositionne le visiteur; le bouton "festival" affiche tous les POI.
  const handleOnClick = (filtre: FiltersMarkersProps) => {
    if (filtre.label === "Le festival") {
      filtresMarkers.forEach(filter => filter.check = true);
    } else {
      filtresMarkers.forEach(filter => filter.check = filter.label === filtre.label);
    }
    SituerVisiteur();
    recadrerCarte(centerLat, centerLong, 15); 
    setfilteredMarkers(markers.filter((marker) => (filtresMarkers).some((filtre) => (filtre.label === marker.categoriePoi) && filtre.check )));
  };

  // Construire les informations des popup des POI; pour les POI de type scène, afficher les concerts
  const AfficherInfosPOI = (categoriePOI: string, nomPOI: string, descriptionPOI: string) => {
    let infosScene;
    if (categoriePOI !== "scenes") {
      if (descriptionPOI == null) {descriptionPOI=""};
        infosScene = nomPOI + "<br /><br />" + descriptionPOI;
    } else { 
        const noScene = Number(nomPOI.slice(6,7));
        
        // Sélectionner les événements de la scène
        const sceneEvents = programme.filter( event => event.scene === noScene);
        
        // Mettre en forme le programme de la scène
        const programmeScene = sceneEvents.map(event => "&nbsp ► Jour " + event.jour_festival + " - " + event.horaire.slice(0,5) + " - " + event.event + " " + (event.artiste?.nom || ""));    
        
        infosScene = nomPOI + " ----------------------------------------------<br />" + programmeScene.join(`<br />`);
    };
    return infosScene;
  }

  return (
    // page carte interactive: afficher le bloc de filtres, le bouton "Moi", le bouton "Itinéraire" et la carte avec l'icône du visiteur et les POI et les popup associés
    <>
      <div className="bg-hero2 bg-cover bg-bottom flex justify-start md:justify-end p-2">
        <div className="flex-wrap ">
            {filtresMarkers.map((filtre) => (
            <button key={filtre.id} onClick={() => handleOnClick(filtre)}>
              <p className="border border-1 bg-sky-800 text-sm md:text-lg font-bold md:font-normal text-white italic border rounded-lg p-1 m-1 md:p-2 active:bg-amber-500">{filtre.label}</p>
            </button>
          ))}
        </div>
        <div>
          <button className="italic px-1 m-1 md:p-2 text-sky-900 font-bold bg-amber-200 rounded-lg ml-2 border-2 border-cyan-800 active:bg-amber-500" onClick={() => {if(userLocation) {recadrerCarte(userLocation[0], userLocation[1],14);}}}>
            <p>Vous</p>
          </button>
          <button className="italic px-1 m-1 md:p-2 text-sky-900 font-bold bg-amber-200 rounded-lg ml-2 border-2 border-cyan-800 active:bg-amber-500" onClick={() => {setIsOpen(!isOpen); AfficherItineraire(!isOpen);}}>
            <p>Itinéraire</p>
          </button>
        </div>
      </div>
      <hr className="h-2 bg-amber-400" />
      <div>
        <MapContainer // Afficher la carte interactive Leaflet
          center={[centerLat, centerLong]}
          zoom={15}
          ref={mapRef}
          style={{ zIndex: 5, height: "70vh", width: "100%" }}
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && ( // Afficher la position du visiteur
            <Marker position={userLocation} icon={customIcon(locationRedIcon)}>
              <Popup>Vous êtes ici</Popup>
            </Marker>
          )}          
          {filteredMarkers.map((marker) => ( // Afficher les POI
            <Marker key={marker.id} position={[marker.latitudePoi, marker.longitudePoi]} icon={customIcon(marker.urlPoi)}>
                <Popup>
                  <div className="text-blue-900 font-bold" dangerouslySetInnerHTML={{ __html: AfficherInfosPOI(marker.categoriePoi, marker.nomPoi, marker.descriptionPoi) }} />                  
                </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
};

export default NationMap;