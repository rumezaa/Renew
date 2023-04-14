import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import SqaurePosts from "../../components/posts/SquarePost";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { mergeSort } from "../../backend/sort";
const BrowseScreen = ({ route }) => {
  const [sortModal, setSortModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [sort, setSort] = useState();
  const [filter, setFilter] = useState();
  const [posts, setPosts] = useState(route.params.item);

  const nav = useNavigation();

  function handleAZ() {
    if (sort == "AZ") {
      setSort(null);
      setPosts(route.params.item);
      setSortModal(false);
    } else {
      mergeSort(posts, posts.length - 1, 0, setPosts, "AZ");
      setSort("AZ");
      setSortModal(false);
    }
  }

  function handleZA() {
    if (sort == "ZA") {
      setPosts(route.params.item);
      setSort(null);
      setSortModal(false);
    } else {
      mergeSort(posts, posts.length - 1, 0, setPosts, "ZA");
      setSort("ZA");
      setSortModal(false);
    }
  }

  function handleFilter() {
    if (filter) {
      setFilter(false);
      setPosts(route.params.item);
      setFilterModal(false);
    } else {
      setPosts(posts.filter((post) => post.available));
      setFilter(true);
      setFilterModal(false);
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => (filter && setFilter(false)) || setSort(false)}
    >
      <View className="h-full w-full flex items-center justify-center bg-white gap-y-6">
        <View
          className="w-full flex flex-row bg-white items-center justify-between p-4"
          style={{ boxShadow: 10 }}
        >
          <Text
            className="uppercase"
            style={{
              fontSize: 15,
              fontWeight: 400,
            }}
          >
            all donations{" "}
          </Text>
          <View className="flex flex-row gap-x-4">
            <TouchableOpacity onPress={() => setSortModal(true)}>
              <View
                style={{
                  borderWidth: 0.3,
                  borderColor: "black",
                  borderStyle: "solid",
                  padding: 10,
                }}
                className="flex flex-row gap-x-2 items-center justify-center rounded"
              >
                <Text
                  style={{
                    fontSize: 14.5,
                    fontWeight: 400,
                  }}
                >
                  sort{" "}
                </Text>
                <Image
                  source={require("../../assets/icons/sort.png")}
                  style={{ width: 20, height: 20 }}
                />
              </View>
            </TouchableOpacity>
            <Modal transparent visible={sortModal}>
              <View
                className="absolute"
                style={{
                  position: "absolute",
                  zIndex: 1,
                  top: 150,
                  right: 220,
                }}
              >
                <View
                  className="absolute shadow-lg"
                  style={{ bottom: -99, left: -5, zIndex: 2 }}
                >
                  <TouchableOpacity
                    style={{
                      borderBottomWidth: 0.3,
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                    }}
                    className={`p-4 ${
                      (sort == "AZ" && "bg-warm") || "bg-white"
                    }`}
                    onPress={handleAZ}
                  >
                    <View>
                      <Text
                        className={`${
                          (sort == "AZ" && "text-white") || "text-black"
                        }`}
                        style={{ fontWeight: 400 }}
                      >
                        sort A-Z{" "}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`p-4 ${
                      (sort == "ZA" && "bg-warm") || "bg-white"
                    }`}
                    style={{
                      borderBottomLeftRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={handleZA}
                  >
                    <View>
                      <Text
                        className={`${
                          (sort == "ZA" && "text-white") || "text-black"
                        }`}
                        style={{ fontWeight: 400 }}
                      >
                        sort Z-A
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <TouchableOpacity onPress={() => setFilterModal(true)}>
              <View className="flex flex-row w- gap-x-2 items-center justify-center rounded bg-warm p-2">
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 400
                  }}
                  className="text-white"
                >
                  filter{" "}
                </Text>

                <MaterialCommunityIcons
                  name="sort-variant"
                  size={24}
                  color="white"
                />
              </View>
            </TouchableOpacity>
            <Modal transparent visible={filterModal}>
              <View
                style={{
                  position: "absolute",
                  zIndex: 1,
                  top: 90,
                  right: 105,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <View
                  className="absolute shadow-lg"
                  style={{ bottom: -93, left: -12, zIndex: 2 }}
                >
                  <TouchableOpacity
                    className={`w-24 p-1 flex items-center ${
                      (filter && "bg-warm") || "bg-white"
                    }`}
                    style={{
                      borderBottomLeftRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={handleFilter}
                  >
                    <View>
                      <Text
                        className={`text-center ${
                          (filter && "text-white") || "text-black"
                        }`}
                        style={{ fontWeight: 400 }}
                      >
                        available donations
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>

        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => nav.navigate("Product", { item: item })}
            >
              <SqaurePosts item={item} />
            </TouchableOpacity>
          )}
          //Setting the number of column
          numColumns={2}
          className="w-full ml-6"
          style={{ zIndex: 1 }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
export default BrowseScreen;
