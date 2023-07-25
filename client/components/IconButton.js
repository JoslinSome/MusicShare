import {View, StyleSheet, TouchableOpacity,Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import * as React from "react";

export default function IconButton({icon,onPress,noBorder,color,notifications,value}) {
    if(notifications && value>0){

        return (
            <View style={styles.row}>
                <TouchableOpacity style={styles.btn2} onPress={onPress}>
                    <Ionicons name={icon} size={35} color={color}/>
                </TouchableOpacity>
                <View style={styles.border}>
                    <Text style={styles.number}>{value}</Text>
                </View>
            </View>
        )
    }
    else {
        return (
            <View>
                {
                    noBorder ?
                        <TouchableOpacity style={styles.btn2} onPress={onPress}>
                            <Ionicons name={icon} size={35} color={color}/>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.btn} onPress={onPress}>
                            <Ionicons name={icon} size={30}/>
                        </TouchableOpacity>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    btn: {
        width: 70,
        height: 70,
        backgroundColor: "#c6bce0",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    row: {
        flexDirection: "row"
    },
    border: {
        backgroundColor: "red",
        borderRadius: 150,
        width: 20,
        height: 20,
        alignItems: "center",
        marginLeft: -8,
        marginBottom: -5
    },
    number: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold"
    },
    btn2: {
        marginTop: 10
    }


})
