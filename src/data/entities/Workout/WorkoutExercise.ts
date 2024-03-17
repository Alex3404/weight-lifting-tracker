import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, Column, JoinTable, Relation, JoinColumn, ManyToMany } from "typeorm"
import { Workout } from "./Workout"
import { ExerciseSet } from "./ExerciseSet"
import { ExerciseData } from "../Exercises/ExerciseData"

@Entity()
export class WorkoutExercise {
  @PrimaryGeneratedColumn()
  id: number
  
  @ManyToMany(type => ExerciseSet, exerciseSet => exerciseSet.exercise,  {
    onDelete: "CASCADE",
    cascade: true,
  })
  @JoinTable({
    name: "workout_exercise_set_id",
    joinColumn: {
      name: "ExerciseSet",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "WorkoutExercise",
      referencedColumnName: "id",
    }
  })
  exerciseSets: Relation<ExerciseSet[]>

  @ManyToMany(type => Workout, workout => workout.exercises)
  workout : Relation<Workout>

  @ManyToOne(type => ExerciseData, {eager: true})
  @JoinColumn()
  exerciseData : ExerciseData
}