import { Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { Workout } from './Workout/Workout';

@Entity()
export class CurrentWorkout {
  @PrimaryColumn()
  id : number

  @OneToOne(type => Workout, { nullable: true })
  workout : Workout
}