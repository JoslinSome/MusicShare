import {StatusBar} from 'expo-status-bar';
import {Button, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as AuthSession from 'expo-auth-session';
import axios from 'axios'
import * as React from "react";
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, ResponseType, useAuthRequest } from 'expo-auth-session';
import logo from "../assets/logo.png"
import logoWhite from "../assets/logo-white.png"
import longBtn from "../components/LongBtn";
import LongBtn from "../components/LongBtn";
import ProgressBar from 'react-native-progress/Bar';

// Endpoint

export default function Auth({navigation}) {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to</Text>
            <Image source={logoWhite} style={styles.logo}/>
            <View style={styles.btns}>
                <LongBtn text={"Sign In"} navigation={navigation} to={"SignIn"}/>
                <LongBtn text={"Create an account"} navigation={navigation} to={"SignUp"}/>
            </View>
        </View>
    );
}
// <Button
//     disabled={!request}
//     title="Login"
//     onPress={() => {
//         promptAsync().then(r => console.log(r));
//     }}
// />
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(114,13,227)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {

    },
    title: {
        fontSize: 30,
        color: "#c6bce0",
        fontWeight: "bold",
        marginBottom: -30
    },
    btns: {
        marginTop: -20
    }
});
