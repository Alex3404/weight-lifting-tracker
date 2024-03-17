import React from 'react';
import { View, Text } from "react-native";
import type { SettingsScreenProps } from '../types';

export default function SettingsScreen({ route, navigation } : SettingsScreenProps) {
    return (
        <View>
            <Text>Settings</Text>
        </View>
    )
}