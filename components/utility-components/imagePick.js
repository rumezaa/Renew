import * as ImagePicker from "expo-image-picker";

export const pickImage = async ({setImages, images}) => {
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