import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Relation, CreateDateColumn, JoinTable } from "typeorm"
import { WorkoutExercise } from "./WorkoutExercise"

@Entity()
export class Workout {
    @PrimaryGeneratedColumn()
    id: number

    @Column("numeric")
    time : number

    @Column("datetime", { nullable: true })
    stopWatchStartTime : number

    @CreateDateColumn()
    @Column('datetime')
    startDateTime : number

    @Column('datetime', { nullable: true })
    endDateTime : number

    @ManyToMany(type => WorkoutExercise, exercise=> exercise.workout)
    @JoinTable({
        name: "workout_workoutexercise_id",
        joinColumn: {
          name: "WorkoutExercise",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "Workout",
          referencedColumnName: "id",
        }
      })
    exercises : Relation<WorkoutExercise[]>;
}