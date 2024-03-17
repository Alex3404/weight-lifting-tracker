import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { useAppSelector } from './hooks'

export interface Theme {
    BorderRadius: number,

    PrimaryColor: string
    DarkerPrimaryColor: string
    LighterPrimaryColor: string

    BorderColor: string
    BackgroundColor: string

    TextColor: string
    PlaceholderTextColor : string

    FirstCardBackgroundColor: string
    SecondCardBackgroundColor: string
    InputBackgroundColor: string
    
    OnBackgroundIconColor: string
}

interface ThemeState {
    themes : {[key : string] : Theme}
    currentTheme : string
}

const initialState : ThemeState = {
    themes : {
        light: {
            BorderRadius: 5,

            PrimaryColor: "#69f",
            DarkerPrimaryColor: "#47d",
            LighterPrimaryColor: "#8bf",
            
            BorderColor: "#aaa",
            TextColor: "#000",
            BackgroundColor: "#eee",
            PlaceholderTextColor: "#999",

            FirstCardBackgroundColor: "#fcfcfc",
            SecondCardBackgroundColor: "#fff",
            InputBackgroundColor: "#fff",

            OnBackgroundIconColor: "#555",
        },

        dark: {
            BorderRadius: 5,

            PrimaryColor: "#69f",
            DarkerPrimaryColor: "#47d",
            LighterPrimaryColor: "#8bf",
            
            BorderColor: "#aaa",
            TextColor: "#fff",
            BackgroundColor: "#111",
            PlaceholderTextColor: "#bbb",

            FirstCardBackgroundColor: "#202020",
            SecondCardBackgroundColor: "#282828",
            InputBackgroundColor: "#1a1a1a",

            OnBackgroundIconColor: "#fff",
        }
    },
    currentTheme: 'light'
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        changeTheme: (state, action : PayloadAction<string>) => {
            state.currentTheme = action.payload
        }
    }
})

export const CurrentThemeSelector = (state) => state.ThemeReducer.currentTheme
export const ThemesSelector = (state) => state.ThemeReducer.themes

export const { changeTheme } = themeSlice.actions;
export function getTheme() : [Theme, string] {
    const currentTheme = useAppSelector(CurrentThemeSelector)
    const themes = useAppSelector(ThemesSelector)
    console.log(currentTheme)
    console.log(themes)
    return [themes[currentTheme], currentTheme];
}

export default themeSlice.reducer