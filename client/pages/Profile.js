import {View, Text, StyleSheet, TouchableOpacity} from "react-native"
import ImageIcon from "../components/ImageIcon";
import * as React from "react";
import {height} from "../config/DeviceDemensions";
import {useCookies} from "react-cookie";
import axios from "axios";
import {api} from "../config/Api";
import {useRef, useState} from "react";

export default function Profile({route,navigation}) {
    const {user,token,profile} = route.params
    const [cookies,setCookies] = useCookies(['access-token',"username"])
    console.log(user,"PROOOOOOOOOKISHFJKBDJKBHJDSK")
    const getUserProfile = async () =>{
        await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }).then(r=>{
            console.log(profile.images[0])
        }).catch(e=>console.log(e,"getting profile error"))
    }
    getUserProfile().then(r=>null).catch(e=>console.log(e,"profile Error"))

    function logout(){
        setCookies("access-token",null)
        setCookies("username",null)
        navigation.popToTop();
        navigation.replace('Auth')
    }
    return(
        <View style={styles.container}>
            <View style={styles.row}>
                <TouchableOpacity style={styles.image}>
                    <View style={styles.container2}>
                        <Text style={styles.text3}>{user.firstname[0]+user.lastname[0]}</Text>
                    </View>
                </TouchableOpacity>
                <View>

                    <Text style={styles.text}>{user.firstname+" "+user.lastname}</Text>
                    <Text style={styles.text2}>@{user.username}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.logout} onPress={logout}>
                <Text style={styles.text4}>Log out</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121b22',
        alignItems: 'center',
    },
    logout: {
        backgroundColor: "#3366d3",
        marginTop: 110,
        marginLeft: 80,
        alignItems: "center",
        justifyContent: "center",
        width: 90,
        height: 40,
        borderRadius: 10
    },
    container2: {
        width: 130,
        height: 130,
        borderRadius: 100,
        backgroundColor: "#3668d7",
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        left: 10
    },
    text: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
        marginLeft: 30,
        marginTop: 50
    },
    text4: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
    },
    text3: {
        color: "white",
        fontWeight: "bold",
        fontSize: 38,
    },
    text2: {
        color: "white",
        fontStyle: "italic",
        fontSize: 16,
        marginLeft: 30,
        marginTop: 15
    },
    row: {
        width: '100%',
        flexDirection: "row",
        top: height/2-60,

    }
});
