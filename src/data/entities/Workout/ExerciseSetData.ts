import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, Relation } from 'typeorm';
import { ExerciseSet } from './ExerciseSet';

@Entity()
export class ExerciseSetData {
  @PrimaryGeneratedColumn()
  id : number

  @Column('smallint', {nullable : true})
  reps: number | null;

  @Column('double', {nullable : true})
  time: number | null;

  @Column('numeric', {nullable : true})
  rpe: number | null;

  @Column('numeric', {nullable : true})
  weight: number | null;

  @ManyToMany(type => ExerciseSet, exerciseSet => exerciseSet.setsData)
  exerciseSet : Relation<ExerciseSet>
}