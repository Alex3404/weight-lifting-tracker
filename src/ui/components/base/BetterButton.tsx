import React from "react";
import { useState } from "react";
import { View, StyleProp, Text, TextStyle, TouchableNativeFeedback, TouchableNativeFeedbackProps } from "react-native";

export interface BetterButtonProps extends TouchableNativeFeedbackProps {
    title: string
    titleStyle? : StyleProp<TextStyle> 
}

export default function BetterButton(props : BetterButtonProps) {
    const { title, titleStyle, ...touchProps } = props;
    return <TouchableNativeFeedback {...touchProps}>
        <View style={touchProps.style}>
            <Text style={titleStyle}> {title} </Text>
        </View>
    </TouchableNativeFeedback>
}