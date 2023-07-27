import {View, StyleSheet, Text} from "react-native"
import LongBtn from "../components/LongBtn";
import * as React from "react";
import {useRef, useState} from "react";
import {makeRedirectUri, ResponseType, useAuthRequest} from "expo-auth-session";

export default function SpotifyAuth({navigation,route}){

    const [token, setToken] = useState()
    const tokenRef = useRef();
    const {user} = route.params
    const discovery = {
        authorizationEndpoint: 'https://accounts.spotify.com/authorize',
        tokenEndpoint: 'https://accounts.spotify.com/api/token',
    };
    const [request, response, promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.Token,
            clientId: 'clientId',
            scopes: ['user-read-email','user-read-private','user-top-read','user-read-email', 'streaming',"user-read-playback-state" ,'playlist-modify-public',"user-modify-playback-state","user-read-currently-playing"],
            // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
            // this must be set to false
            usePKCE: false,
            redirectUri: makeRedirectUri({
                scheme: 'your.app'
            }),
        },
        discovery
    );
    return(
        <View style={styles.container}>
            <LongBtn text="Log in to Spotify" click={() => {promptAsync().then(r => {
                console.log(r.authentication.accessToken, 'TOKEN')
                navigation.navigate("Home",{user: user, token: r.authentication.accessToken})
            }).catch(e=>console.log())}}/>
            <LongBtn text="Continue without Spotify" click={()=>{
                navigation.navigate("Home",{token: null,user: user})
            }}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: '#121b22',
        height: "100%",
        justifyContent: "center"
    }
})
