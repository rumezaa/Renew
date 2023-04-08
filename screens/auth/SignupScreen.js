import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  ImageBackground,
  Image,
  Platform,
} from "react-native";
import { auth } from "../../backend/config";
import { addUser } from "../../backend/utilities";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import ErrorPopup from "../../components/utility-components/ErrorPopup";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignupScreen = () => {
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [pswd, setPswd] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);
  const nav = useNavigation();

  function checkFields() {
    return (
      email?.length > 0 &&
      name?.length > 0 &&
      location?.length > 0 &&
      description?.length > 0 &&
      type?.length > 0 &&
      pswd?.length > 0
    );
  }

  function signUp() {
    if (checkFields()) {
      createUserWithEmailAndPassword(auth, email, pswd)
        .then(() => {
          if (type == "bs") {
            const data = {
              type: type,
              name: name,
              email: email,
              location: location,
              desc: description,
              posts: [],
              calendar: [],
              messages: [{messageId: "welcome",
              recieverId: "IQCvmQTcB4fj0FTDYusqPGo4rbe2",
              recieverProfile: "https://firebasestorage.googleapis.com/v0/b/reniew-5a418.appspot.com/o/users%2F41C8468C-C1BF-4AD3-AF1D-7BA03A88287F.png?alt=media&token=98b56e0a-5ca2-4354-8564-8aeb5cebeee1",
              reciever: "Renew",
              latestMessage: {
                date: new Date(),
                content: "Welcome!",
                isRead: false,
                sender: "IQCvmQTcB4fj0FTDYusqPGo4rbe2",
              },}],
              number: "",
              profilePic: "",
            };
            addUser(data);
          } else if (type == "np") {
            const data = {
              type: type,
              name: name,
              email: email,
              location: location,
              desc: description,
              calendar: [],
              messages: [{messageId: "welcome",
                recieverId: "IQCvmQTcB4fj0FTDYusqPGo4rbe2",
                recieverProfile: "https://firebasestorage.googleapis.com/v0/b/reniew-5a418.appspot.com/o/users%2F41C8468C-C1BF-4AD3-AF1D-7BA03A88287F.png?alt=media&token=98b56e0a-5ca2-4354-8564-8aeb5cebeee1",
                reciever: "Renew",
                latestMessage: {
                  date: new Date(),
                  content: "Welcome!",
                  isRead: false,
                  sender: "IQCvmQTcB4fj0FTDYusqPGo4rbe2",
                },}],
              orders: [],
              number: "",
              profilePic: "",
            };
            addUser(data);
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
          // ..
        });
    } else {
      setError(true);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView>
        <ImageBackground
          source={require("../../assets/backgrounds/signup.png")}
          className="w-full h-full"
        >
          
          <ErrorPopup
            error={error}
            setError={setError}
            errorText={
              "Please ensure you've filled/selected all fields and your password exceeds 6 characters"
            }
          />
          <View className="w-full h-full flex items-end justify-end">
          <View className="flex flex-col items-center justify-center mt-4 mb-12">

         
            <View className="flex flex-row-reverse w-full items-center justify-center  gap-2 ml-1">
              <TouchableOpacity
                onPress={() => setPage(page + 1)}
                className={`${
                  (page !== 3 && "flex flex-row gap-x-2 items-center") ||
                  "hidden"
                }`}
              >
                {page == 1 && (
                  <Text
                    className="text-xl uppercase text-white"
                    style={{ fontWeight: 400 }}
                  >
                    Next{" "}
                  </Text>
                )}
                <AntDesign name="arrowright" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setPage(page - 1)}
                className={`${
                  (page !== 1 &&
                    "flex flex-row-reverse gap-x-2 items-center mt-1") ||
                  "hidden"
                }`}
              >
                {page == 3 && (
                  <Text className="text-xl uppercase text-white">Back </Text>
                )}
                <AntDesign name="arrowleft" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View className="flex w-full items-center justify-center absolute -bottom-7 -right-2">
            <TouchableOpacity
                onPress={() => nav.navigate("Login")}
              >
                <Text className="text-center text-white">Back to login  </Text>
              </TouchableOpacity>
            </View>
            </View>
            
            <View
              className="bg-white h-3/5 w-full flex items-center justify-between p-5"
              style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
            >
              <View
                className={`${(page == 1 && "block w-full ml-4") || "hidden"}`}
              >
                <View className="flex flex-col gap-y-3 w-full flex items-center justify-center mb-12">
                  <Text className="text-4xl font-bold">Welcome!</Text>
                  <Text className="text-center" style={{ fontWeight: 400 }}>
                    {" "}
                    lets get you registered with our platform.{" "}
                  </Text>
                </View>

                <View className="flex flex-col w-full h-full gap-4 items-center">
                  <Text className="text-lg text-center font-semibold text-cherry">
                    Which category best describes your company?
                  </Text>

                  <View className="flex flex-col w-full h-full items-center w-full gap-6 mr-4">
                    <TouchableOpacity
                      onPress={() => setType("np")}
                      className="w-full flex items-center"
                    >
                      <View
                        className={`${
                          type == "np" && "bg-tomato"
                        } rounded-lg w-1/2 p-3`}
                        style={{
                          borderWidth: 1.5,
                          borderColor: "#ED6E65",
                          borderStyle: "solid",
                        }}
                      >
                        <Text
                          className={`${
                            (type == "np" && "text-white") || "text-tomato"
                          } uppercase text-lg font-semibold text-center`}
                        >
                          Non-profit
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setType("bs")}
                      className="w-full flex items-center"
                    >
                      <View
                        className={`${
                          type == "bs" && "bg-tomato"
                        } rounded-lg w-1/2 p-3`}
                        style={{
                          borderWidth: 1.5,
                          borderColor: "#ED6E65",
                          borderStyle: "solid",
                        }}
                      >
                        <Text
                          className={`${
                            (type == "bs" && "text-white") || "text-tomato"
                          } text-center uppercase text-lg font-semibold`}
                        >
                          Business
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View
                className={`${
                  (page == 2 && "flex w-full h-full justify-end pt-10") ||
                  "hidden"
                }`}
              >
                <Text className="text-cherry font-semibold text-center text-lg my-4">
                  help us understand who you are
                </Text>
                <View className="flex flex-col w-full h-full px-6 gap-4">
                  <View className="w-full items-left">
                    <Text className="text-xs uppercase">company name</Text>
                    <TextInput
                      className="w-full text-lg h-12 border-b"
                      value={name}
                      onChangeText={setName}
                      placeholder="Example.co"
                    />
                  </View>
                  <View className="w-full items-left">
                    <Text className="text-xs  uppercase">location</Text>
                    <TextInput
                      className="w-full text-lg h-12 border-b"
                      value={location}
                      onChangeText={setLocation}
                      placeholder="1234 5th ave"
                    />
                  </View>

                  <View className="w-full flex items-left">
                    <Text className="text-xs uppercase">who you are</Text>
                    <TextInput
                      editable
                      multiline
                      numberOfLines={4}
                      maxLength={100}
                      onChangeText={setDescription}
                      value={description}
                      placeholder="more about your company"
                      className="w-full text-lg rounded h-40 border "
                    />
                  </View>
                </View>
              </View>
              <View
                className={`${
                  (page == 3 && "flex w-full h-full justify-center") || "hidden"
                }`}
              >
                <View>
                  <View
                    className={
                      "flex flex-col gap-8 items-center justify-center px-10"
                    }
                  >
                    <View className="w-full items-left">
                      <Text className="text-xs fon-light uppercase">email</Text>
                      <TextInput
                        className="w-full border-b text-lg h-12"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="example@example.com"
                      />
                    </View>
                    <View className="w-full items-left">
                      <Text className="text-xs fon-light uppercase">
                        password
                      </Text>
                      <TextInput
                        className="w-full border-b text-lg h-12"
                        value={pswd}
                        onChangeText={setPswd}
                        placeholder="*****"
                        secureTextEntry={true}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={signUp}
                    className="w-full px-6 mt-10"
                  >
                    <View className="rounded-full bg-black p-4">
                      <Text className="text-xl uppercase font-bold text-white text-center">
                        Join Renew
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

//signUp({name, location, description, email, pswd, type})

export default SignupScreen;
