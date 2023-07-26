import {View, StyleSheet, Text, Image, TouchableOpacity, FlatList, AppRegistry} from "react-native";
import LongBtn from "../components/LongBtn";
import {makeRedirectUri, ResponseType, useAuthRequest} from "expo-auth-session";
import {useEffect, useRef, useState} from 'react';
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
import * as querystring from "querystring";
import {useCookies} from "react-cookie";

export default function ViewGroup({navigation,route}){
    const {notifications, group,user} = route.params
    const [requests, setRequests] = useState(notifications)
    const [cookies,setCookies] = useCookies(['access-token',"username"])
    const [members, setMembers] = useState([])
    const [alertText, setAlertText] = useState("")
    const [userObj, setUserObj] = useState(user)
    const [groupObj, setGroupObj] = useState({});
    const [alert, setAlert] = useState(false)
    const once = useRef();
    const onceID = useRef(true);
    const groupRef = useRef(groupObj);
    const userRef = useRef(user);
    once.current = true
    //console.log(route.params,"GROOOUP")
    if(onceID.current){
        getGroup().then(r=>SetGroupMembers().then(r => null))
        onceID.current = false
    }

    async function SetGroupMembers() {

        await axios.get("http://" + api + `/group/get-group-members`, {
            params: {
                groupID: groupRef.current._id
            }
        }).then(r=>{
            console.log("MEEEMERS",r.data)
                setMembers(r.data)
        })
    }
    async function getGroup() {
        await axios.get("http://" + api + `/group/get-group`, {
            params: {
                groupID: userRef.current.group
            }
        }).then(r=>{
            setGroupObj(r.data)
            groupRef.current = r.data

        })
    }
    async function getRequests() {
        await axios.get("http://" + api + `/request/get-user-requests`,{
            params: {
                username: cookies.username
            }
        }).then(r => {
            setRequests(r.data)
        })
    }

    function refresh(){
        getUserById().then(r => getGroup().then(r=>SetGroupMembers().then(r => null)))
        getRequests().then(r => null)

    }
    async function getUserById() {
        await axios.get("http://" + api + `/auth/get-user-by-id`,{
            params: {
                id: user._id
            }
        }).then(r => {
                setUserObj(r.data)
                userRef.current=r.data

        })
    }
    async function joinInitialGroup(){
        await axios.put("http://" + api + `/request/join-initial-group`,{
            params: {
                username: cookies.username
            }
        }).then(r => {
            setAlertText("Group joined")
            refresh()
            triggerAlert()
        }).catch(e=> console.log("Successfully joined"))
    }
    async function acceptRequest(sender) {
        await axios.put("http://" + api + `/request/accept-request`,{
            params: {
                sender: sender,
                username: cookies.username
            }
        }).then(r => {
            setAlertText("Group joined")
            refresh()
            triggerAlert()
        }).catch(e=> console.log("error rejceting request"))
    }
    async function rejectRequest(sender) {
        await axios.put("http://" + api + `/request/refuse-request`,{
            params: {
                sender: sender,
                username: cookies.username
            }
        }).then(r => {
            refresh()
            setAlertText("Request refused")
            triggerAlert()
        }).catch(e=> console.log("error rejceting request"))
    }
    function renderData({item}){

        return(
            <View style={styles.circle}>
                <Text>{groupObj.owner}</Text>
            </View>
        )
    }
    function renderData2({item}){
        return(
            <View style={styles.circle}>
                <Text>{item.firstname || "S"}</Text>
            </View>
        )
    }
    async function triggerAlert() {
        setAlert(true)
        await timeout(1000);
        setAlert(false)
    }
    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }
    function renderNotificationData({item}){
        return (
            <TouchableOpacity style={styles.vList}>
                <View style={styles.row}>
                    <View style={styles.circle}>
                        <Text>{item.val}</Text>
                    </View>
                <View>
                    <Text style={styles.text}>{item.sender} invited you</Text>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.btn} onPress={()=>acceptRequest(item.sender)}>
                            <Text style={styles.text2} >Join</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn2} onPress={()=>rejectRequest(item.sender)}>
                            <Text style={styles.text2} >Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                </View>

            </TouchableOpacity>
        )
    }
    return(
        <View style={styles.container}>
            <View style={styles.owner}>
                <Text style={styles.text}>Group Owner</Text>
                <FlatList
                    style={styles.list}
                    horizontal={true}
                    data={[groupObj]}
                    renderItem={renderData}
                    keyExtractor={(item) => item._id}
                />
            </View>
            <View style={styles.members}>
                <Text style={styles.text}>Group members</Text>
                <FlatList
                    horizontal={true}
                    data={members}
                    renderItem={renderData2}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <View style={styles.notifs}>
                <Text style={styles.text}>Invitations</Text>
                {
                    userObj.initialGroup !== userObj.group?
                        <TouchableOpacity style={styles.vList}>
                            <View style={styles.row}>
                                <View style={styles.circle}>
                                    <Text>{userObj.firstname}</Text>
                                </View>
                                <View>
                                    <Text style={styles.text}>Re-join your group?</Text>
                                    <View style={styles.row}>
                                        <TouchableOpacity style={styles.btn} onPress={()=>joinInitialGroup()}>
                                            <Text style={styles.text2}>Join</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>

                            </View>

                        </TouchableOpacity>
                        :null

                }
                <FlatList
                    data={requests}
                    renderItem={renderNotificationData}
                    keyExtractor={(item) => item.id}
                />
            </View>
            {
                alert?
                    <View style={styles.alert}>
                        <Alert text={alertText}/>
                    </View>
                    :null
            }

        </View>
    )
}

const styles = StyleSheet.create({
    vList: {
        marginBottom: 30
    },
    container: {
        flex: 1,
        backgroundColor: '#121b22',
        alignItems: 'center',
    },
    search: {
        marginTop: -20
    },
    notifs: {
        width: "100%",
        height: '55%'
    },
    btn: {
        backgroundColor: "#184bbe",
        alignItems: "center",
        width: 80,
        height: 30,
        justifyContent: "center",
        marginLeft: 12,
        borderRadius: 5
    },
    btn2: {
        backgroundColor: "#be1844",
        alignItems: "center",
        width: 80,
        height: 30,
        justifyContent: "center",
        marginLeft: 12,
        borderRadius: 5
    },
    musicBox: {
        backgroundColor: 'rgba(42,78,107,0.68)',
        width: "100%",
        height: 70,
        flexDirection: "row"
    },
    owner: {
        height: "22%",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "white",
        width: "100%"
    },
    members: {
        height: "22%",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "white",
        width: '100%'
    },
    flat: {
        height: "93%",
        flexGrow: 0,
        width: "100%"
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: "#fff",
        margin: 8,
        justifyContent: "center",
        alignItems: "center"
    },
    progress: {
        left: 16
    },
    alert: {
        width: '97%',
        bottom: 60
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
        marginTop: 10,
        right: -10,
        marginBottom:20
    },
    text2: {
        color: "white",
        fontWeight: "bold",
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
        width: '70%',
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },

})
