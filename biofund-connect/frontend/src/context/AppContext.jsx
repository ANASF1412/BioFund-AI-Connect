import React, { createContext, useState, useEffect, useContext } from 'react';
import i18n from '../i18n';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [largeText, setLargeText] = useState(false);
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        }

        const savedTextSize = localStorage.getItem('largeText') === 'true';
        setLargeText(savedTextSize);
        if (savedTextSize) {
            document.documentElement.classList.add('large-text');
        }

        const savedLang = localStorage.getItem('language') || 'en';
        setLanguage(savedLang);
        i18n.changeLanguage(savedLang);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const toggleLargeText = () => {
        const newLargeText = !largeText;
        setLargeText(newLargeText);
        localStorage.setItem('largeText', newLargeText);
        if (newLargeText) {
            document.documentElement.classList.add('large-text');
        } else {
            document.documentElement.classList.remove('large-text');
        }
    };

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'es' : 'en';
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
        i18n.changeLanguage(newLang);
    };

    return (
        <AppContext.Provider value={{ theme, toggleTheme, largeText, toggleLargeText, language, toggleLanguage }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
