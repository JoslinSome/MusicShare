import {View, StyleSheet,Text} from "react-native"
import {width} from "../config/DeviceDemensions";

export default function Alert({text}){

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: "white",
        width: "97%",
        height: 30,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        color: "#0e2a62",
        fontWeight: "bold",
        fontSize: 15
    }
})
