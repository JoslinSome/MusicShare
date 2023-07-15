import {View, StyleSheet, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import * as React from "react";

export default function IconButton({icon,onPress}) {

    return(
        <View>
            <TouchableOpacity style={styles.btn} onPress={ onPress}>
                <Ionicons name={icon} size={30}/>
            </TouchableOpacity>
        </View>
    )
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
    }

})
