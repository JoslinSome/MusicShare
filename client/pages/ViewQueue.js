import {Text, View, StyleSheet} from "react-native";
import axios from "axios";
import {api} from "../config/Api";
import {useEffect, useState} from "react";

export default function ViewQueue(navigation,route) {
    console.log(route.params,"asdasds")
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
    return(
        <View style={styles.container}>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: 'rgba(42,78,107,0.68)',
    }
})
