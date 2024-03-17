import { DataSource } from "typeorm"
import { ExerciseSet } from "./entities/Workout/ExerciseSet"
import { ExerciseSetData } from "./entities/Workout/ExerciseSetData"
import { WorkoutExercise } from "./entities/Workout/WorkoutExercise"
import { Workout } from "./entities/Workout/Workout"
import { Category, Equipment, ExerciseData, Force, Level, Mechanic, MuscleGroup } from "./entities/Exercises/ExerciseData"

export const DatabaseDataSource = new DataSource({
    driver: require('expo-sqlite'),
    type: "expo",
    database: "testuserdata",
    synchronize: true,
    logging: true,
    entities: [
        Workout,
        WorkoutExercise,
        ExerciseSet,
        ExerciseSetData,
        
        ExerciseData,
    ],
    subscribers: [
        
    ],
})


type YuhonasDBData = {
    id : string,
    name : string,
    force : string,
    level : string,
    mechanic : string,
    equipment : string,
    primaryMuscles : string[],
    secondaryMuscles : string[],
    instructions : string[],
    category : string,
    images : string,
}

export async function SynchronizeData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json');
        
        const exerciseDB : YuhonasDBData[] = await response.json();
        const ExerciseDataRepo = DatabaseDataSource.getRepository(ExerciseData);

        for(var i = 0; i < exerciseDB.length; i++) {
            const exerciseYuhonasData = exerciseDB[i];

            let exists = await ExerciseDataRepo.exists({
                where: {
                    id: exerciseYuhonasData.id
                }
            })
            
            if(!exists) {
                await ExerciseDataRepo.insert({
                    id: exerciseYuhonasData.id,
                    name: exerciseYuhonasData.name,
                    force: Force[exerciseYuhonasData.force],
                    level: Level[exerciseYuhonasData.level],
                    mechanic: Mechanic[exerciseYuhonasData.mechanic],
                    equipment: Equipment[exerciseYuhonasData.equipment],
                    primaryMuscles: exerciseYuhonasData.primaryMuscles.map(val => MuscleGroup[val]),
                    secondaryMuscles: exerciseYuhonasData.secondaryMuscles.map(val => MuscleGroup[val]),
                    instructions: exerciseYuhonasData.instructions.join(" "),
                    category: Category[exerciseYuhonasData.category],
                });

                console.log("Inserted new data")
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}