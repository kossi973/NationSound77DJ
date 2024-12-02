// Fonction pour formater le mois d'une date en littéral
const FormaterDate = (dateString: string) => {
    const annee = dateString.slice(0,4);
    const moisAconvertir = dateString.slice(5,7);
    const jour = dateString.slice(8,10);
    let mois;
    switch (moisAconvertir) {
      case "01" : mois = "janvier"; break;
      case "02" : mois = "février"; break;
      case "03" : mois = "mars"; break;
      case "04" : mois = "avril"; break;
      case "05" : mois = "mai"; break;
      case "06" : mois = "juin"; break;
      case "07" : mois = "juillet"; break;
      case "08" : mois = "août"; break;
      case "09" : mois = "septembre"; break;
      case "10" : mois = "octobre"; break;
      case "11" : mois = "novembre"; break;
      case "12" : mois = "décembre"; break;
    };
    const date = jour + " " + mois + " " + annee;
    return date;        
};

export default FormaterDate;