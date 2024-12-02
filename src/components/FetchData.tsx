import { useEffect } from "react";
import { PathAPI } from "../config/Context";

// Composant pour récupérer les données de l'API REST
const FetchData = (postsUrl: string, setData: any) => {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(PathAPI + postsUrl);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        setData(data);
      } catch (error: any) {
          <p>{error}</p>;
      } finally {
          <p>Chargement en cours...</p>;
      }   
    };

    fetchData();

  }, [postsUrl]);

  return setData;
};

export default FetchData;
