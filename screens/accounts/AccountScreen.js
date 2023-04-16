import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { useContext, useState } from "react";
import { UserContext } from "../../components/contexts/UserProvider";
import { auth, db } from "../../backend/config";
import { updateEmail } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { SimpleLineIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { TouchableWithoutFeedback } from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native";
import { Keyboard } from "react-native";
import { uploadImages } from "../../backend/utilities";
import { LoadingIndicator } from 'react-native-expo-fancy-alerts';
import { useNavigation } from "@react-navigation/native";
import ErrorPopup from "../../components/utility-components/ErrorPopup";

export default function AccountScreen() {
  const [user] = useContext(UserContext);

  const created = new Date(auth.currentUser?.metadata.creationTime);
  const joined = created.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  const [profileImg, setProfileImg] = useState(user?.profilePic);
  const [email, setEmail] = useState(user?.email);
  const [number, setNumber] = useState(user?.number);
  const [desc, setDesc] = useState(user?.desc);
  const [name, setName] = useState(user?.name);
  const [location, setLocation] = useState(user?.location);
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const nav = useNavigation()

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result && !result.canceled) {
      let uriRef = result.assets[0].uri;
      let filename = uriRef.substring(uriRef.lastIndexOf("/") + 1);

      setProfileImg({ uri: uriRef, filename: filename });
    }
  };

  async function handleImage() {
    const data = await uploadImages(
      `users/${profileImg.filename}`,
      profileImg.uri
    );

    return data;
  }

  function checkFields(){
    if (number){
      return email?.length > 0 && name?.length > 0 && location?.length > 0 && desc?.length > 0 && number?.length == 10
    } else {
      return email?.length > 0 && name?.length > 0 && location?.length > 0 && desc?.length > 0 
    }
    
  }

  async function handleUpdate() {
    if (checkFields()) {
      setLoading(true)
      const data = {
        name: name,
        desc: desc,
        email: email,
        number: number,
        location: location,
        profilePic: await handleImage() || "",
      };
  
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, data);
  
      //if teh email changes, update the auth
      if (email != auth.currentUser.email) {
        updateEmail(auth.currentUser, email)
          .then(() => {
            // Email updated!
            // ...
          })
          .catch((error) => {
            // An error occurred
            // ...
          });
      }

      setLoading(false)
      nav.navigate("Home")
    } else {
      setError(true)
    }
   
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''}>
        <View className="flex flex-col w-full h-full items-center bg-white p-1 ">
        <ErrorPopup error={error} setError={setError} errorText={"please ensure your email, name, description or location aren't blank or your number has 10 digits if you added it"} />
        <LoadingIndicator visible={loading} />
          <View className="flex flex-col items-center justify-center gap-y-1">
            <TouchableOpacity onPress={pickImage}>
              {(profileImg && (
                <Image
                  source={{ uri: profileImg.uri || profileImg }}
                  className="w-28 h-28 rounded-full"
                />
              )) || (
                <View
                  className="w-28 h-28 flex-flex-col items-center justify-center rounded-full"
                  style={{ backgroundColor: "#EFEFF0" }}
                >
                  <Image
                    source={require("../../assets/icons/image-icon.png")}
                    style={{ width: 45, height: 45 }}
                  />
                  <Text
                    className="text-center w-3/4 mt-2"
                    style={{ fontSize: 10 }}
                  >
                    tap to add an image
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <Text className="text-center text-xs" style={{fontWeight: 400}}>Member since {joined}   </Text>
          </View>

          <View className="w-full flex flex-col h-full p-4 gap-y-3">
            <View style={{ fontSize: 18 }} className={"flex flex-row gap-x-2 items-center"}>
              <Text
                className="uppercase font-semibold"
                style={{ fontSize: 18 }}
              >
                edit profile
              </Text>
              <SimpleLineIcons name="pencil" size={20} color="black" />
            </View>

            <View className="w-full items-left">
              <Text className="text-xs uppercase font-light" >company name</Text>
              <TextInput
                className="w-full border text-lg h-10 rounded px-2"
                value={name}
                onChangeText={setName}
                placeholder="Example.co"
                placeholderTextColor="#999"
                style={{ fontWeight: "300" }}
              />
            </View>
            <View className="w-full items-left">
              <Text className="text-xs font-light uppercase" >location</Text>
              <View className={`w-full border h-12 rounded flex flex-row  px-2 ${Platform.OS == "ios" && "py-2 items-end" || "items-center gap-x-1"}`}>
                <Image
                  source={require("../../assets/icons/location-marker.png")}
                  style={{ height: 25, width: 25 }}
                />
                <TextInput
                  className={`w-full text-lg h-full  ${Platform.OS == "ios" && "px-1 mb-1 ml-1"} `}
                  value={location && location}
                  onChangeText={setLocation}
                  placeholder={location}
                  placeholderTextColor="#999"
                  style={{ fontWeight: "300" }}
                />
              </View>
            </View>
            <View className="w-full items-left">
              <Text className="text-xs uppercase font-light">description</Text>
              <TextInput
                editable
                multiline
                numberOfLines={4}
                maxLength={100}
                onChangeText={setDesc}
                value={desc}
                style={{ fontWeight: "300" }}
                placeholder="more about your company"
                className="w-full rounded h-24 border "
              />
            </View>

            <View className="flex flex-col gap-y-3">
              <Text
                style={{ fontSize: 15 }}
                className={"uppercase font-semibold text-warm"}
              >
                contact info
              </Text>
              <View className="w-full items-left">
                <Text className="text-xs uppercase font-light">email</Text>
                <TextInput
                  className="w-full border text-lg h-10 rounded px-2"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Example.co"
                  placeholderTextColor="#999"
                  style={{ fontWeight: "300" }}
                />
              </View>
              <View className="w-full items-left">
                <Text className="text-xs font-light uppercase font-light">number</Text>
                <View className={`w-full border h-12 rounded flex flex-row items-center px-2 ${Platform.OS == "ios" && "py-2" || "gap-x-1"}`}>
                  <Text className="text-lg">+1</Text>
                  <TextInput
                    className={`w-full text-lg h-full ${Platform.OS == "ios" && "px-1 mb-2 ml-1" || ""}`}
                    value={number}
                    onChangeText={setNumber}
                    placeholder={"1234567890"}
                    placeholderTextColor="#999"
                    style={{ fontWeight: "300" }}
                  />
                </View>
              </View>
            </View>

            <View className="w-full flex items-center justify-center">
              <TouchableOpacity onPress={handleUpdate}>
                <View className="w-full bg-cherry rounded-full p-4 ">
                  <Text className="text-white uppercase font-semibold">
                    Save Profile
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
