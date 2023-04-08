import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "./backend/config";
import BottomNavigation from "./components/navigation-components/BottomNavigation";
import ProductScreen from "./screens/products/ProductScreen";
import BrowseScreen from "./screens/main/BrowseScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import SignupScreen from "./screens/auth/SignupScreen";
import AccountViewScreen from "./screens/accounts/AccountViewScreen";
import CreateProductScreen from "./screens/business/CreateProductScreen";
import DonationClaim from "./screens/non-profit/donation-claim/DonationClaim";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PostsProvider } from "./components/contexts/PostsProvider";
import { UserProvider } from "./components/contexts/UserProvider";
import AccountScreen from "./screens/accounts/AccountScreen";
import { signOut } from "firebase/auth";
import { SimpleLineIcons } from "@expo/vector-icons";
import { View, TouchableOpacity } from "react-native";
import DmScreen from "./screens/main/DmScreen";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const Stack = createNativeStackNavigator();

  function HeaderMiddle() {
    return <View style={{ width: 50, height: 40 }} className="bg-cherry" />;
  }

  function HeaderRight() {
    const nav = useNavigation();
    return (
      <TouchableOpacity onPress={() => nav.navigate("Manage Account")}>
        <FontAwesome5 name="user-alt" size={24} color="white" />
      </TouchableOpacity>
    );
  }

  function HeaderLeft() {
    const nav = useNavigation();
    async function handleSignOut() {
      signOut(auth)
        .then(() => {
          AsyncStorage.removeItem("password")
          AsyncStorage.removeItem("email")
        })
        .catch((error) => {

          console.error("Error signing out:", error);
        });
    }
    return (
      <TouchableOpacity onPress={handleSignOut}>
        <SimpleLineIcons name="logout" size={24} color="white" />
      </TouchableOpacity>
    );
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return null;
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <PostsProvider>
          <Stack.Navigator>
            {user ? (
              <Stack.Screen
                name="Main"
                component={BottomNavigation}
                options={{
                  headerTitle: (props) => <HeaderMiddle {...props} />,
                  headerRight: (props) => <HeaderRight {...props} />,
                  headerLeft: (props) => <HeaderLeft {...props} />,
                  headerStyle: {
                    backgroundColor: "#D8473D",
                  },
                  headerTintColor: "#fff",
                  headerTitleStyle: {
                    fontWeight: "bold",
                  },
                }}
              />
            ) : (
              <>
                <Stack.Screen name="Login" component={LoginScreen}  options={{ headerShown: false }}/>
                <Stack.Screen name="Signup" component={SignupScreen}  options={{ headerShown: false }}/>
              </>
            )}

            <Stack.Screen name="Product" component={ProductScreen}  />
            <Stack.Screen name="Direct Message" component={DmScreen} />

            <Stack.Screen name="Donation Claim" component={DonationClaim} />

            <Stack.Screen name="Browse" component={BrowseScreen} />
            <Stack.Screen name="View Profile" component={AccountViewScreen} />
            <Stack.Screen name="Manage Account" component={AccountScreen} />

            <Stack.Screen
              name="Create Product"
              component={CreateProductScreen}
            />
            <Stack.Screen
              name="Update Product"
              component={CreateProductScreen}
            />
          </Stack.Navigator>
        </PostsProvider>
      </NavigationContainer>
    </UserProvider>
  );
}
