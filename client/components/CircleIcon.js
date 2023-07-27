import {View, StyleSheet, Text} from "react-native"
import * as React from "react";

export default function CircleIcon({size,first,last,user,number}){
    const containers = [styles.container,styles.container1,styles.container2,styles.container3,styles.container4,styles.container5,styles.container6,styles.container7,styles.container8,styles.container9]

    return(
        <View style={containers[number]}>
            <Text style={size? styles.text2: styles.text}>{first+last}</Text>
        </View>
    )
}

const colors =["#ad2424","#52b79c","#b61d85","#65c535","#f6bf2f","#f15218","#035905","#2cbbc0","#866673","#77ef0f"]
const styles = StyleSheet.create({
    container: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: colors[0],
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    container1: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: colors[1],
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    container2: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: colors[2],
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    container3: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: colors[3],
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    container4: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: colors[4],
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    container5: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: colors[5],
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    container6: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: colors[6],
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    container7: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: colors[7],
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    container8: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: colors[8],
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    container9: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: colors[9],
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
    },

    text: {
        fontWeight: "bold",
        color: "#fff",
        fontSize: 25,
    },
    text2: {
        fontWeight: "bold",
        color: "#fff",
        fontSize: 10,
    }
})
