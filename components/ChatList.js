import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { FlatList, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import tw from "tailwind-rn";
import { useAuth } from "../hooks/useAuth";
import ChatRow from "./ChatRow";

const ChatList = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState();

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "matches"),
        where("usersMatched", "array-contains", user.uid)
      ),
      (snapshot) =>
        setMatches(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          })
        )
    );
  }, [user]);

  return matches?.length > 0 ? (
    <FlatList
      style={tw("h-full")}
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={(item) => <ChatRow matchDetails={item.item}></ChatRow>}
    ></FlatList>
  ) : (
    <View style={tw("p-5")}>
      <Text style={tw("text-center text-lg")}>No Matches at the moment 🙂</Text>
    </View>
  );
};

export default ChatList;
