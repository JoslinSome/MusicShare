import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from "react-native"
import {height, width} from "../config/DeviceDemensions";
import {Ionicons} from "@expo/vector-icons";
import * as React from "react";
import {backgroundColor, titleColor} from "../config/colors";
import IconButton from "../components/IconButton";

export default function HomePage({navigation}) {
    return(
        <View style={styles.container}>
            <View styl={styles.top}>
                <View style={styles.row}>
                    <Text style={styles.title}>Your Groups</Text>
                    <View style={styles.icons}>
                        <TouchableOpacity>
                            <Ionicons name="notifications-outline" size={30} color={"#c6bce0"}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="settings-outline" style={styles.icon} size={30} color={"#c6bce0"}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>


            <ScrollView>

            </ScrollView>
            <View style={styles.btn}>
                <IconButton onPress={()=> navigation.navigate("CreateGroup")} icon={"headset-outline"}/>
            </View >
        </View>
    )
}


const styles = StyleSheet.create({
    top: {

    },
    btn: {
        bottom: 80,
        alignSelf: "flex-end",
        right: 20,
        position: "absolute"
    },
    container: {
        flex: 1,
        backgroundColor: backgroundColor,
    },
    icon: {
        marginLeft: 20
    },
    icons: {
        flexDirection: "row",
        top: 40,
        right: -100,

    },

    row:{
        flexDirection: "row",
        //backgroundColor: 'rgba(64,36,80,0.34)',

        position: "absolute",
        zIndex: 1,
        width: "100%",
        height: 95
    },
    title: {
        fontSize: 25,
        color: titleColor,
        fontWeight: "bold",
        marginTop: 35,
        marginBottom:20,
        marginLeft: 10
    },

});
