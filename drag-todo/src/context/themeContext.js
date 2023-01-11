import React, { useContext, useState } from 'react';
import { themes } from '../styles/themes';

const ThemeContext = React.createContext();
const ThemeUpdateContext = React.createContext();


export const ThemeProvider = ({ children }) => {
    
}

export const useThemeContext = () => {
    return useContext(ThemeContext);
}
export const useThemeUpdateContext = () => {
    return useContext(ThemeUpdateContext);
}