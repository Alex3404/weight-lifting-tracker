import React from "react";
import { useState } from "react";
import { View, Text, TouchableNativeFeedback, StyleSheet } from "react-native";
import BetterButton, { BetterButtonProps } from "./base/BetterButton";
import { getTheme } from "../redux-store/theme";

export default function PrimaryButton(props : BetterButtonProps) {
    const [theme, _] = getTheme();

    const styles = StyleSheet.create({
        buttonStyle: {
            borderColor: theme.PrimaryColor,
            borderWidth: 1,
            borderRadius: theme.BorderRadius,
            padding: 5,
        },
    
        buttonTextStyle: {
            textAlign: "center",
            fontWeight: "bold",
            
            color: theme.PrimaryColor,
        }
    });  

    return <BetterButton
        style={styles.buttonStyle}
        titleStyle={styles.buttonTextStyle}
        background={TouchableNativeFeedback.Ripple(theme.PrimaryColor, false)}
        {...props}
    />
}