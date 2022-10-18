import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  getDoc,
} from "firebase/firestore";

import { useAuth } from "../hooks/useAuth";
import { Ionicons, AntDesign, Entypo } from "@expo/vector-icons";
import tw from "tailwind-rn";
import Swipper from "react-native-deck-swiper";
import generateId from "../lib/generatedId";

const HomeScreen = () => {
  const [profiles, setProfiles] = useState([]);
  const navigation = useNavigation();
  const { user } = useAuth();
  const swipeRef = useRef();

  // * Setting Initial Fetch of user profiles
  // * Keeping track of Our own user and Left Swiped / Passed Users

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const swipes = await getDocs(
        collection(db, "users", user.uid, "swipes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passedUserIds = passes.length > 0 ? passes : ["test"];
      const swipedUserIds = swipes.length > 0 ? swipes : ["test"];

      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUserIds, ...swipedUserIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };

    fetchCards();
    return unsub;
  }, []);

  // * Opening the Details  Form ForceFully if new User

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (!snapshot.exists()) {
        navigation.navigate("Modal");
      }
    });
    return unsub;
  }, []);

  // * Left Swipper

  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };

  // * Right Swipper

  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await (
      await getDoc(doc(db, "users", user.uid))
    ).data();

    setDoc(doc(db, "users", user.uid, "swipes", userSwiped.id), userSwiped);

    // * Check If the user swiped on you already and Creating Match Screen
    await getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          // *  Creating a Match
          setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });
          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });
        }
      }
    );
  };

  return (
    <>
      {user ? (
        <>
          <SafeAreaView style={tw("flex-1")}>
            {/* // Header */}
            <View style={tw("flex-row items-center justify-between px-5")}>
              <TouchableOpacity>
                <Image
                  style={tw("h-10 w-10 rounded-full")}
                  source={{ uri: user.photoURL }}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
                <Image
                  style={tw("h-14 w-14")}
                  source={require("../logo.png")}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                <Ionicons
                  name="chatbubbles-sharp"
                  size={30}
                  color={"#ff5864"}
                  style={tw("h-14 w-14 pt-3")}
                />
              </TouchableOpacity>
            </View>
            {/* // Header */}
            {/* {Swiper} */}
            <View style={tw("flex-1 -mt-6")}>
              <Swipper
                ref={swipeRef}
                containerStyle={{ backgroundColor: "transparent" }}
                cards={profiles}
                stackSize={5}
                cardIndex={0}
                animateCardOpacity
                onSwipedLeft={(cardIndex) => {
                  swipeLeft(cardIndex);
                }}
                onSwipedRight={(cardIndex) => {
                  swipeRight(cardIndex);
                }}
                verticalSwipe={false}
                overlayLabels={{
                  left: {
                    title: "NOPE",
                    style: {
                      label: {
                        textAlign: "right",
                        color: "red",
                      },
                    },
                  },

                  right: {
                    title: "MATCH",
                    style: {
                      label: {
                        textAlign: "left",
                        color: "#4DED30",
                      },
                    },
                  },
                }}
                renderCard={(card) => {
                  return card ? (
                    <View
                      key={card.id}
                      style={tw("relative bg-white h-3/4 rounded-xl")}
                    >
                      <Image
                        style={tw("absolute top-0 h-full w-full rounded-xl")}
                        source={{ uri: card.photoUrl }}
                      ></Image>
                      <View
                        style={[
                          tw(
                            "absolute bottom-0 bg-white w-full flex-row justify-between items-center h-20 px-6 py-2 rounded-b-xl"
                          ),
                          styles.cardShadow,
                        ]}
                      >
                        <View>
                          <Text style={tw("text-xl font-bold")}>
                            {card.displayName}
                          </Text>
                          <Text>{card.job}</Text>
                        </View>
                        <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={[
                        tw(
                          "relative bg-white h-3/4 rounded-xl justify-center items-center"
                        ),
                        styles.cardShadow,
                      ]}
                    >
                      <Text style={tw("font-bold pb-5")}>No more Profiles</Text>
                    </View>
                  );
                }}
              />
            </View>
            {/* {Swiper} */}
            {/* {Bottom Buttons} */}
            <View style={tw("flex flex-row justify-evenly")}>
              <TouchableOpacity
                onPress={() => swipeRef.current.swipeLeft()}
                style={tw(
                  "items-center justify-center rounded-full w-16 h-16 bg-red-200"
                )}
              >
                <Entypo name="cross" size={24} color="red" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => swipeRef.current.swipeRight()}
                style={tw(
                  "items-center justify-center rounded-full w-16 h-16 bg-red-200"
                )}
              >
                <AntDesign name="heart" size={24} color="green" />
              </TouchableOpacity>
            </View>
            {/* {Bottom Buttons} */}
          </SafeAreaView>
        </>
      ) : null}
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
