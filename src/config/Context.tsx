
//Définir chemin vers Django
export const PathDjango = 'http://127.0.0.1:8000/';
export const PathAPI = PathDjango + 'apirest/';

// Définir la structure du calendrier django
export interface CalendrierProps {
  id: number,
  jour_festival: number,
  date_festival: string,
}

// Définir la structure de artiste django
export interface ArtisteProps {
  id: number,
  nom: string,
  style: string,
  description: string,
  visuel: string,
}

// Définir la structure du programme django
export interface ProgrammeProps {
  id: number,
  jour_festival: number,
  date_festival: string,
  event: string,
  artiste: {
      id: number,
      nom: string,
      style: string,
      description: string,
      visuel: string,
  },
  scene: number,
  horaire: string,
}


// Définir la structure des POI de la carte
export interface PoiProps {
  id: number,
  nomPoi : string,
  categoriePoi : string,
  urlPoi : string,
  descriptionPoi: string,
  latitudePoi : number,
  longitudePoi: number,
}

// Définir la structure des filtres de la carte
export interface FiltersMarkersProps {
  id : string,
  label : string,
  check : boolean,
}