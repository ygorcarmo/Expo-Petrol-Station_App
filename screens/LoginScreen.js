import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth } from '../firebase'

const LoginScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged( user => {
            if(user){
                navigation.navigate("Home")
            }
        })

        return unsubscribe
    }, [])

    const handleSignUp = () => {
        auth
            .createUserWithEmailAndPassword(email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                alert("User Created Successfuly");
                console.log(user.email); 
            })
            .catch((err) => alert(err.message)); 
    }

    const handleLogin = () => {
        auth
        .signInWithEmailAndPassword(email, password)
        .then((userCredentials) => {
            const user = userCredentials.user;
            // alert("Login Successfuly");
            console.log('Logged in with:', user.email); 
        })
        .catch((err) => alert(err.message)); 
    }

    return (
        <KeyboardAvoidingView 
        style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.labelText} >Email</Text>
                <TextInput
                    placeholder='Email' 
                    value={email}
                    onChangeText={text => setEmail(text)}     
                    style={styles.input}
                />
                <Text style={styles.labelText} >Password</Text>
                <TextInput
                    placeholder="Password"  
                    value={password}
                    onChangeText={text => setPassword(text)}                     
                    style={styles.input}
                    secureTextEntry                     
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    onPress={handleLogin}
                    style={styles.button}>                    
                        <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    onPress={handleSignUp}
                    style={[styles.button, styles.buttonOutline ]}>
                        <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    input: {
        margin: 5,
        borderWidth: 1,
        padding: 10,
        borderRadius:10,
      },
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    inputContainer:{
        width:'80%'
    },
    buttonContainer:{
        width:'60%',
        justifyContent:'center',
        alignItems:'center',
        marginTop: 40
    },
    button:{ 
        backgroundColor:'#0782F9',
        width:'100%',
        padding: 15, 
        borderRadius:10,
        alignItems:'center',
    },
    buttonOutline:{
        backgroundColor:'#fff',
        marginTop:5,
        borderColor:'#0782F9',
        borderWidth:2
    },
    buttonText:{
        color:'#fff',
        fontSize:20,
        fontWeight:'bold'
    },
    buttonOutlineText:{
        color:'#0782F9',
        fontSize:20,
        fontWeight:'bold'
    },
    labelText:{
        color:'black',
        fontSize:20,
        fontWeight:'bold'
    }
})
