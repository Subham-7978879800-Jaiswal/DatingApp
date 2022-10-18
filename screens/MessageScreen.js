import {
  View,
  KeyboardAvoidingView,
  Platform,
  Button,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import tw from "tailwind-rn";
import { db } from "../firebase";
import {
  collection,
  serverTimestamp,
  query,
  orderBy,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";

const MessageScreen = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const { matchDetails } = params;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchDetails.id, "messages"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    [(matchDetails, db)]
  );

  const sendMessage = () => {
    addDoc(collection(db, "matches", matchDetails.id, "messages"), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      photoUrl: matchDetails.users[user.uid].photoUrl,
      message: inputMessage,
    });
    setInputMessage("");
  };

  return (
    <SafeAreaView style={tw("flex-1")}>
      <Header
        title={
          getMatchedUserInfo(matchDetails?.users, user.uid)?.user.displayName
        }
        callEnabled
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw("flex-1")}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            data={messages}
            style={tw("pl-4")}
            keyExtractor={(item) => item.id}
            renderItem={({ item: message }) =>
              message.userId === user.uid ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
            inverted={-1}
          ></FlatList>
        </TouchableWithoutFeedback>

        <View
          style={tw(
            "flex-row absolute bottom-0 right-0 left-0 bg-white justify-between items-center border-t border-gray-200 px-5 py-2"
          )}
        >
          <TextInput
            style={tw("h-10 text-lg")}
            placeholder="Enter Message..."
            value={inputMessage}
            onChangeText={setInputMessage}
            onSubmitEditing={sendMessage}
          />

          <Button onPress={sendMessage} title="Send"></Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreen;
