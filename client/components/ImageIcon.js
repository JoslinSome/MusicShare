import {View, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import * as React from "react";
import {titleColor} from "../config/colors";

export default function ImageIcon({size}) {
     {
        if(!size){
            return(

            <View>
                <View style={styles.container}>
                    <Ionicons style={styles.icon} name="camera-outline" size={40} color={"#c6bce0"}/>
                </View>
                <View style={styles.icon2}>
                    <Ionicons style={styles.icon3} name="add-outline" size={35} color={"#1616c0"}/>
                </View>
            </View>)}
        else{
            return(
                <View style={styles.container2}>
                    <Ionicons style={styles.icon} name="camera-outline" size={40} color={"#c6bce0"}/>
                </View>
            )
                }
}


}

const styles =StyleSheet.create({
    container: {
        width: 80,
        height: 80,
        borderColor: titleColor,
        borderWidth:2,
        justifyContent: "center",
        borderRadius: 100
    },
    container2: {
        marginLeft: 10
    },
    icon2:{
        backgroundColor: "rgb(255,255,255)",
        width: 30,
        height: 30,
        borderRadius: 100,
        top: -25,
        right: -50
    },
    icon3: {
        bottom: 3,
        right: 1
    },
    icon: {
        alignSelf: "center"
    }
})
