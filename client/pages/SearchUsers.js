import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image} from "react-native"
import TextField from "../components/TextField";
import * as React from "react";
import {List} from "react-native-paper";
import {Ionicons} from "@expo/vector-icons";
import axios from "axios";
import {api} from "../config/Api";
import {useState} from "react";
import {useCookies} from "react-cookie";
import Alert from "../components/Alert";

export default function SearchUsers(){
    const [alert, setAlert] = useState(false)
    const [users, setUsers] = useState()
    const [cookies,setCookies] = useCookies(['access-token',"username"])
    getUsers().then(r => {})
    const [text, setText] = useState(null)
    const [searchedUsers, setSearchedUsers] = useState()
    function updateSearch(text) {
        setText(text)
        setSearchedUsers(users.filter(user => user.username.includes(text)));
    }
    async function sendRequest(receiver) {
            await axios.post("http://" + api + `/request/send`, {
                sender: cookies["username"],
                receiver
            }).then(r=>{
                console.log(r.data,"THIS MESSAGE")
            })
            await triggerAlert()
            console.log("HERRRRREEEE")
    }
    async function triggerAlert() {
        setAlert(true)
        await timeout(1000);
        setAlert(false)
    }
    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }
    const renderItem = ({item}) => {
        return (
            <TouchableOpacity style={styles.list} onPress={() => sendRequest(item.username)}>
                <List.Section>
                    <List.Item style={styles.listItem} descriptionStyle={styles.artistText} description={item.username}  titleStyle={styles.text} title={item.firstname+" "+item.lastname} right={() => <Ionicons style={{top:10}} name={"add-circle-outline"} color={"#fff"} size={40}/>} left={() => <Image style={{width: 50, height: 60, opacity: 0.8, left: 5,top: 5}} source={{uri: item.image}}/>}/>
                </List.Section>
            </TouchableOpacity>
        );
    };
    async function getUsers() {
        await axios.get("http://" + api + `/auth/get-all-users`).then(r=> {
            setUsers(r.data.users)
        })
    }
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Invite a user</Text>
            <View style={styles.search} >
                <TextField placeholder={"Search a song to add to queue"} onChange={(e)=>updateSearch(e)} text={"Search"}  icon={"search-outline"}/>
            </View>
            <FlatList
                style={styles.flat}
                data={text? searchedUsers: users}
                keyExtractor={item => item._id}
                renderItem={renderItem}/>
            {
                alert?
                    <View style={styles.alert}>
                        <Alert text={"invite sent"}/>
                    </View>
                    :null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    alert: {
        width: '97%',
        marginBottom: 60
    },
    artistText: {
        color: "#fcf9f9",
        fontStyle: "italic"
    },
    text: {
        color: "#fff",
        fontWeight: "bold"
    },
    container: {
        height: "100%",
        backgroundColor: '#121b22',
        alignItems: "center"
    },
    title: {
        marginTop: 30,
        color: "white",
        fontWeight: "bold",
        fontSize: 20
    },
    flat: {
        height: "93%",
        flexGrow: 0,
        width: "100%"
    },
    search: {
        marginTop: -20
    }
})
