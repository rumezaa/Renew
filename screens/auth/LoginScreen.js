import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  Image,
  Platform,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../backend/config";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useState } from "react";
import { useEffect } from "react";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [pswd, setPswd] = useState("");

  async function Authenticate() {
    const storedEmail = await AsyncStorage.getItem("email")
    const storedPswd = await AsyncStorage.getItem("password")


    if (storedEmail && storedPswd){
      setEmail(storedEmail)
      setPswd(storedPswd)
      Login()
    } 
    
  }

  function Login(){
    signInWithEmailAndPassword(auth, email, pswd)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setEmail("")
        setPswd("")
        AsyncStorage.removeItem('email');
        AsyncStorage.removeItem('pswd');
        // ..
      });
  }

  const saveValueFunction = () => {
    if (email) {
      AsyncStorage.setItem('email', email);
    } 
  
    if (pswd) {
      AsyncStorage.setItem('password', pswd);
    }
  
    Login()
  };
  

  useEffect(() => {
    Authenticate()
  }, [email, pswd])
  
  
  

  const nav = useNavigation();

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''}>
        <ImageBackground
          className="flex flex-col w-full h-full justify-center items-center"
          source={require("../../assets/backgrounds/login.png")}
        >
        <Image source={require("../../assets/icons/logo.png")} className="absolute top-20" style={{width: 150, height:100}} />
          <View className="w-full flex flex-col gap-y-10 items-center justify-center pl-">
            <View className=" items-left">
              <Text className="text-xs uppercase text-white">email</Text>
              <TextInput
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "white",
                }}
                className="w-64 text-lg h-12 text-white"
                value={email}
                onChangeText={setEmail}
                placeholder="example@example.com"
              />
            </View>

            <View className="items-left">
              <Text className="text-xs uppercase text-white">password</Text>
              <TextInput
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "white",
                  color: "white",
                }}
                className="w-64 text-lg h-12"
                value={pswd}
                secureTextEntry={true}
                onChangeText={setPswd}
                placeholder="******"
              />
            </View>
          </View>

          <View className="w-full gap-2 flex flex-col items-center justify-center my-4 px-10">
            <TouchableOpacity onPress={saveValueFunction}>
              <View className="bg-white rounded-full py-2 w-56 flex items-center ">
                <Text className="text-lg text-tomato font-semibold uppercase">Login</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className={`absolute ${Platform.OS == "ios" && "top-48" || "top-64"}`}
              onPress={() => nav.navigate("Signup")}
            >
              <View className="flex flex-row gap-2">
                <Text className="text-sm">Don't have an Account? </Text>
                <Text className="text-sm font-bold text-tomato">Sign up</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
