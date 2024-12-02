import React from 'react';

interface AfficherTitreProps {
    titre: string;
}

// Composant pour afficher le titre d'une page
const AfficherTitre: React.FC<AfficherTitreProps> = ({titre}) => {
    return (
        <div className='bg-hero2 bg-cover bg-bottom h-20 md:h-40 shadow-lg shadow-orange-300'>
            <h1 className='mt-4 md:mt-12 h-12 md:h-auto pt-1 md:py-4 text-3xl md:text-4xl font-bold text-yellow-200 text-center bg-orange-600/80'>{titre}</h1>
        </div>  
    );
};

export default AfficherTitre;


