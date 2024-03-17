import React, { useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as UserDatabase from "../../data/UserDatabase"

import type { HomeTabs, HomeStackScreenProps, HomeScreenProps } from '../types';
import { Workout } from '../../data/entities/Workout/Workout';
import { changeTheme, getTheme } from '../redux-store/theme';
import { useAppDispatch } from '../redux-store/hooks';
import PrimaryButton from '../components/PrimaryButton';

function HomeTabBar({ state, descriptors, navigation }) {
    const [theme, themeKey] = getTheme();

    const styles = StyleSheet.create({
        tabBarContainer: {
          backgroundColor: theme.SecondCardBackgroundColor,
          padding: 4,
          width: "100%",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
        },

        rowsContainer: {
            backgroundColor: "#fff",
            flexDirection: 'row',
        }
    });


    return (
      <View style={styles.tabBarContainer}>
        <View style={styles.rowsContainer}>
            {
                state.routes.map((route, index) => {

                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;
            
                    const isFocused = state.index === index;
            
                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
            
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };
            
                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };
            
                    return (
                        <TouchableOpacity
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={{ flex: 1 }}>

                            <Text style={{ color: isFocused ? theme.PrimaryColor : theme.DarkerPrimaryColor }}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })
            }
        </View>
      </View>
    );
  }

export default function HomeStackScreen({ route, navigation } : HomeStackScreenProps) {
    console.log("homescreenstack");
    return (
        <Tab.Navigator initialRouteName='Home' tabBar={props => <HomeTabBar {...props}/>}>
            <Tab.Screen name='Home' component={HomeScreen} options={{headerShown: false}}/>
        </Tab.Navigator>
    )
}

function HomeScreen({ route, navigation } : HomeScreenProps) {
    const [theme, themeKey] = getTheme();
    const dispatch = useAppDispatch();

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.BackgroundColor,
          padding: 4,
        },
        
        buttonContainer: {
            padding: 1,
            margin: 2,
        },

        buttonCard: {
            backgroundColor: theme.FirstCardBackgroundColor,
            borderRadius: theme.BorderRadius,
            elevation: 2,
            padding: 4,
            margin: 3,
        },

        text: {
            color: theme.TextColor,
        },
    });

    const createOrFindExerciseAndOpen = useCallback(async () => {
        const workoutRepo = UserDatabase.DatabaseDataSource.getRepository(Workout);
        let workout = await workoutRepo.findOneBy({
            id: 1
        });

        if (workout === null) {
            // Create new empty workout with id 1
            await workoutRepo.insert({
                id: 1,
                time: 0,
                startDateTime: 0, // Set current date
                exercises: [], // Empty exercises
            })

            workout = await workoutRepo.findOneBy({
                id: 1
            });
            
            if(workout === null) {
                console.error("Failed to insert new workout")
                return;
            }
        }

        console.log("Pressing!")
        navigation.push('Workout', {
            workout: workout
        });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.buttonCard}>

                    <Text style={styles.text}>Home Screen</Text>

                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                                title='Current Workout'
                                onPress={() => {
                                    console.log("Pressing!")
                                    createOrFindExerciseAndOpen();
                                }}
                            />
                    </View>

                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                                title='Open Settings'
                                onPress={() => {
                                    console.log("Pressing!")
                                    navigation.push('Settings');
                                }}
                            />
                    </View>

                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                                title='Switch Theme'
                                onPress={()=>{
                                    const newTheme = (themeKey == "light" ? "dark" : "light");
                                    console.log("Theme change " + newTheme)
                                    dispatch(changeTheme(newTheme))
                                }}
                            />
                    </View>

                </View>
            </View>
        </SafeAreaView>
    )
}

const Tab = createBottomTabNavigator<HomeTabs>();