import {View, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import * as React from "react";
import {titleColor} from "../config/colors";

export default function ImageIcon({size, image}) {
     {
        if(!size){
            return(

            <View>
                <View style={styles.container}>
                    <Ionicons style={styles.icon} name="person-outline" size={70} color={"#c6bce0"}/>
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
        width: 130,
        height: 130,
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
        width: 40,
        height: 40,
        borderRadius: 100,
        top: -35,
        right: -80,
        alignItems: "center",
        justifyContent: "center"
    },

    icon: {
        alignSelf: "center"
    }
})
