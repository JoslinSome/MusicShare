import {View, StyleSheet, TouchableOpacity} from "react-native";
import {backgroundColor} from "../config/colors";
import { TextInput } from 'react-native-paper';
import {useState} from "react";
import {height, width} from "../config/DeviceDemensions";
import ImageIcon from "../components/ImageIcon";
import IconButton from "../components/IconButton";
import * as React from "react";

export default function CreateGroup(){
    const [text,setText] = useState("")
    return(
        <View style={styles.container}>

            <TouchableOpacity style={styles.image}>
             <ImageIcon />
            </TouchableOpacity>

            <TextInput
                label="Group Name"
                onChangeText={text => setText(text)}
                style={styles.input}
            />

            <View style={styles.btn}>
                <IconButton icon={"checkmark-outline"}/>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backgroundColor,
        alignItems: 'center',
    },
    input: {
        width: width*.42,
        top: height*.12,
        borderRadius: 5
    },
    image: {
        marginTop: height*.15
    },
    btn: {
        bottom: 10,
        alignSelf: "flex-end",
        right: 30,
        position: "absolute"
    }
})
