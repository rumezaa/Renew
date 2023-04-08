import { db } from "../../backend/config";

import { collection, onSnapshot } from "firebase/firestore";
import { Text } from "react-native";
import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserProvider";

export const PostsContext = createContext([]);

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState();
  const [user] = useContext(UserContext);
  const [initializing, setInitializing] = useState(true);


  useEffect(() => {
    if (user) {
      if (user?.type == "bs") {
        const unsubscribe = onSnapshot(collection(db, "posts"), (snap) => {
          const data = snap.docs.map((doc) => doc.data());
          const updated = data.filter((obj) => obj.author == user.id);
          !!updated && setPosts(updated);
        });

        return unsubscribe;
      } else if (user?.type == "np") {
        const unsubscribe = onSnapshot(
          collection(db, "posts"),
          (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => doc.data());
            setPosts(data);
            setInitializing(false);
          }
        );
        return unsubscribe;
      }
    } else {
      setPosts(null)
      setInitializing(false)
    }
  }, [user]);

  if (initializing) {
    return <Text>Loading...</Text>;
  }

  return (
    <PostsContext.Provider value={[posts]}>{children}</PostsContext.Provider>
  );
};

