import React from "react";
import { StyleSheet, View } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import type { RootScreenStack } from "./types";
import HomeStackScreen from "./screens/HomeStack";
import WorkoutScreen from "./screens/Workout";
import SettingsScreen from "./screens/Settings";
import ExerciseSelection from "./screens/ExerciseSelection";
import { getTheme } from "./redux-store/theme";
import { useAppSelector } from "./redux-store/hooks";

export default function MainComponent({ onLayout } : { onLayout : ()=>void}) {
  const [theme, themeKey] = getTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.BackgroundColor,
    },
  });  

    return (
      <SafeAreaProvider>
        <View style={styles.container} onLayout={onLayout}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName='HomeStack'>
              <Stack.Screen name='HomeStack' options={{headerShown: false}} component={HomeStackScreen}/>
              <Stack.Screen name='Workout' component={WorkoutScreen}/>
              <Stack.Screen name='Settings' component={SettingsScreen}/>
              <Stack.Screen name='ExerciseSelection' component={ExerciseSelection}/>
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </SafeAreaProvider>
    );
}

const Stack = createNativeStackNavigator<RootScreenStack>()