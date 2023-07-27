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
import BackgroundTimer from 'react-native-background-timer';

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


export default function HomePage({route, navigation}) {

    const [cookies,setCookies] = useCookies(['access-token',"username"])
    const [group, setGroup] = useState({})
    const [text, setText] = useState("")
    const [tracks, setTracks] = useState({})
    const [alert, setAlert] = useState(false)
    const [noSpotify, setNoSpotify] = useState(false)
    const [topTracks, setTopTracks] = useState()
    const [showSettings, setShowSettings] = useState(false)
    const topTracksRef = useRef();
    const recommendedRef =useRef()
    const currSong = useRef(true)
    const image = useRef(null);
    const isPlaying = useRef(false);
    const songName = useRef("");
    const time = useRef();
    const [progress,setProgress] = useState();
    const [notifications, setNotifications] = useState()
    const artists = useRef("");
    const newSong = useRef(true);
    const {user,token} = route.params
    const [times, setTimes] = useState(new Date());
    const progressRef = useRef();
    const userRef = useRef();
    const groupsRef = useRef();
    const tokenRef = useRef(token);
    const noSpotifyRef = useRef(noSpotify);
    const once = useRef(true);
    async function getGroup(){
        await axios.get("http://" + api + `/auth/get-user-by-name`,{
            params: {
                username: cookies.username
            }
        }).then(async r => {
            userRef.current = r.data.user[0]
            setShowSettings(true)
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
        }).catch(e=>console.log(e,"At requests"))
    }
    const getRecommended = async (token) => {
        await axios.get("https://api.spotify.com/v1/recommendations", {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            params: {
                market: "ES",
                limit: 10,
                seed_tracks: topTracksRef.current[0].id+","+topTracksRef.current[1].id+","+topTracksRef.current[2].id+","+topTracksRef.current[3].id+","+topTracksRef.current[4].id
            }
        }).then(r=> {
            once.current = false
            recommendedRef.current = r.data.tracks
        }).catch(e=>console.log(e,"recommended error"))
    }
    const getTopTracks = async () =>{
        await axios.get("https://api.spotify.com/v1/me/top/tracks", {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }).then(r=>{
            topTracksRef.current = r.data.items
        })
    }
    getTopTracks().then(r => once.current? getRecommended(token).then(r=>console.log("EEadasdadsaE")).catch(e=>console.log(e,noSpotifyRef.current)): null).catch(e=>console.log(e,"Top Tracks Error"))
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
            console.log()
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
    const renderItem2 = ({item}) => {
        const song = {
            name: item.name,
            image: item.album.images[0].url,
            artist: item.artists[0].name,
            uri: item.uri
        }
        return (
            <TouchableOpacity style={styles.list2} onPress={()=>enqueue(song)}>
                <Image source={{uri: item.album.images[0].url}} style={{width: '100%', height: '100%', opacity: 0.8}}/>
                <Text style={styles.text}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        //console.log("THER",newSong.current)

        BackgroundTimer.runBackgroundTimer(() => {
//code that will be called every 3 seconds
            console.log("HI")
            },
            3000);
//rest of code will be performing for iOS on background too

        BackgroundTimer.stopBackgroundTimer(); //after this call all code on background stop run.

    }, []);

    const enqueue = async (item) => {
        await triggerAlert()
        addToMongoQueue(item).then(r=>null).catch(e=>console.log(e,"Mongo queue error"))
       // await addToPlaybackQueue(token,item)
    }

    async function addToMongoQueue(item){
        await axios.put("http://" + api + `/group/enqueue`,{
            params: {
                song: item,
                groupID: groupsRef.current._id
            }
        }).then(r=>console.log(r.data,"<DDAADA")).catch(e=>console.log(e,"<Mongo adding> error"))
    }
    async function dequeue(){
        await axios.put("http://" + api + `/group/dequeue`,{
            params: {
                groupID: groupsRef.current._id
            }
        }).then(r=>console.log(r.data.name,"Deleted")).catch(e=>console.log(e,"Dequeue error"))
    }
    const addToPlaybackQueue = async (token) => {

        for (let i = 0; i < groupsRef.current.queue.length; i++) {
            let item = groupsRef.current.queue[i]
            if(item.uri) {
                const url = `https://api.spotify.com/v1/me/player/queue?uri=${item.uri}`

                await axios.post(url, null, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    }
                ).then(r => {

                    console.log(item.name, " QUEUED", groupsRef.current.owner)
                    dequeue().then(r => null).catch(e=>console.log(e,"Problem dequeueing"))
                }).catch(e => console.log(e, "Song not queued"))

            }
            else{
                await axios.get("https://api.spotify.com/v1/search", {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    params: {
                        q: item.name,
                        type: "track",
                        limit: 1
                    }
                })
                .then(async r => {
                    const uri = r.data.tracks.items[i].uri
                    const url = `https://api.spotify.com/v1/me/player/queue?uri=${uri}`

                    await axios.post(url, null, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            }
                        }
                    ).then(r => {

                        console.log(item.name, " QUEUED")
                        dequeue().then(r => null)
                    }).catch(e => console.log(e, "Song not queued"))
                }).catch(e=>console.log(e,"Search error"))
            }

        }
    }
    const searchSong = async (token,text) => {
        setText(text)
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


    function musicBox() {
        if(!token){
            return (
                <TouchableOpacity style={styles.musicBox} onPress={()=>null}>

                    <View style={styles.row}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}></Text>
                            <Text style={styles.artistText2}>Connect to spotify premium for more</Text>
                        </View>
                    </View>

                </TouchableOpacity>
            )
        }
            if(isPlaying.current){
                return(
                    <View>
                        <TouchableOpacity style={styles.musicBox} onPress={()=>null}>

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


        else {
            return(
                <TouchableOpacity  style={styles.musicBox} onPress={()=>null}>

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

        return(
                <View style={styles.container}>
                    <View style={styles.row2}>
                        <Text style={styles.title}>Add to queue</Text>
                        {
                            groupsRef.current && userRef.current && notifications?
                                <View style={styles.iconBtn}>
                                    <IconButton onPress={()=>navigation.navigate('ViewGroup',{notifications, group: groupsRef.current,user:userRef.current})} notifications={true} value={notifications? notifications.length :0} icon={'settings-outline'} noBorder={true} color={"#fff"}/>
                                </View>:
                                <View style={styles.iconBtn}>
                                    <IconButton onPress={()=>null} notifications={true} value={notifications? notifications.length :0} icon={'settings-outline'} noBorder={true} color={"#fff"}/>
                                </View>

                        }

                    </View>
                    <View style={styles.search2} >
                        <TextField placeholder={"Type a song name to add to queue"} text={"Search"} onChange={setText} icon={"search-outline"} token={token}/>
                    </View>
                    <View style={styles.noSpotifyBtn}>
                        <LongBtn text={"Add to queue"} propWidth={true} click={()=>enqueue({name: text})}/>
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
            )
    }
    else{
        return (
            <View style={styles.container}>
                <View style={styles.row2}>
                    <Text style={styles.title}>Add to queue</Text>
                    {
                        groupsRef.current && userRef.current && notifications?
                            <View style={styles.iconBtn}>
                                <IconButton onPress={()=>navigation.navigate('ViewGroup',{notifications, group: groupsRef.current,user:userRef.current})} notifications={true} value={notifications? notifications.length :0} icon={'settings-outline'} noBorder={true} color={"#fff"}/>
                            </View>:
                            <View style={styles.iconBtn}>
                                <IconButton onPress={()=>null} notifications={true} value={notifications? notifications.length :0} icon={'settings-outline'} noBorder={true} color={"#fff"}/>
                            </View>

                    }
                    <View style={styles.iconBtn}>
                        <IconButton icon={'settings-outline'} noBorder={true} color={"white"}/>
                    </View>
                </View>
                <View style={styles.search} >
                    <TextField placeholder={"Search a song to add to queue"} text={"Search"} onChange={searchSong} icon={"search-outline"} token={token}/>
                </View>
                {
                    text.length>0?
                        <FlatList
                            style={styles.flat}
                            data={tracks}
                            keyExtractor={item => item.uri}
                            renderItem={renderItem}/>
                        :<>
                            <Text style={styles.text3}>Your Faves!</Text>
                            <FlatList
                                style={styles.flat2}
                                data={topTracksRef.current}
                                keyExtractor={item => item.uri}
                                renderItem={renderItem2}
                                horizontal={true}/>
                            <Text style={styles.text3}>Reccomendations</Text>
                            <FlatList
                                style={styles.flat2}
                                data={recommendedRef.current}
                                keyExtractor={item => item.uri}
                                renderItem={renderItem2}
                                horizontal={true}/>
                        </>

                }

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
        left: 160,
        paddingLeft: 15
},
    list2: {
        width: 140,
        height: 140,
        marginLeft: 15,
        backgroundColor: "#fff"
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
    search2: {
        marginTop: 0
    },
    musicBox: {
        backgroundColor: 'rgba(42,78,107,0.46)',
        width: "100%",
        height: 120,
        flexDirection: "row"
    },
    noSpotifyBtn: {
        top: 30
    },
    flat: {
        height: "93%",
        flexGrow: 0,
        width: "100%"
    },
    flat2: {
        height: "93%",
        flexGrow: 0,
        width: "100%",
        marginTop: 20
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
    text3: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        alignSelf: "flex-start",
        marginTop: 10,
        fontStyle: "italic",
        left: 15
    },
    artistText: {
        color: "#9b9595",
        fontWeight: "bold",
        fontSize: 16,
        marginLeft: 20,
        fontStyle: "italic"
    },
    artistText2: {
        color: "#9b9595",
        fontWeight: "bold",
        fontSize: 16,
        marginLeft: 20,
        fontStyle: "italic",
        marginTop: -13
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
