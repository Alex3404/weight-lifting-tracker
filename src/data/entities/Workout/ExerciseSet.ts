import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinTable, Relation, ManyToMany, JoinColumn } from 'typeorm'; 
import { WorkoutExercise } from './WorkoutExercise';
import { ExerciseSetData } from './ExerciseSetData';
import { ExerciseData } from '../Exercises/ExerciseData';

@Entity({})
export class ExerciseSet {
  @PrimaryGeneratedColumn()
  id: number;

  // We store many ExerciseSetData to allow for "Drops Sets" where there are
  // Many weights, reps/time, and RPE in a single "set"
  @ManyToMany(type => ExerciseSetData, exerciseSetData => exerciseSetData.exerciseSet,  {
    onDelete: "NO ACTION",
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: "exerciseset_exercisesetdata_id",
    joinColumn: {
      name: "ExerciseSetData",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "ExerciseSet",
      referencedColumnName: "id",
    }
  })
  setsData: Relation<ExerciseSetData[]>;

  @ManyToMany(type => WorkoutExercise, exercise => exercise.exerciseSets)
  exercise : Relation<WorkoutExercise>;
}