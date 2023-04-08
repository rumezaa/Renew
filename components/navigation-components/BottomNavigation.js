import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Image, TouchableOpacity, View, Text } from "react-native";
import CalendarScreen from "../../screens/main/CalendarScreen";
import MessagesScreen from "../../screens/main/MessagesScreen";
import HomeScreen from "../../screens/main/HomeScreen";
import CreateProductScreen from "../../screens/business/CreateProductScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/UserProvider";
import { useContext } from "react";
import "../../assets/icons/header-icons/home.png";
import NpCalendarScreen from "../../screens/non-profit/NpCalendarScreen";

const Tab = createBottomTabNavigator();

const CircleButton = ({ onPress }) => {
  return (
    <TouchableOpacity className="bg-tomato rounded-full w-16 h-16 absolute flex items-center justify-center right-3 -top-6" onPress={onPress}>
      <View>
      <Ionicons name="add-outline" size={40} color="white" />
      </View>
    </TouchableOpacity>
  );
};


const BottomNavigation = () => {
  const nav = useNavigation();
  const [user] = useContext(UserContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Messages") {
            iconName = focused
              ? "md-chatbox-ellipses"
              : "md-chatbox-ellipses-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Home") {
            iconName = focused
              ? require("../../assets/icons/header-icons/home-focused.png")
              : require("../../assets/icons/header-icons/home.png");
            return (
              <Image source={iconName} style={{ width: size, height: size }} />
            );
          } else if (route.name == "Calendar"){
            iconName = focused
              ? "../../assets/icons/header-icons/home.png"
              : "../../assets/icons/header-icons/home.png";
            return (
              <MaterialCommunityIcons
                name="calendar"
                size={size}
                color={color}
              />
            );
          } else {
            iconName = focused
              ? "../../assets/icons/header-icons/home.png"
              : "../../assets/icons/header-icons/home.png";
            return (
              <MaterialCommunityIcons
                name="calendar"
                size={size}
                color={"white"}
              />
            );
          }
        },
        tabBarActiveTintColor: "#D8473D",
        tabBarInactiveTintColor: "gray",
        tabBarButton: (props) => {
          if (props.accessibilityRole === "button" && props.name === "Add") {
            return <CircleButton onPress={props.onPress} />;
          } else {
            return <TouchableOpacity {...props} />;
          }
        },
        tabBarLabel: ({ focused, color }) => {
      let label = "";
      switch (route.name) {
        case "Messages":
          label = "Messages";
          break;
        case "Home":
          label = "Home";
          break;
        case "Calendar":
          label = "Calendar";
          break;
        default:
          label = "";
      }
      return (
        <Text style={{ color: color, fontSize: 11 }}>
          {label} </Text>
      );
    },
      })}
    >
      <Tab.Screen
        name="Messages"
        options={{ headerShown: false }}
        component={MessagesScreen}
      />
      <Tab.Screen
        name="Home"
        options={{ headerShown: false }}
        component={HomeScreen}
      />

      {user?.type == "np" &&  <Tab.Screen
        name="Calendar"
        options={{ headerShown: false }}
        component={NpCalendarScreen}
      />}

     
      {user?.type == "bs" && (
        <>
        <Tab.Screen
        name="Calendar"
        options={{ headerShown: false }}
        component={CalendarScreen}
      />
        <Tab.Screen
          name="."
          component={CreateProductScreen}
        />
        <Tab.Screen
          name="Add"
          component={CreateProductScreen}
          listeners={() => ({
            tabPress: (e) => {
              e.preventDefault();
              nav.navigate("Create Product");
            },
          })}
          options={{
            tabBarButton: (props) => <CircleButton onPress={props.onPress} />,
          }}
        />
        </>
        
      )}
    </Tab.Navigator>
  );
};



export default BottomNavigation;
