import {View, Text, StyleSheet, TouchableOpacity} from "react-native"
import ImageIcon from "../components/ImageIcon";
import * as React from "react";
import {height} from "../config/DeviceDemensions";
import {useCookies} from "react-cookie";
import axios from "axios";
import {api} from "../config/Api";
import {useState} from "react";

export default function Profile() {
    const [cookies,setCookies] = useCookies(['access-token',"username"])
    const [user, setUser] = useState({});
    getUserByName().then(r => console.log("") )
    async function getUserByName() {
        await axios.get("http://" + api + `/auth/get-user-by-name`,{
            params: {
                username: cookies.username
            }
        }).then(r => {
            setUser(r.data.user[0])
        })
    }
    return(
        <View style={styles.container}>
            <View style={styles.row}>
                <TouchableOpacity style={styles.image}>
                    <ImageIcon  />
                </TouchableOpacity>
                <View>
                    <Text style={styles.text}>{user.firstname+" "+user.lastname}</Text>
                    <Text style={styles.text2}>@{user.username}</Text>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121b22',
        alignItems: 'center',
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
