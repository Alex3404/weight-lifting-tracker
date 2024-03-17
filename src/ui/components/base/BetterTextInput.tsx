import React from "react";
import { useState } from "react";
import { StyleProp, TextInput, TextInputProps, TextStyle } from "react-native";

export interface StyledTextInputProps extends TextInputProps {
    focusedStyle? : StyleProp<TextStyle> | undefined
    bluredStyle? : StyleProp<TextStyle>  | undefined
}

export default function StyledTextInput(props : StyledTextInputProps) {
    const { focusedStyle, bluredStyle, ...textInputProps } = props;
    const [focused, setFocused] = useState(false);

    const oldOnFocus = textInputProps.onFocus;
    textInputProps.onFocus = event => {
        setFocused(true)
        if(oldOnFocus !== undefined) {
            oldOnFocus(event);
        }
    }

    const oldOnBlur = textInputProps.onBlur;
    textInputProps.onBlur = event => {
        setFocused(false)
        if(oldOnBlur !== undefined) {
            oldOnBlur(event);
        }
    }

    if(focused) {
        textInputProps.style = focusedStyle
    } else {
        textInputProps.style = bluredStyle
    }
    
    return <TextInput {...textInputProps}/>
}