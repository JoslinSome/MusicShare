import {View, StyleSheet, Text, Image, TouchableOpacity, FlatList, AppRegistry} from "react-native";
import LongBtn from "../components/LongBtn";
import {makeRedirectUri, ResponseType, useAuthRequest} from "expo-auth-session";
import {useEffect, useState} from 'react';
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
export default function ViewGroup({navigation,route}){
    const [image, setImage] = useState()
    const [isPlaying, setIsPlaying] = useState(false)
    const [songName, setSongName] = useState("")
    const [artists, setArtists] = useState("")
    const [progress, setProgress] = useState(true)
    const [text, setText] = useState("")
    const [time, setTime] = useState()
    const [tracks, setTracks] = useState({})
    const {token,group} = route.params
    const [alert, setAlert] = useState(false)
    const [currSong, setCurrSong] = useState(null)
    useEffect( () => {
        getCurrentSong(token).then(r=>setCurrSong(r)).catch(e=>console.log("bad",e))

    }, );
    const getCurrentSong = async (token) => {

        await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }).then(r=> {
            //const res = JSON.parse(r)]
            if(!r){
                return null
            }

            setImage(r.data.item.album.images[0].url)
            setIsPlaying(r.data.is_playing)
            setSongName(r.data.item.name)
            setTime(r.data.item.duration_ms)
            setProgress(r.data.progress_ms)
            let singers = ""
            for (let i = 0; i < r.data.item.artists.length; i++) {
                singers+= r.data.item.artists[i].name
                if(i<r.data.item.artists.length-1){
                    singers+=", "
                }
            }
            setArtists(singers)
            return r.data.item.album.images[0]

        }).catch(err=>console.log(err,token))
    }
    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }
    async function triggerAlert() {
        setAlert(true)
        await timeout(3000);
        setAlert(false)
    }
    const renderItem = ({item}) => {
        return (
            <TouchableOpacity style={styles.list} onPress={()=>enqueue(item)}>
                <List.Section>
                    <List.Item style={styles.listItem} descriptionStyle={styles.artistText} description={item.artist}  titleStyle={styles.text} title={item.name} right={() => <Ionicons style={{top:10}} name={"add-circle-outline"} color={"#fff"} size={40}/>} left={() => <Image style={{width: 50, height: 60, opacity: 0.8, left: 5,top: 5}} source={{uri: item.image}}/>}/>
                </List.Section>
            </TouchableOpacity>
        );
    };
    const enqueue = async (item) => {
        await triggerAlert()
        await axios.put("http://" + api + `/group/enqueue`, {
            params: {
                groupID: group._id,
                song: {
                    name: item.name,
                    artist: item.artist,
                    uri: item.uri,
                    image: item.image
                }
            }
        })
    }
    const searchSong = async (token,text) => {

        await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            params: {
                q: text,
                type: "track",
                limit: 15
            }
        }).then(r=>{
            let trackList = []
           // console.log(r.data.tracks.items[0].album.images[0].url)
            for (let i = 0; i < r.data.tracks.items.length; i++) {
                const map = {
                    name: r.data.tracks.items[i].name,
                    artist: r.data.tracks.items[i].artists[0].name,
                    uri: r.data.tracks.items[i].uri,
                    image: r.data.tracks.items[i].album.images[0].url
                }
                trackList.push(map)
            }
            setTracks(trackList)
            console.log(trackList)
        }).catch(e=>console.log(e,"Errrr"))}
    function musicBox() {
        if(currSong){
            if(isPlaying){
                return(
                    <View>
                        <TouchableOpacity style={styles.musicBox} onPress={()=>navigation.navigate("ViewQueue",{group})}>

                            <View style={styles.row}>
                                <Image  source={{uri: image}}
                                        style={{width: 50, height: 60, opacity: 0.8, left: 5,top: 5}}/>
                                <View style={styles.textContainer}>
                                    <Text style={styles.text}>{songName}</Text>
                                    <Text style={styles.artistText}>{artists}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={()=>setIsPlaying(!isPlaying)}>
                                <Ionicons name={"pause-outline"}  color={"#fff"} size={35} style={styles.icon}/>
                            </TouchableOpacity>

                        </TouchableOpacity>
                        <ProgressBar progress={time && progress? progress/time: 0} width={width/2} height={5} color={"#fff"} style={styles.progress}/>
                    </View>)
            }
            else{
                return(
                    <TouchableOpacity  style={styles.musicBox} onPress={()=>navigation.navigate("ViewQueue",{group})}>

                        <View style={styles.row}>
                            <Image  source={{uri: image}}
                                    style={{width: 50, height: 60, opacity: 0.8, left: 5,top: 5}}/>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>{songName}</Text>
                                <Text style={styles.artistText}>{artists}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={()=>setIsPlaying(!isPlaying)}>
                            <Ionicons name={"play-outline"}  color={"#fff"} size={35} style={styles.icon}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )
            }
        }
        else {
            if(group.queue.length>0){
                const song =group.queue[0]
                return (
                    <TouchableOpacity  style={styles.musicBox} onPress={()=>navigation.navigate("ViewQueue",{group})}>
                        <View style={styles.row}>
                            <Image  source={{uri: song.image}}
                                    style={{width: 50, height: 60, opacity: 0.8, left: 5,top: 5}}/>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>{song.name}</Text>
                                <Text style={styles.artistText}>{song.artist}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={()=>setIsPlaying(!isPlaying)}>
                            <Ionicons name={"play-outline"}  color={"#fff"} size={35} style={styles.icon}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )
            }
            else{
                return(
                    <TouchableOpacity  style={styles.musicBox} onPress={()=>navigation.navigate("ViewQueue",{group})}>

                        <View style={styles.row}>
                            <Text style={styles.text2}>No song queued</Text>
                        </View>
                        <TouchableOpacity onPress={()=>setIsPlaying(!isPlaying)}>
                            <Ionicons name={"musical-notes-outline"}  color={"#9b9595"} size={35} style={styles.icon}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )
            }
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Add to queue</Text>
            <View style={styles.search} >
                <TextField placeholder={"Search a song to add to queue"} text={"Search"} onChange={searchSong} icon={"search-outline"} token={token}/>
            </View>
            <FlatList
                style={styles.flat}
                data={tracks}
                keyExtractor={item => item._id}
                renderItem={renderItem}/>
            {
                alert?
                    <View style={styles.alert}>
                        <Alert text={"Song added to queue"}/>
                    </View>
                    :null
            }

                {musicBox()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121b22',
        alignItems: 'center',
    },
    search: {
        marginTop: -20
    },

    musicBox: {
        backgroundColor: 'rgba(42,78,107,0.68)',
        width: "100%",
        height: 70,
        flexDirection: "row"
    },
    flat: {
        height: "93%",
        flexGrow: 0,
        width: "100%"
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
        marginLeft: 20,
        marginTop: 10
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
        left: 20
    },
    text2: {
        flexDirection: "row",
        width: '100%',
        left: 20,
        top: 20,
        color: "#9b9595",
        fontWeight: "bold",
        fontSize: 20,
        marginLeft: 20,
        fontStyle: "italic"
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
        width: '100%',
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },

})
