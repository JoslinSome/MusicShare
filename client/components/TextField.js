import {View, StyleSheet, Text,TextInput} from "react-native"
import {width,height} from "../config/DeviceDemensions";
import {useState} from "react";

export default function TextField({title,password,half,onChange}){

    return(
        <View style={styles.field}>
            <Text style={styles.text}>{title}</Text>
            <View style={half? styles.container2 :styles.container}>
                <TextInput secureTextEntry={password} onChangeText={text  => onChange(text)}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffff",
        width: width*.45,
        height: height*.13,
        borderRadius: 15,
        marginTop:  height*.1,
        fontSize: 20
    },
    container2: {
        backgroundColor: "#ffff",
        width: width*.21,
        height: height*.13,
        borderRadius: 15,
        marginTop:  height*.1,
        fontSize: 20
    },
    text: {
        fontSize: 15,
        color: "#c6bce0",
        fontWeight: "bold",
        marginBottom: -30
    },
    field: {
        padding: 10
    }
})
