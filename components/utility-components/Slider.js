import Carousel, { Pagination } from "react-native-snap-carousel";
import { useRoute } from "@react-navigation/native";
import {
  View,
  ImageBackground,
  Dimensions,
  Text,
  TouchableOpacity,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useRef } from "react";

export default function Slider({ data }) {
  const SLIDER_WIDTH = Dimensions.get("window").width + 80;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
  const isCarousel = useRef(null);
  const route = useRoute();
  const nav = useNavigation();

  const NeedGoneAsap = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => nav.navigate("Product", { item: item })} key={item.id}>
        <ImageBackground
          source={{ uri: item.images[0] }}
          resizeMode="cover"
          className={`h-48 w-full px-1 items-end rounded-md shadow-lg flex flex-row`}
        >
          <Text className="text-white font-semibold" style={{fontSize: 17}}>{item.title}</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const ProductViewSlider = ({ item }) => {
    return (
      <Image
        source={{ uri: item }}
        resizeMode="cover"
        className={`h-48 w-full px-1 items-end rounded-md shadow-lg flex flex-row rounded shadow`}
      ></Image>
    );
  };

  return (
    <View className="h-48 w-full flex items-center">
      <Carousel
        layout="default"
        ref={isCarousel}
        data={data}
        renderItem={route.name == "Product" && ProductViewSlider || NeedGoneAsap}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        inactiveSlideShift={0}
        useScrollView={true}
      />
    </View>
  );
}
