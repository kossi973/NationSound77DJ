import { PathDjango } from '../config/Context';

const logoFB = '/images/logo-facebook.png'
const logoInsta = '/images/logo-instagram.jpeg'
const logoTwitter = '/images/logo-twitter.png'
const logoYT = '/images/logo-youtube.png'

// Afficher le footer : afficher les liens vers les pages Contacts, Partenaires, Mentions légales et réseaux sociaux
function Footer() {
    return (
        <footer className="md:h-32 w-full container-fluid overflow-hidden bg-amber-400">
            <div className="md:flex container justify-between py-3 mx-auto">
                <div className='flex justify-between text-red-500 mb-4'>
                    <button className='font-bold text-md border border-red-500 rounded-xl px-4 mx-2 shadow shadow-sky-500 active:shadow-xl active:bg-amber-500'>
                        <a href={PathDjango + "contacts/"}>Contacts</a>
                    </button>
                    <button className='font-bold text-md border border-red-500 rounded-xl px-4 mx-2 shadow shadow-sky-500 active:shadow-xl active:bg-amber-500'>
                        <a href={PathDjango + "partenaires/"}>Partenaires</a>
                    </button>
                    <button className='font-bold text-md border border-red-500 rounded-xl px-4 mx-2 shadow shadow-sky-500 active:shadow-xl active:bg-amber-500'>
                        <a href={PathDjango + "mentionslegales/"}>Mentions Légales</a>
                    </button>
                </div>             

                <div className='flex justify-between items-center mx-20'>
                    <img className="h-10 rounded" src={logoFB} alt="logo-Facebook" />
                    <img className="h-10 mx-4 rounded-lg" src={logoInsta} alt="logo-Instagram" />
                    <img className="h-10 rounded-lg" src={logoTwitter} alt="logo-Twitter" />
                    <img className="h-10 rounded" src={logoYT} alt="logo-YT" />
                </div>
            </div>
        </footer>
    );
}

export default Footer;