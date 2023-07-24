import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image} from "react-native"
import TextField from "../components/TextField";
import * as React from "react";
import {List} from "react-native-paper";
import {Ionicons} from "@expo/vector-icons";
import axios from "axios";
import {api} from "../config/Api";
import {useState} from "react";

export default function SearchUsers(){

    const [users, setUsers] = useState()
    getUsers().then(r => console.log("good"))
    const [text, setText] = useState(null)
    const [searchedUsers, setSearchedUsers] = useState()
    function updateSearch(text) {
        setText(text)
        console.log(users,"erwerwererewrrewewrerewe")
        setSearchedUsers(users.filter(user => user.username.includes(text)));
    }
    const renderItem = ({item}) => {
        return (
            <TouchableOpacity style={styles.list}>
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        backgroundColor: 'rgba(42,78,107,0.68)',
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
