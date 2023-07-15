import {View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList} from "react-native"
import {height, width} from "../config/DeviceDemensions";
import {Ionicons} from "@expo/vector-icons";
import * as React from "react";
import {backgroundColor, titleColor} from "../config/colors";
import IconButton from "../components/IconButton";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {api} from "../config/Api";
import { List, MD3Colors } from 'react-native-paper';

import {useCookies} from "react-cookie";
import {Item} from "react-native-paper/src/components/List/List";
export default function HomePage({navigation}) {
    const [cookies,setCookies] = useCookies(['access-token',"username"])
    const groups =useRef([])
    async function loadGroups(){
        await axios.get("http://" + api + `/group/get-user-groups`, {
            params: {
               username: cookies.username
            }
        })
            .then(r => {
                groups.current = r.data
                console.log(groups.current)
            })
    }
    useEffect( () => {
        loadGroups()
            .then(r => console.log("Groups Loaded"))
            .catch(err=> console.log(err,"Error Loading"))
    }, );
    const renderItem = ({item}) => {

        return (
            <View style={styles.list}>
                <List.Section>
                    <List.Item style={styles.listItem} description={"THis is a sadnasjdnalksjdaskl"} title="First tem" left={() => <List.Icon icon="folder" />} />
                </List.Section>
            </View>
        );
    };
    return(
        <View style={styles.container}>
            <FlatList
                data={groups.current}
                keyExtractor={item => item._id}
                renderItem={renderItem}/>
            <View style={styles.btn}>
                <IconButton onPress={()=> navigation.navigate("CreateGroup")} icon={"headset-outline"} />
            </View >
        </View>
    )
}


const styles = StyleSheet.create({

    list: {
        backgroundColor: 'rgba(46,9,84,0.72)',
        width: '100%',
        margin: .5
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
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
    listItem: {
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
