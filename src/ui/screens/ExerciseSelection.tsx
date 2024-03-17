import React, { useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, TextInput } from "react-native";
import type { ExerciseSelectionProps } from '../types';
import { useEntitiesState } from '../hooks/TypeOrmHooks';
import * as UserDatabase from "../../data/UserDatabase"
import { ExerciseData } from '../../data/entities/Exercises/ExerciseData';
import ExerciseCard from '../components/ExerciseCard';
import { Entypo } from '@expo/vector-icons';
import { getTheme } from '../redux-store/theme';

export default function ExerciseSelection({ route, navigation } : ExerciseSelectionProps) {
    const [exercises, _, __] = useEntitiesState(UserDatabase.DatabaseDataSource, ExerciseData);
    const [theme, themeKey] = getTheme();
    const [searchText, setSearchText] = useState("");
    const FilteredExercises = useMemo(()=>{
        return exercises.filter(item=> {
            return item.name.toLowerCase().includes(searchText.toLowerCase());
        })
    }, [searchText, exercises])

    const listener = route.params && route.params.onSelectedListener;

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.BackgroundColor,
            flex: 1,
        },

        searchInputView: {
          height: 40,
          width: "auto",
          backgroundColor: theme.InputBackgroundColor,
          flexDirection: "row",
          padding: 8,
          margin: 4,
          elevation: 3,
          borderRadius: 3,
          borderWidth: 1,
          borderColor: theme.BorderColor,
        },
    
        searchIconView: {
            aspectRatio: 1,
            justifyContent: "center",
        },
    
        searchInputTextInput: {
            flex: 1,
            color: theme.TextColor
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.searchInputView}>
                <View style={styles.searchIconView}>
                    <Entypo name="magnifying-glass" size={13} color="#555" />
                </View>
                <TextInput
                    style={styles.searchInputTextInput}
                    placeholderTextColor={theme.PlaceholderTextColor}
                    placeholder='Search'
                    value={searchText}
                    onChangeText={text=>{
                        setSearchText(text)
                    }}
                />
            </View>
            
            <FlatList
                style={styles.container}
                data={FilteredExercises}
                renderItem={({ item }) => {
                    return (
                        <ExerciseCard exerciseData={item} onPress={()=>{
                            navigation.pop();
                            if(listener !== null) {
                                listener(item)
                            }
                        }}/>
                    )
                }}
                keyExtractor={(item)=>item.id.toString()}
            />
        </View>
    )
}