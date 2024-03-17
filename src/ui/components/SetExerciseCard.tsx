import React, { useState } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, TextInput } from "react-native";
import { useEntityManyRelationshipState } from '../hooks/TypeOrmHooks';
import * as UserDatabase from "../../data/UserDatabase"
import { ExerciseSet } from '../../data/entities/Workout/ExerciseSet';
import { ExerciseSetData } from '../../data/entities/Workout/ExerciseSetData';
import * as Constants from './SizeConstants';
import { Entypo } from '@expo/vector-icons';
import StyledTextInput from './base/BetterTextInput';
import { getTheme } from '../redux-store/theme';

function SetExerciseSetDataCard({setData, deleteSelf} : { setData : ExerciseSetData, deleteSelf : ()=>void}) {
    const [repsState, setReps] = useState<number | null>(setData.reps)
    const [weightState, setWeight] = useState<number | null>(setData.weight)

    const [theme, themeKey] = getTheme();

    const styles = StyleSheet.create({
        exerciseSetDataCard: {
            flex: 1,
            backgroundColor: theme.SecondCardBackgroundColor,
            flexDirection: "row",
        },
    
        setDataMiscColumn: {
            flex: 1,
        },
    
        setDataRepsColumn: {
            width: Constants.ExerciseSet_RepsInput_ColumnWidth,
            marginHorizontal: 3,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
        },
        
        setDataWeightColumn: {
            width: Constants.ExerciseSet_WeightInput_ColumnWidth,
            marginHorizontal: 3,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
        },
    
        unfocusedInputField: {
            width: "100%",
            margin: 2,
            backgroundColor: theme.InputBackgroundColor,
            borderColor: theme.BorderColor,
            color: theme.TextColor,
            borderWidth: 1,
            textAlign: "center",
            borderRadius: 3,
        },
    
        focusedInputField: {
            width: "100%",
            margin: 1,
            backgroundColor: theme.InputBackgroundColor,
            borderColor: theme.PrimaryColor,
            color: theme.TextColor,
            borderWidth: 2,
            textAlign: "center",
            borderRadius: 3,
        },
    });

    return (
        <View style={styles.exerciseSetDataCard}>
            <View style={styles.setDataMiscColumn}>

            </View>
            <View style={styles.setDataRepsColumn}>
                <StyledTextInput
                    focusedStyle={styles.focusedInputField}
                    bluredStyle={styles.unfocusedInputField}
                    cursorColor={theme.PrimaryColor}
                    selectionColor={theme.LighterPrimaryColor}
                    contextMenuHidden={true}
                    onChangeText={(text)=>{
                        const parsedNumber = text.length == 0 ? null : parseFloat(text);
                        setReps(parsedNumber)
                        setData.reps = parsedNumber
                        UserDatabase.DatabaseDataSource.getRepository(ExerciseSetData).save(setData);
                    }}
                    value={repsState == null ? "" : repsState.toString()}
                    keyboardType='number-pad' 
                />
            </View>
            <View style={styles.setDataWeightColumn}>
            <   StyledTextInput
                    focusedStyle={styles.focusedInputField}
                    bluredStyle={styles.unfocusedInputField}
                    cursorColor={theme.PrimaryColor}
                    selectionColor={theme.LighterPrimaryColor}
                    onChangeText={(text)=>{
                        const parsedNumber = text.length == 0 ? null : parseFloat(text);
                        setWeight(parsedNumber)
                        setData.weight = parsedNumber
                        UserDatabase.DatabaseDataSource.getRepository(ExerciseSetData).save(setData);
                    }}
                    value={weightState == null ? "" : weightState.toString()}
                    keyboardType='number-pad'
                />
            </View>
        </View>
    )
}

export default function SetExerciseCard({ set, index, deleteSelf } : { set : ExerciseSet, index : number, deleteSelf : ()=>void}) {
    const [sets, insertSetData, removeSetData, _] = useEntityManyRelationshipState(
        UserDatabase.DatabaseDataSource, ExerciseSet, ExerciseSetData, "setsData", set);

    const [theme, themeKey] = getTheme();
    const styles = StyleSheet.create({
        card: {
          flex: 1,
          backgroundColor: theme.SecondCardBackgroundColor,
          borderRadius: theme.BorderRadius,
          elevation: 2,
          paddingTop: 2,
          paddingBottom: 2,
          marginVertical: 2,
          flexDirection: "row",
        },
        
        setsTextColumn : {
            width: Constants.ExerciseSet_Label_ColumnWidth,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: Constants.ExerciseSet_Column_HoriontalMargins,
        },
    
        setsDataColumn : {
            flex: 1,
        },
    
        moreOptionsButtonColumn : {
            width: Constants.ExerciseSet_MoreActions_ColumnWidth,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: Constants.ExerciseSet_Column_HoriontalMargins,
        },
    });

    return (
        <View style={styles.card}>
            <View style={styles.setsTextColumn}>
                <Text style={{color: theme.TextColor, fontWeight:"500"}}> {index+1} </Text>
            </View>
            <View style={styles.setsDataColumn}>
                {
                    sets != null ? sets.map((setData, index) => {
                        return <SetExerciseSetDataCard setData={setData} deleteSelf={()=>{
                            removeSetData(setData)
                        }}/>
                    }) : []
                }
            </View>
            <View style={styles.moreOptionsButtonColumn}>
                <TouchableOpacity onPress={()=> {
                    insertSetData({
                        reps: null,
                        weight: null,
                        time: null,
                        rpe: null,
                    })
                }}>
                    <Entypo name="dots-three-vertical" size={13} color={theme.OnBackgroundIconColor} />
                </TouchableOpacity>
            </View>
        </View>
    )
}