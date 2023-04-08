import { db, auth } from "../../backend/config";
import { doc, onSnapshot} from "firebase/firestore";
import { createContext, useState, useEffect } from "react";
import { Text } from "react-native";

export const UserContext = createContext([]);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        const docRef = doc(db, "users", userAuth.uid);
        const docUnsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUser(docSnap.data());
            setInitializing(false);
          } else {
            console.log("No such document!");
          }
        });

        return () => docUnsubscribe();
      } else {
        setUser(null);
        setInitializing(false);
      }
    });
    
    //unsubscribe format the  onAuthState changed cuz we don't need to listen if there isnt any change
    return () => unsubscribe();
  }, []);

  if (initializing) {
    return <Text>Loading...</Text>;
  }

  
  return(
    <UserContext.Provider value={[user]}>
      {children}
    </UserContext.Provider>
  );
};
