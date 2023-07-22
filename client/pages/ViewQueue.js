import {Text, View, StyleSheet, FlatList, TouchableOpacity, Image} from "react-native";
import axios from "axios";
import {api} from "../config/Api";
import {useEffect, useState} from "react";
import * as React from "react";
import {List} from "react-native-paper";
import {Ionicons} from "@expo/vector-icons";
import IconButton from "../components/IconButton";

export default function ViewQueue({navigation,route}) {
    const {group} = route.params
    const [queue, setQueue] = useState()
    useEffect( () => {
        getQueue().then(r=>console.log("good")).catch(e=>console.log("bad",e))

    }, );
    async function getQueue() {
        await axios.get("http://" + api + `/group/get-group`, {
            params: {
                groupID: group._id,
            }
        }).then(r=> {
            setQueue(r.queue)
            console.log(queue)
        })
    }
    async function removeSong(song) {
        await axios.put("http://" + api + `/group/remove-song`, {
            params: {
                groupID: group._id,
                song
            }
        }).then(r=> {
            setQueue(r.queue)
            console.log(queue)
            getQueue().then(r=>console.log("good")).catch(e=>console.log("bad",e))
        })
    }
    const renderItem = ({item}) => {
        return (
            <View style={styles.list}>
                <List.Section>
                    <List.Item style={styles.listItem} descriptionStyle={styles.artistText} description={item.artist}  titleStyle={styles.text} title={item.name} right={() => <IconButton onPress={()=>removeSong(item)} icon={"trash-outline"} noBorder={true} color={"#010a1e"}/>} left={() => <Image style={{width: 50, height: 60, opacity: 0.8, left: 5,top: 5}} source={{uri: item.image}}/>}/>
                </List.Section>
            </View>
        );
    };
    return(
        <View style={styles.container}>
            <Text style={styles.text1}>Current Queue</Text>
            <FlatList
                style={styles.flat}
                data={group.queue}
                keyExtractor={item => item._id}
                renderItem={renderItem}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: 'rgba(42,78,107,0.68)',
    },
    flat: {
        height: '85%',
        flexGrow: 0,
        width: "100%",
        marginTop: 10
    },
    list: {
        width: '100%',
    },
    text: {
        color: "#010a1e",
        fontWeight: "bold",

    },
    text1: {
        color: "white",
        fontWeight: "bold",
        fontSize: 23,
        marginTop: 50,
        alignSelf: "center"
    }
})
