import React, { useCallback, useEffect, useState } from "react";
import { View } from 'react-native';
import * as UserDatabase from "./data/UserDatabase"
import * as SplashScreen from 'expo-splash-screen';
import MainComponent from "./ui/MainComponent";
import { Provider } from "react-redux";
import { store } from "./ui/redux-store/store";

SplashScreen.preventAutoHideAsync();
export default function AppLoader() {
    const [AppReady, setAppReady] = useState(false);

    useEffect(()=> {
        async function LoadDatabases() {
            console.log("Loading database")
            await UserDatabase.DatabaseDataSource.initialize();
            console.log("Done Loading Database")
            console.log("Syncroizing data")
            await UserDatabase.SynchronizeData();
        }

        async function LoadFonts() {  

        }

        async function Load() {
            await LoadDatabases();
            await LoadFonts();
            setAppReady(true)
        }

        Load();
    }, [])

    const onLayout = useCallback(async () => {
        if (AppReady) {
            console.log("Hide async")
            await SplashScreen.hideAsync();
        }
    }, [AppReady])

    if (!AppReady) {
        return <View/>
    }
    console.log("App ready!");

    return (
        <Provider store={store}>
            <MainComponent onLayout={onLayout}/>
        </Provider>
    )
}