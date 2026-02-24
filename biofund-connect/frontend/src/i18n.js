import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "Welcome": "Fund the Future of our Planet",
            "Tagline": "Connect directly with verified environmental and social projects globally.",
            "GetStarted": "Get Started",
            "LogIn": "Log In",
            "Explore": "Explore Projects",
            "ImpactTracker": "Impact Tracker",
            "Community": "Community Feed"
        }
    },
    es: {
        translation: {
            "Welcome": "Financia el futuro de nuestro planeta",
            "Tagline": "Conéctate directamente con proyectos ambientales globales verificados.",
            "GetStarted": "Empezar",
            "LogIn": "Iniciar sesión",
            "Explore": "Explorar proyectos",
            "ImpactTracker": "Rastreador de impacto",
            "Community": "Comunidad"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;
