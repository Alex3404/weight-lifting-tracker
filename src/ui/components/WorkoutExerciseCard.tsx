import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useEntityManyRelationshipState } from '../hooks/TypeOrmHooks';
import * as UserDatabase from "../../data/UserDatabase"
import { WorkoutExercise } from '../../data/entities/Workout/WorkoutExercise';
import { ExerciseSet } from '../../data/entities/Workout/ExerciseSet';
import SetExerciseCard from './SetExerciseCard';
import * as Constants from './SizeConstants';
import { Entypo } from '@expo/vector-icons';
import PrimaryButton from './PrimaryButton';
import { getTheme } from '../redux-store/theme';

function WorkoutSetsHeader() {
    const [theme, themeKey] = getTheme();

    const headerStyles = StyleSheet.create({
        header: {
            flexDirection: "row"
        },

        setTextColumnHeader: {
            width: Constants.ExerciseSet_Label_ColumnWidth,
            marginHorizontal: Constants.ExerciseSet_Column_HoriontalMargins,
            textAlign: "center",
            color: theme.TextColor,
        },
        
        miscDataColumnHeader: {
            flex: 1,
            marginHorizontal: Constants.ExerciseSet_Column_HoriontalMargins,
        },

        weightInputColumnHeader: {
            width: Constants.ExerciseSet_WeightInput_ColumnWidth,
            marginHorizontal: Constants.ExerciseSet_Column_HoriontalMargins,
            textAlign: "center",
            color: theme.TextColor,
        },

        repsInputColumnHeader: {
            width: Constants.ExerciseSet_RepsInput_ColumnWidth,
            marginHorizontal: Constants.ExerciseSet_Column_HoriontalMargins,
            textAlign: "center",
            color: theme.TextColor,
        },

        moreActionColumnHeader: {
            width: Constants.ExerciseSet_MoreActions_ColumnWidth,
            marginHorizontal: Constants.ExerciseSet_Column_HoriontalMargins,
            textAlign: "center",
            color: theme.TextColor,
        },
    });

    return (
        <View style={headerStyles.header}>
            <Text style={headerStyles.setTextColumnHeader}>
                Set
            </Text>
            <View style={headerStyles.miscDataColumnHeader}>

            </View>
            <Text style={headerStyles.weightInputColumnHeader}>
                Lbs
            </Text>
            <Text style={headerStyles.repsInputColumnHeader}>
                Reps
            </Text>
            <View style={headerStyles.moreActionColumnHeader}>

            </View>
        </View>
    )
}

export default function WorkoutExerciseCard({ exercise, index, deleteSelf } : { exercise : WorkoutExercise, index, deleteSelf : ()=>void}) {
    const [theme, themeKey] = getTheme();
    const [sets, insertSet, removeSet, _] = useEntityManyRelationshipState(
        UserDatabase.DatabaseDataSource, WorkoutExercise, ExerciseSet, "exerciseSets", exercise);

    const styles = StyleSheet.create({
        card: {
          flex: 1,
          backgroundColor: theme.FirstCardBackgroundColor,
          borderRadius: theme.BorderRadius,
          padding: 8,
          margin: 4,
          elevation: 3,
          flexDirection: "column",
        },
    
        titleView: {
            flex: 1,
            marginBottom: 5,
            flexDirection: "row",
        },

        extraButtons: {
            flex: 1,
            flexDirection: "row-reverse",
            alignItems: "center"
        },
    
        addSetContainer: {
            paddingTop: 5,
            margin: 3,
        },
    });

    return (
        <View style={styles.card}>
            <View style={styles.titleView}>
                <Text style={{color: theme.PrimaryColor, fontWeight: "bold", fontSize: 16, paddingRight: 3}}>
                    {index + 1}
                </Text>
                <Text style={{verticalAlign: "middle", color: theme.TextColor}}> {exercise.exerciseData.name} </Text>

                <View style={styles.extraButtons}>
                    <TouchableOpacity onPress={deleteSelf}>
                        <Entypo name="dots-three-vertical" size={13} color="#555" />
                    </TouchableOpacity>
                </View>
            </View>

            <WorkoutSetsHeader/>

            {
                sets !== null ? sets.map((item, index) => {
                    return (
                        <SetExerciseCard key={item.id} set={item} index ={index} deleteSelf={()=>{
                            removeSet(item)
                        }}/>
                    )
                }) : []
            }
            <View style={styles.addSetContainer}>
                <PrimaryButton
                    title='+ Add Set +'
                    onPress={()=>{
                        insertSet({
                            setsData: [{
                                reps: null,
                                weight: null,
                                time: null,
                                rpe: null,
                            }]
                        })
                    }}
                />
            </View>
        </View>
    )
}