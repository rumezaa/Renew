import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import Slider from "../../components/utility-components/Slider";
import ProductViewModal from "../../components/utility-components/ProductViewModal";
import { useContext } from "react";
import { PostsContext } from "../../components/contexts/PostsProvider";
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';



export default function HomeScreen({ navigation }) {
  const [posts] = useContext(PostsContext) 
  return (
    <View className={`bg-white h-full w-full `}>
      {posts && posts?.length !== 0 && <View
        className={`flex flex-col items-center justify-between h-full w-full p-4`}
      >
        {posts.filter((post) => post.needGoneAsap == true).length > 0 && <View className="w-full flex flex-col items-center gap-y-5 mb-10">
          <View className="w-full flex flex-row gap-x-3 justify-center text-xl items-center text-center">
          <Feather name="clock" size={24} color="#D8473D" />
            <Text className="text-lg my-2 font-semibold text-cherry">Need Gone ASAP</Text>
          </View>
          <View className="w-full items-center">
           <Slider data={posts.filter((post) => post.needGoneAsap == true)} />
          </View>

        </View>}

       
        <ProductViewModal products={posts} />
        
      </View> || <View className="flex flex-col w-full h-full items-center justify-center gap-y-2">
      <MaterialIcons name="error" size={50} color="#939393" />
        <Text>No posts found</Text>
      </View>}
    </View>
  );
}


