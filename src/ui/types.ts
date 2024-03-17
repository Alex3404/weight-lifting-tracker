import type { NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Workout } from '../data/entities/Workout/Workout';
import { ExerciseData } from '../data/entities/Exercises/ExerciseData';

export interface MainAppProps {
    onLayoutRootView : () => Promise<void>
}

export type WorkoutScreenData = {
    workout : Workout,
}

export type ExerciseSelectedListener = (excercise : ExerciseData)=>void
export type ExerciseScreenData = {
    onSelectedListener : ExerciseSelectedListener,
}

export type RootScreenStack = {
    HomeStack : undefined,
    Workout : WorkoutScreenData,
    Settings : undefined,
    ExerciseSelection : ExerciseScreenData,
}

export type HomeStackScreenProps = NativeStackScreenProps<RootScreenStack, 'HomeStack'>;
export type WorkoutScreenProps = NativeStackScreenProps<RootScreenStack, 'Workout'>;
export type ExerciseSelectionProps = NativeStackScreenProps<RootScreenStack, 'ExerciseSelection'>;
export type SettingsScreenProps = NativeStackScreenProps<RootScreenStack, 'Settings'>;


export type HomeTabs = {
    Home : NavigatorScreenParams<RootScreenStack>;
}
export type HomeScreenProps = CompositeScreenProps<
    NativeStackScreenProps<HomeTabs, 'Home'>,
    NativeStackScreenProps<RootScreenStack>
>;