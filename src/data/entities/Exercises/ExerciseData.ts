import { Entity, Column, PrimaryColumn } from "typeorm"

export enum MuscleGroup {
    Quadriceps = "quadriceps",
    Sholders = "sholders",
    Abdominals = "abdominals",
    Chest = "chest",
    Hamstrings = "hamstrings",
    Triceps = "triceps",
    Biceps = "biceps",
    Lats = "lats",
    Middle_Back = "middle back",
    Calves = "calves",
    Lower_Back = "lower back",
    Forearms = "forearms",
    Glutes = "glutes",
    Traps = "traps",
    Adductors = "adductors",
    Abductors = "abductors",
    Neck = "neck",
    Other = "other",
}

export enum Equipment {
    Barbell = "barbell",
    Dumbbell = "dumbbell",
    Body_Only = "body only",
    Cable = "cable",
    Machine = "machine",
    Kettlebells = "kettlebells",
    Bands = "bands",
    Medicine_Ball = "medicine ball",
    Exercise_Ball = "exercise ball",
    Foam_Roll = "foam roll",
    ez_curl_bar = "e-z curl bar",
    Other = "other",
}

export enum Force {
    Pull = "Pull",
    Push = "Push",
    Static = "Static",
}

export enum Level {
    Beginner = "beginner",
    Intermediate = "intermediate",
    Expert = "expert",
}

export enum Category {
    Strength = "strength",
    Stretching = "stretching",
    Plyometrics = "plyometrics",
    Powerlifting = "powerlifting",
    Olympic_Weightlifting = "olympic weightlifting",
    Strongman = "strongman",
    Cardio = "cardio",
}

export enum Mechanic {
    Compound = "compound",
    Isolation = "isolation",
}

@Entity()
export class ExerciseData {
    @PrimaryColumn("text")
    id: string

    @Column("text")
    name : string
    
    @Column({
        type: "text",
        default: Force.Static
    })
    force : Force

    @Column({
        type: "text",
        default: Level.Beginner,
    })
    level : Level

    @Column({
        type: "text",
        default: Mechanic.Compound,
    })
    mechanic : Mechanic

    @Column({
        type: "text",
        default: Category.Strength,
    })
    category : Category

    @Column({
        type: "text",
        default: Equipment.Other,
    })
    equipment : Equipment

    @Column("simple-array")
    primaryMuscles : MuscleGroup[]

    @Column("simple-array")
    secondaryMuscles : MuscleGroup[]

    @Column("text")
    instructions : string
}