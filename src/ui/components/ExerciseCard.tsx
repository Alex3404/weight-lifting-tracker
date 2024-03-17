import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { ExerciseData } from '../../data/entities/Exercises/ExerciseData';
import { getTheme } from '../redux-store/theme';

export default function ExerciseCard({ exerciseData, onPress } : { exerciseData : ExerciseData, onPress : ()=>void }) {
    const [theme, themeKey] = getTheme();
    
    const styles = StyleSheet.create({
        card: {
            flex: 1,
            backgroundColor: theme.FirstCardBackgroundColor,
            padding: 8,
            margin: 4,
            elevation: 3,
            flexDirection: "column",
        },
    });

    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            <Text style={{color: theme.TextColor}}> { exerciseData.name } </Text>
        </TouchableOpacity>
    )
}