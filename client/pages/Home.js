import {View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image} from "react-native"
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
import ProgressBar from 'react-native-progress/Bar';

import TextField from "../components/TextField";
import Alert from "../components/Alert";
WebBrowser.maybeCompleteAuthSession();

const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
};
export default function HomePage({route, navigation}) {

    const [cookies,setCookies] = useCookies(['access-token',"username"])
    const [group, setGroup] = useState({})
    const [token, setToken] = useState(null)
    const [text, setText] = useState("")
    const [tracks, setTracks] = useState({})
    const [alert, setAlert] = useState(false)
    const currSong = useRef(true)
    const image = useRef(null);
    const isPlaying = useRef(false);
    const songName = useRef("");
    const time = useRef();
    const [progress,setProgress] = useState();
    const [notifications, setNotifications] = useState()
    const artists = useRef("");
    const newSong = useRef(true);
    const {user} = route.params
    const [times, setTimes] = useState(new Date());
    const progressRef = useRef();
    const userRef = useRef();
    const groupsRef = useRef();

    getGroup().then(r => console.log("group got"))
    async function getGroup(){
        await axios.get("http://" + api + `/auth/get-user-by-name`,{
            params: {
                username: cookies.username
            }
        }).then(async r => {
            userRef.current = r.data.user[0]
            await axios.get("http://" + api + `/group/get-group`, {
                params: {
                    groupID: userRef.current.group
                }
            }).then(r=>{
                groupsRef.current = r.data
            }).catch(e=>console.log(""))
        }).catch(e=>console.log(""))

    }
    async function getRequests() {
        await axios.get("http://" + api + `/request/get-user-requests`,{
            params: {
                username: cookies.username
            }
        }).then(r => {
            setNotifications(r.data)
        })
    }
    const getRecommended = async (token) => {
        await axios.get("https://api.spotify.com/v1/recommendations", {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            params: {
                market: "ES",
                limit: 10,
                seed_genre: "classical,country"
            }
        }).then(r=> {
            console.log(r.data,"DATAAA")
        })
    }
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
            newSong.current =false
            progressRef.current=r.data.progress_ms
            setProgress(r.data.progress_ms)
            currSong.current= r.data.item
            image.current = r.data.item.album.images[0].url
            isPlaying.current = r.data.is_playing
            songName.current =r.data.item.name
            time.current=r.data.item.duration_ms
            let singers = ""
            for (let i = 0; i < r.data.item.artists.length; i++) {
                singers+= r.data.item.artists[i].name
                if(i<r.data.item.artists.length-1){
                    singers+=", "
                }
            }
            artists.current = singers
            return r.data.item.album.images[0]

        }).catch( err => {
            console.log(err, "Sdfsf")
        })
    }
    function changePlayingState(){
        isPlaying.current = !isPlaying.current
    }
    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }
    async function triggerAlert() {
        setAlert(true)
        await timeout(1000);
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

    useEffect(() => {

        //console.log("THER",newSong.current)
        if(newSong.current){

            getCurrentSong(token).then(r=>{
                console.log("")
            }).catch(e=>console.log("bad",e,token))
        }
        const interval = setInterval(() => {
            getCurrentSong(token).then(r=>{
                console.log("")
            }).catch(e=>console.log("bad",e,token))
            getRequests().then(r => console.log("done"))
            getRecommended(token).then(r=>console.log("EEasdasdasdsaE")).catch(e=>console.log(e,"ERRROOOOR"))



        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const enqueue = async (item) => {
        await triggerAlert()
        await addToPlaybackQueue(token,item.uri)
    }
    const addToPlaybackQueue = async (token,uri) => {
        const url = `https://api.spotify.com/v1/me/player/queue?uri=${uri}`

        await axios.post(url, null,{
            headers: {
                'Authorization': `Bearer ${token}`,
            }}).then(r=>console.log("SONG QUEUED")).catch(e=>console.log(e,"Song not queued"))
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
        }).catch(e=>console.log(e,"Errr"))}
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
    function musicBox() {
        if(currSong.current){
            if(isPlaying.current){
                return(
                    <View>
                        <TouchableOpacity style={styles.musicBox} onPress={()=>navigation.navigate("ViewQueue",{token})}>

                            <View style={styles.row}>
                                <Image  source={{uri: image.current}}
                                        style={{width: 50, height: 60, opacity: 0.8, left: 5,top: 5}}/>
                                <View style={styles.textContainer}>
                                    <Text style={styles.text}>{songName.current}</Text>
                                    <Text style={styles.artistText}>{artists.current}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={()=>changePlayingState()}>
                                <Ionicons name={"pause-outline"}  color={"#fff"} size={35} style={styles.icon}/>
                            </TouchableOpacity>

                        </TouchableOpacity>
                        <ProgressBar progress={time.current && progressRef.current? progressRef.current/time.current: 0} width={width/2} height={5} color={"#fff"} style={styles.progress}/>
                    </View>)
            }
            else{

                return(
                    <TouchableOpacity  style={styles.musicBox} onPress={()=>navigation.navigate("ViewQueue",{token})}>

                        <View style={styles.row}>
                            <Image  source={{uri: image.current}}
                                    style={{width: 50, height: 60, opacity: 0.8, left: 5,top: 5}}/>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>{songName.current}</Text>
                                <Text style={styles.artistText}>{artists.current}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={()=>changePlayingState()}>
                            <Ionicons name={"play-outline"}  color={"#fff"} size={35} style={styles.icon}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )
            }
        }
        else {
            return(
                <TouchableOpacity  style={styles.musicBox} onPress={()=>navigation.navigate("ViewQueue",{token})}>

                    <View style={styles.row}>
                        <Text style={styles.text2}>No song queued</Text>
                    </View>
                    <TouchableOpacity onPress={()=>changePlayingState()}>
                        <Ionicons name={"musical-notes-outline"}  color={"#9b9595"} size={35} style={styles.icon}/>
                    </TouchableOpacity>
                </TouchableOpacity>
            )
        }
    }

    if(!token){
        return (
            <View style={styles.container2}>
                <LongBtn text="Log in to Spotify" click={() => {promptAsync().then(r => {
                    setToken(r.authentication.accessToken)
                }).catch(e=>console.log())}}/>
                <LongBtn text="Continue without Spotify"/>
            </View>
        )}
    else{
        return (
            <View style={styles.container}>
                <View style={styles.row2}>
                    <Text style={styles.title}>Add to queue</Text>
                    <View style={styles.iconBtn}>
                        <IconButton onPress={()=>navigation.navigate('ViewGroup',{notifications, group: groupsRef.current,user:user})} notifications={true} value={notifications? notifications.length :0} icon={'notifications-outline'} noBorder={true} color={"#fff"}/>
                    </View>
                    <View style={styles.iconBtn}>
                        <IconButton icon={'settings-outline'} noBorder={true} color={"white"}/>
                    </View>
                </View>
                <View style={styles.search} >
                    <TextField placeholder={"Search a song to add to queue"} text={"Search"} onChange={searchSong} icon={"search-outline"} token={token}/>
                </View>

                <FlatList
                    style={styles.flat}
                    data={tracks}
                    keyExtractor={item => item.uri}
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
        )}
}


const styles = StyleSheet.create({
    container2: {
        alignItems: "center",
        backgroundColor: '#121b22',
        height: "100%",
        justifyContent: "center"
    },
    iconBtn: {
        marginTop: 20,
        left: 100,
        paddingLeft: 15
},
    btn: {
        bottom: 80,
        alignSelf: "flex-end",
        right: 20,
        position: "absolute"
    },
    container: {
        flex: 1,
        backgroundColor: '#121b22',
        alignItems: 'center',
    },
    search: {
        marginTop: -20
    },

    musicBox: {
        backgroundColor: 'rgba(42,78,107,0.46)',
        width: "100%",
        height: 120,
        flexDirection: "row"
    },
    flat: {
        height: "93%",
        flexGrow: 0,
        width: "100%"
    },
    progress: {
        left: 16,
        bottom: 50
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
        fontSize: 20,
        left: 20
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
    row2: {
        flexDirection: "row",
        width: '100%',
        marginBottom: 5,
        marginTop: 10
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


});
