import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, Button, ScrollView, TouchableNativeFeedback } from "react-native";
import type { WorkoutScreenProps } from '../types';
import { useEntityManyRelationshipState } from '../hooks/TypeOrmHooks';
import * as UserDatabase from "../../data/UserDatabase"
import { Workout } from '../../data/entities/Workout/Workout';
import { WorkoutExercise } from '../../data/entities/Workout/WorkoutExercise';
import WorkoutExerciseCard from '../components/WorkoutExerciseCard';
import PrimaryButton from '../components/PrimaryButton';
import { getTheme } from '../redux-store/theme';

export default function WorkoutScreen({ route, navigation } : WorkoutScreenProps) {
    const workout = route.params.workout;
    const [theme, themeKey] = getTheme();
    const [exercises, insertExercise, removeExercise, _] = useEntityManyRelationshipState(
        UserDatabase.DatabaseDataSource, Workout, WorkoutExercise, "exercises", workout);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.BackgroundColor,
        }
    }); 

    return (
        <View style={styles.container}>
            <ScrollView>
                {
                    exercises !== null ? exercises.map((exercise, index) => (
                        <WorkoutExerciseCard index={index} key={exercise.id} deleteSelf={()=>{
                            console.log("Remove")
                            removeExercise(exercise)
                        }} exercise={exercise}/>
                    )) : []
                }
                
                <PrimaryButton
                    title='Add Exercise'
                    onPress={()=>{
                        navigation.push('ExerciseSelection', {onSelectedListener: exerciseData=>{
                            insertExercise({
                                exerciseData: exerciseData,
                                exerciseSets: []
                            })
                        }})
                    }}
                />
            </ScrollView>
        </View>
    )
}