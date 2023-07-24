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
import ImageIcon from "../components/ImageIcon";
import {makeRedirectUri, ResponseType, useAuthRequest} from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import LongBtn from "../components/LongBtn";
WebBrowser.maybeCompleteAuthSession();

const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
};
export default function HomePage({route, navigation}) {
    const [cookies,setCookies] = useCookies(['access-token',"username"])
    const [groups, setGroups] = useState()
    const [token, setToken] = useState(null)

    const [request, response, promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.Token,
            clientId: 'clientId',
            scopes: ['user-read-email', 'streaming',"user-read-playback-state" ,'playlist-modify-public',"user-modify-playback-state","user-read-currently-playing"],
            // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
            // this must be set to false
            usePKCE: false,
            redirectUri: makeRedirectUri({
                scheme: 'your.app'
            }),
        },
        discovery
    );

    const renderItem = ({item}) => {

        return (
            <TouchableOpacity style={styles.list} onPress={()=>navigation.navigate("ViewGroup",{
                group: item,
                token: token
            })}>
                <List.Section>
                    <List.Item style={styles.listItem} descriptionStyle={styles.desc} description={item.queue.length>0 ? item.queue[0].name : "No song queued" }  titleStyle={styles.title1} title={item.name} left={() => <ImageIcon size={20}/>} />
                </List.Section>
            </TouchableOpacity>
        );
    };
    if(token){
        navigation.navigate("ViewGroup",{token})}
    else{
        return (
            <View style={styles.container2}>
                <LongBtn text="Log in to Spotify" click={() => {promptAsync().then(r => {
                    setToken(r.authentication.accessToken)
                    console.log()
                }).catch(e=>console.log())}}/>
                <LongBtn text="Continue without Spotify"/>
            </View>
        )}
}


const styles = StyleSheet.create({
    container2: {
        alignItems: "center",
        backgroundColor: '#121b22',
        height: "100%",
        justifyContent: "center"
    },
    list: {
        backgroundColor: '#121b22',
        width: '100%',
    },
    flat: {
        height: "93%",
        flexGrow: 0
    },
    title1: {
        color: "rgba(238,233,233,0.86)",
        fontSize: 16,
        fontWeight: "bold"
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    desc: {
        color: "rgba(112,107,107,0.86)",
        fontStyle: "italic"
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
