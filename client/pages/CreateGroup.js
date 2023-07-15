import {View, StyleSheet, TouchableOpacity, Text} from "react-native";
import {backgroundColor} from "../config/colors";
import { TextInput } from 'react-native-paper';
import {useState} from "react";
import {height, width} from "../config/DeviceDemensions";
import ImageIcon from "../components/ImageIcon";
import IconButton from "../components/IconButton";
import * as React from "react";
import {api} from "../config/Api"
import axios from "axios";
import {useCookies} from "react-cookie";
export default function CreateGroup({navigation}){
    const [text,setText] = useState("")
    const [cookies,setCookies] = useCookies(['access-token',"username"])
    const [err, setErr] = useState()

    async function create(){
        if(text.length>0){
            await axios.post("http://"+api+`/group/create-group`, {
                username: cookies.username,
                name: text
            })
                .then(r=>{
                    if(r.data.hasOwnProperty("message")){
                        setErr(r.data.message)
                    }
                    else{
                        console.log(r.data)
                        //window.localStorage.setItem("userId",r.data.userId)
                        navigation.pop()
                    }

                })
                .catch(err=>{console.log("Error",err)})
        }
        else{
            setErr("Add a group name")
        }
    }
    return(
        <View style={styles.container}>

            <TouchableOpacity style={styles.image}>
             <ImageIcon />
            </TouchableOpacity>
            <Text style={styles.err}>{err}</Text>
            <TextInput
                label="Group Name"
                onChangeText={text => setText(text)}
                style={styles.input}
            />

            <View style={styles.btn}>
                <IconButton icon={"checkmark-outline"} onPress={create} />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backgroundColor,
        alignItems: 'center',
    },
    err: {
        color: "rgba(245,237,237,0.81)",
        fontSize: 20,
        alignSelf: "center",

    },
    input: {
        width: width*.42,
        top: height*.12,
        borderRadius: 5
    },
    image: {
        marginTop: height*.15
    },
    btn: {
        bottom: 10,
        alignSelf: "flex-end",
        right: 30,
        position: "absolute"
    }
})
