// Fonction pour ajouter 2h à l'horaire; renvoie un string
const Tranche2H = (horaire: string) => {
    let max = "23:59";
    if (horaire != "00:00") {
        const heurePlus2 = (Number(horaire.slice(0,2)) + 2);
        max = heurePlus2.toString() + ":" + "00";
    }        
    return max;
};

export default Tranche2H;