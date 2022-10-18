import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import ChatList from "../components/ChatList";

const ChatScreen = () => {
  return (
    <SafeAreaView>
      <Header title="Chat" callEnabled={true}></Header>
      <ChatList></ChatList>
    </SafeAreaView>
  );
};

export default ChatScreen;
