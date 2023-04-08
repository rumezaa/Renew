import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform
} from "react-native";
import ErrorPopup from "../../components/utility-components/ErrorPopup";
import { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { addPosts, uploadImages, updatePosts } from "../../backend/utilities";
import { auth } from "../../backend/config";
import * as ImagePicker from "expo-image-picker";
import { UserContext } from "../../components/contexts/UserProvider";
import { useContext } from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LoadingIndicator } from 'react-native-expo-fancy-alerts';

export default function CreateProductScreen({ route }) {
  const product = route.name == "Update Product" && route.params.item;
  const [user] = useContext(UserContext);
  const [images, setImages] = useState(product?.images || []);
  const [items, setItems] = useState(product?.includes || []);
  const [item, setItem] = useState();
  const [title, setTitle] = useState(product?.title || null);
  const [deliveryOptions, setDeliveryOptions] = useState(
    product?.deliveryOptions || []
  );
  const [location, setLocation] = useState(product?.location || user?.location);
  const [amount, setAmount] = useState(product?.amount || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const nav = useNavigation();
  const routeNav = useRoute();

  function handleItems(item) {
    item && items ? setItems([...items, item]) : setItems([item]);
    setItem("");
  }

  function handleDelivery(option) {
    if (deliveryOptions.includes(option)) {
      setDeliveryOptions((deliveryOptions) =>
        deliveryOptions.filter((item) => item !== option)
      );
    } else {
      setDeliveryOptions([...deliveryOptions, option]);
    }
  }

  async function handleImages() {
    const refImages = [];
    if (images) {
      for (let i = 0; i < images.length; i++) {
        if (!images[i].uri && images[i].includes("firebase")) {
          refImages.push(images[i]);
        } else {
          const data = await uploadImages(
            `posts/${images[i].filename}`,
            images[i].uri
          );
          refImages.push(data);
        }
      }
    }

    return refImages;
  }

  async function handlePost() {
    if (checkFields()){
      setLoading(true);
    const data = {
      includes: items,
      title: title,
      deliveryOptions: deliveryOptions,
      amount: amount,
      location: location,
      images: await handleImages(),
      author: auth.currentUser.uid,
      available: product?.available || true,
      needGoneAsap: false,
      id: product?.id || null,
    };

    if (routeNav.name == "Update Product") {
      await updatePosts(data);
    } else {
      await addPosts(data);
    }

    setLoading(false);
    nav.navigate("Home");
    } else {
      setError(true)
    }
    
  }

  function deleteImage(item) {
    if (item.uri) {
      setImages((images) => images.filter((obj) => obj.uri !== item.uri));
    } else {
      setImages((images) => images.filter((obj) => obj !== item));
    }
  }

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
      images
        ? setImages([...images, { uri: uriRef, filename: filename }])
        : setImages([{ uri: uriRef, filename: filename }]);
    }
  };

  function checkFields(){
    
    return title?.length > 0 && items?.length > 0 && images?.length > 0 && deliveryOptions?.length > 0 && amount?.length > 0 && location?.length > 0
  }


  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView behaviour="padding" keyboardVerticalOffset={100}>
        <View
          className="w-full h-full flex justify-between p-4"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <LoadingIndicator visible={loading} />
          <ErrorPopup error={error} setError={setError} errorText={"please make sure all fields are filled"} />
          <Text className="text-2xl font-semibold">
            {(routeNav.name !== "Update Product" && "Create A Post") ||
              "Update Post"} </Text>
          <View className="flex flex-col gap-2 w-full">
            <Text>Add Images</Text>
            <View className="flex flex-row w-full items-center">
              <TouchableOpacity onPress={pickImage}>
                <View
                  className="w-24 h-24 flex-flex-col items-center justify-center rounded-lg mr-4"
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
              </TouchableOpacity>

              <FlatList
                data={images}
                renderItem={({ item }) => (
                  <>
                    <Image
                      source={{ uri: item.uri || item }}
                      className="rounded-lg mx-1"
                      style={{ width: 100, height: 100 }}
                    />
                    <TouchableOpacity
                      onPress={() => deleteImage(item)}
                      className="bg-red-700 rounded-full w-5 h-5 flex items-center justify-center absolute right-0 top-0"
                    >
                      <Feather name="x" size={18} color="white" />
                    </TouchableOpacity>
                  </>
                )}
                //Setting the number of columns
                className="w-full"
                horizontal
              />
            </View>
          </View>

          <View className="w-full items-left">
            <Text className="text-xs font-light uppercase">title</Text>
            <TextInput
              className="w-full border text-lg h-10 rounded px-2"
              value={title}
              onChangeText={setTitle}
              placeholder="Assortment of donations"
              placeholderTextColor="#999"
              style={{ fontWeight: "300" }}
            />
          </View>

          <View className="flex flex-col w-full items-center justify-center">
            <View className="w-full items-left">
              <Text className="text-xs font-light uppercase">items</Text>
              <TextInput
                className="w-full border text-lg h-10 rounded px-2"
                value={item}
                onChangeText={setItem}
                onSubmitEditing={() => handleItems(item)}
                placeholderTextColor="#999"
                style={{ fontWeight: "300" }}
                placeholder="enter a singular item each time"
              />
            </View>
            <View className="w-full">
              <FlatList
                data={items}
                renderItem={({ item }) => (
                  <View
                    className="rounded-full h-10 flex flex-row m-1 items-center justify-between p-2"
                    style={{ backgroundColor: "#ED6E65" }}
                  >
                    <Text className="text-white font-semibold mr-2" style={{fontSize: 11, fontWeight: 400}}>
                      {item}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setItems((items) => items.filter((obj) => obj !== item))
                      }
                    >
                      <View>
                        <Feather name="x" size={15} color="white" />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                //Setting the number of columns
                horizontal
                className="w-full"
                //numColumns={4}
              />
            </View>
          </View>

          <View className="w-full items-left">
            <Text className="text-xs font-light uppercase">amount</Text>
            <TextInput
              className="w-full border text-lg h-10 rounded px-2"
              value={amount}
              onChangeText={setAmount}
              placeholder="5 large bags"
              placeholderTextColor="#999"
              style={{ fontWeight: "300" }}
            />
          </View>
          <View className="w-full items-left">
            <Text className="text-xs font-light uppercase">location</Text>
            <View 
            
            className={`w-full border h-12 rounded flex flex-row  px-2 ${Platform.OS == "ios" && "py-2 items-end" || "items-center gap-x-1"}`}
            >
              <Image
                source={require("../../assets/icons/location-marker.png")}
                style={{ height: 25, width: 25 }}
              />
              <TextInput
                className="w-full text-lg h-full px-1 mb-1 ml-1"
                value={location && location}
                onChangeText={setLocation}
                placeholder={location}
                placeholderTextColor="#999"
                style={{ fontWeight: "300" }}
              />
            </View>
          </View>

          <View className="w-full items-left">
            <Text className="mb-3">Select Delivery Option</Text>
            <View className="flex flex-row w-full justify-center gap-3">
              <TouchableOpacity onPress={() => handleDelivery("local pickup")}>
                <View
                  className={`${
                    deliveryOptions?.includes("local pickup") &&
                    "bg-black text-white"
                  }  border rounded items-center p-4 flex-row w-full`}
                >
                  <Image
                    source={
                      (deliveryOptions?.includes("local pickup") &&
                        require("../../assets/icons/box-w.png")) ||
                      require("../../assets/icons/box-black.png")
                    }
                    style={{
                      width: 18,
                      height: 18,
                    }}
                  />
                  <Text
                    className={`${
                      deliveryOptions?.includes("local pickup") &&
                      "text-white font-semibold"
                    } text-center ml-2`}
                    style={{fontWeight: 400}}
                  >
                    local pickup </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelivery("local delivery")}
              >
                <View
                  className={`${
                    deliveryOptions?.includes("local delivery") &&
                    "bg-black text-white"
                  } border rounded items-center p-4 flex flex-row w-full `}
                >
                  <Image
                    source={
                      (deliveryOptions?.includes("local delivery") &&
                        require("../../assets/icons/truck-white.png")) ||
                      require("../../assets/icons/truck-black.png")
                    }
                    style={{
                      width: 32,
                      height: undefined,
                      aspectRatio: 135 / 76,
                    }}
                  />
                  <Text
                    className={`${
                      deliveryOptions?.includes("local delivery") &&
                      "text-white font-semibold"
                    } text-center ml-2`}
                    style={{fontWeight: 400}}
                  >
                    local delivery  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={handlePost}>
            <View className="bg-golden rounded-full items-center p-4">
              <Text className="uppercase tracking-wider text-white font-bold text-lg">
                {(routeNav.name == "Update Product" && "update post") ||
                  "create post"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
