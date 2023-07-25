import {View, StyleSheet, Text, Image, TouchableOpacity, FlatList, AppRegistry} from "react-native";
import LongBtn from "../components/LongBtn";
import {makeRedirectUri, ResponseType, useAuthRequest} from "expo-auth-session";
import {useEffect, useRef, useState} from 'react';
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import axios from "axios";
import logo from "../assets/logo-white.png";
import {height, width} from "../config/DeviceDemensions";
import {Ionicons} from "@expo/vector-icons";
import ProgressBar from 'react-native-progress/Bar';
import TextField from "../components/TextField";
import {List} from "react-native-paper";
import ImageIcon from "../components/ImageIcon";
import Alert from "../components/Alert"
import {api} from "../config/Api";
import * as querystring from "querystring";

export default function ViewGroup({navigation,route}){
    const {notifications} = route.params
    const DATA = [{val: "J"},{val: "V"},{val: "S"},{val: "W"},{val: "H"},{val: "O"},{val: "M"},{val: "X"},{val: "P"},{val: "J"},{val: "G"},{val: "J"}]
    const DATA2 =[{val: "J"}]
    function renderData({item}){
        return(
            <View style={styles.circle}>
                <Text>{item.val}</Text>
            </View>
        )
    }
    function renderNotificationData({item}){
        return (
            <View style={styles.vList}>
                <View style={styles.row}>
                    <View style={styles.circle}>
                        <Text>{item.val}</Text>
                    </View>
                <View>
                    <Text style={styles.text}>{item.sender} invited you</Text>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.btn}>
                            <Text style={styles.text2} >Join</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn2}>
                            <Text style={styles.text2} >Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                </View>

            </View>
        )
    }
    return(
        <View style={styles.container}>
            <View style={styles.owner}>
                <Text style={styles.text}>Group Owner</Text>
                <FlatList
                    style={styles.list}
                    horizontal={true}
                    data={DATA2}
                    renderItem={renderData}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <View style={styles.members}>
                <Text style={styles.text}>Group members</Text>
                <FlatList
                    horizontal={true}
                    data={DATA}
                    renderItem={renderData}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <View style={styles.notifs}>
                <Text style={styles.text}>Notifications</Text>
                <FlatList
                    data={notifications}
                    renderItem={renderNotificationData}
                    keyExtractor={(item) => item.id}
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    vList: {
        marginBottom: 30
    },
    container: {
        flex: 1,
        backgroundColor: '#121b22',
        alignItems: 'center',
    },
    search: {
        marginTop: -20
    },
    notifs: {
        width: "100%",
        height: '55%'
    },
    btn: {
        backgroundColor: "#184bbe",
        alignItems: "center",
        width: 80,
        height: 30,
        justifyContent: "center",
        marginLeft: 12,
        borderRadius: 5
    },
    btn2: {
        backgroundColor: "#be1844",
        alignItems: "center",
        width: 80,
        height: 30,
        justifyContent: "center",
        marginLeft: 12,
        borderRadius: 5
    },
    musicBox: {
        backgroundColor: 'rgba(42,78,107,0.68)',
        width: "100%",
        height: 70,
        flexDirection: "row"
    },
    owner: {
        height: "22%",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "white",
        width: "100%"
    },
    members: {
        height: "22%",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "white"
    },
    flat: {
        height: "93%",
        flexGrow: 0,
        width: "100%"
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: "#fff",
        margin: 8,
        justifyContent: "center",
        alignItems: "center"
    },
    progress: {
        left: 16
    },
    alert: {
        width: '97%',
        marginBottom: 20
    },
    textContainer: {

    },
    title: {
        marginTop: 30,
        color: "white",
        fontWeight: "bold",
        fontSize: 20
    },
    text: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        marginTop: 10,
        right: -10,
        marginBottom:20
    },
    text2: {
        color: "white",
        fontWeight: "bold",
    },
    artistText: {
        color: "#9b9595",
        fontWeight: "bold",
        fontSize: 16,
        marginLeft: 20,
        fontStyle: "italic"
    },
    row: {
        flexDirection: "row",
        width: '100%',

    },

    desc: {
        color: "rgba(112,107,107,0.86)",
        fontStyle: "italic",
        left: 20
    },
    icon: {
        marginTop: 15,
        right: 50
    },
    list: {
        backgroundColor: '#121b22',
        width: '70%',
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },

})
