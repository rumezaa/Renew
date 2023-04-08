import {
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  addDoc,
  getDoc,

} from "firebase/firestore";
import { FontAwesome } from '@expo/vector-icons';
import { Keyboard } from "react-native";
import { db } from "../../backend/config";
import { UserContext } from "../../components/contexts/UserProvider";
import { useContext, useState, useEffect, useRef } from "react";
import { LoadingIndicator } from 'react-native-expo-fancy-alerts';


export default function DmScreen({ route }) {
  const recieverUID = route.params.item;

  const [user] = useContext(UserContext);
  const [reciever, setReciever] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [isSent, setIsSent] = useState(false);
  const [keyboard, setKeyboard] = useState(false)
  const [loading, setLoading] = useState(false)

  const flatListRef = useRef();

  useEffect(() => {
    if (recieverUID) {
      const businessRef = doc(db, "users", recieverUID);
      const docUnsubscribe = onSnapshot(businessRef, (docSnap) => {
        if (docSnap.exists()) {
          setReciever(docSnap.data());
        } else {
          console.log("User not found");
        }
      });

      return () => docUnsubscribe();
    }
  }, [recieverUID]);

  useEffect(() => {
    const userRef = doc(db, "users", user.id);
    setLoading(true)
    const docUnsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const index = docSnap
          .data()
          .messages.findIndex((obj) => obj.recieverId === recieverUID);
        if (index !== -1) {
          const data = docSnap.data().messages[index];
          const messagesRef = doc(db, "messages", data.messageId);
          const unsubscribe = onSnapshot(messagesRef, (messagesSnap) => {
            if (messagesSnap.exists()) {
              setMessages(messagesSnap.data());
            }
          });
          return () => unsubscribe();
        }
      } else {
        console.log("User not found");
      }
    });

    setLoading(false)
    return () => docUnsubscribe();

  }, [messages]);


  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboard(true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      setKeyboard(false);
    });
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);

  async function handleSend() {
    setIsSent(true);
    if (messages?.length == 0) {
      const messagesItem = {
        messages: [
          {
            content: message,
            date: new Date(),
            sender: user.id,
            isRead: false,
          },
        ],
      };

      const messagesRef = collection(db, "messages");
      const messageRef = await addDoc(messagesRef, messagesItem);
      await updateDoc(messageRef, { id: messageRef.id });

      const userMessageItem = {
        messageId: messageRef.id,
        recieverId: recieverUID,
        recieverProfile: reciever.profilePic,
        reciever: reciever.name,
        latestMessage: {
          date: new Date(),
          content: message,
          isRead: false,
          sender: user.id,
        },
      };

      const recieverMessageItem = {
        messageId: messageRef.id,
        recieverId: user.id,
        recieverProfile: user.profilePic,
        reciever: user.name,
        latestMessage: {
          date: new Date(),
          content: message,
          isRead: false,
          sender: user.id,
        },
      };

      const userRef = doc(db, "users", user.id);
      const reciverRef = doc(db, "users", recieverUID);
      await updateDoc(userRef, { messages: [...user?.messages, userMessageItem] });
      await updateDoc(reciverRef, { messages: [...reciever?.messages,recieverMessageItem] });
     
    } else {
      
      const messageItem = {
        content: message,
        date: new Date(),
        sender: user.id,
        isRead: false,
      };

      const latestMessage = {
        date: new Date(),
        content: message,
        isRead: false,
        sender: user.id,
      };

      const messageRef = doc(db, "messages", messages.id);
      const userRef = doc(db, "users", user.id);
      const recieverRef = doc(db, "users", recieverUID);
      const userSnap = await getDoc(userRef);
      const recieverSnap = await getDoc(recieverRef);
      const updatedMessages = [...messages.messages, messageItem];

      const userMessages = userSnap.data().messages;
      const userIndex = userMessages.findIndex(
        (obj) => obj.messageId === messages.id
      );
      userMessages[userIndex].latestMessage = latestMessage;
      userMessages[userIndex].recieverProfile = reciever.profilePic;
      userMessages[userIndex].reciever = reciever.name;

      const recieverMessages = recieverSnap.data().messages;
      const recieverIndex = recieverMessages.findIndex(
        (obj) => obj.messageId === messages.id
      );
      recieverMessages[recieverIndex].latestMessage = latestMessage;
      recieverMessages[recieverIndex].recieverProfile = user.profilePic;
      recieverMessages[recieverIndex].reciever = user.name;

      await updateDoc(messageRef, { messages: updatedMessages });
      await updateDoc(userRef, { messages: userMessages });
      await updateDoc(recieverRef, { messages: recieverMessages });
      
    }
    setIsSent(false);
    setMessage("");
  }

  


  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" && "position" || ""}
        className="bg-white flex w-full justify-end h-full"
      >
      
        <View>
        <LoadingIndicator visible={isSent} />
          <FlatList
            data={messages.messages}
            ref={flatListRef}
            onContentSizeChange={() =>
              messages?.length >0 && flatListRef.current.scrollToEnd({ animated: true })
            }
            onLayout={() =>
                messages?.length >0  && flatListRef.current.scrollToEnd({ animated: true })
            }
            renderItem={({ item }) =>
              (item.sender == user.id && (
                <View className="flex flex-row w-full justify-end">
                  <View
                    className="bg-tomato p-2 flex flex-row items-center mb-2"
                    style={{
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 10,
                      borderTopRightRadius: 5,
                    }}
                  >
                    <Text className="text-white" style={{ fontSize: 18, fontWeight: 400 }}>
                      {item.content}   </Text>
                  </View>
                </View>
              )) || (
                <View className="flex flex-row w-full ml-2">
                  <View
                    className="p-2 flex flex-row items-center mb-2"
                    style={{
                      borderTopRightRadius: 10,
                      borderBottomRightRadius: 10,
                      borderTopLeftRadius: 5,
                      backgroundColor: "#CBCBCB",
                    }}
                  >
                    <Text className="text-white" style={{ fontSize: 18, fontWeight: 400 }}>
                      {item.content}  </Text>
                  </View>
                </View>
              )
            }
          />
        </View>
        <View
          className={`bg-cherry p-2 ${
           "pb-10"
          }`}
        >
        <View className="flex flex-row bg-white rounded-lg w-full justify-between items-center px-3">
        <TextInput
            className="text-lg rounded-full h-12 "
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSend}
            placeholder="send a message"
          />
          <FontAwesome name="send" size={24} color="#D8473D" />
        </View>
          

        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
