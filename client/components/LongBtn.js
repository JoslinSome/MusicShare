import {StyleSheet, View, Text, TouchableOpacity} from "react-native"
import * as React from "react";
import {width,height} from "../config/DeviceDemensions";
export default function LongBtn({text,navigation,to, click, propWidth}) {
    return(
        <View style={!propWidth? styles.container: styles.container2}>
            <TouchableOpacity onPress={to? ()=>navigation.navigate(to) : click}>
                <Text style={styles.text}>{text} </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width*.45,
        height: height*.15,
        borderColor: "#4f18da",
        borderWidth: 3,
        justifyContent: "center",
        borderRadius: 15,
        marginBottom: 20,
        backgroundColor: "#c6bce0"
    },
    container2: {
        width: width*.35,
        height: height*.15,
        borderColor: "#4f18da",
        borderWidth: 3,
        justifyContent: "center",
        borderRadius: 15,
        marginBottom: 20,
        backgroundColor: "#c6bce0"
    },

    text: {
        alignSelf: "center",
        fontSize: 20,
        fontWeight: "bold"
    }

})
