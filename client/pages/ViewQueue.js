import {Text, View, StyleSheet, FlatList, TouchableOpacity, Image} from "react-native";
import axios from "axios";
import {api} from "../config/Api";
import {useEffect, useRef, useState} from "react";
import * as React from "react";
import {List} from "react-native-paper";
import {Ionicons} from "@expo/vector-icons";
import IconButton from "../components/IconButton";

export default function ViewQueue({navigation,route}) {
    const {token} = route.params
    const [queue, setQueue] = useState([])
    const [rerender, setRerender] = useState(false)
    const queueRef = useRef([]);
    useEffect( () => {
        getQueue().then(r=>console.log(queue,"hi")).catch(e=>console.log("ad",e,token))


    }, );

    async function getQueue() {
        await axios.get("https://api.spotify.com/v1/me/player/queue", {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }).then(r=>{setQueue(r.data.queue)})
    }

    const renderItem = ({item}) => {
        console.log(item.name,"ssss")
        return (
            <View style={styles.list}>
                <List.Section>
                    <List.Item style={styles.listItem} descriptionStyle={styles.artistText} description={item.artists[0].name}  titleStyle={styles.text} title={"klutuytfdgfrhftuyi"}  icon={"trash-outline"} noBorder={true} color={"#010a1e"}/>} left={() => <Image style={{width: 50, height: 60, opacity: 0.8, left: 5,top: 5}} source={{uri: item.album.images[0].url}}/>}/>
                </List.Section>
            </View>
        );
    };
    return(
        <View style={styles.container}>
            <Text style={styles.text1}>Current Queue</Text>
            <FlatList
                style={styles.flat}
                data={queue}
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
