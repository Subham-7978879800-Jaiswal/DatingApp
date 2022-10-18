import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import tw from "tailwind-rn";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const ModalScreen = () => {
  const { user } = useAuth();
  const [photoUrl, setPhotoUrl] = useState();
  const [age, setAge] = useState();
  const [job, setJob] = useState();
  const navigation = useNavigation();

  const incompleteForm = !photoUrl || !age || !job;

  // * Form Submitted

  const updateUserProfile = async () => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        displayName: user.displayName,
        photoUrl: photoUrl,
        job,
        age,
        timestamp: serverTimestamp(),
      });
      navigation.navigate("Home");
    } catch (e) {}
  };

  // * Form UI

  return (
    <View style={tw("flex-1 items-center pt-16")}>
      <Image
        style={tw("h-20 w-full")}
        resizeMode="contain"
        source={{ uri: "https://links.papareact.com/2pf" }}
      />
      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step 1: The Profile Pic
      </Text>
      <TextInput
        value={photoUrl}
        onChangeText={(text) => setPhotoUrl(text)}
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter Profile URL"
      ></TextInput>

      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step 2: The Job
      </Text>
      <TextInput
        onChangeText={(text) => setJob(text)}
        value={job}
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter Your Occupation"
      ></TextInput>

      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step 3: The Age
      </Text>
      <TextInput
        onChangeText={(text) => setAge(text)}
        value={age}
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter Your Age"
        keyboardType="numeric"
      ></TextInput>

      <TouchableOpacity
        onPress={() => updateUserProfile()}
        disabled={incompleteForm}
        style={[
          tw("w-64 p-3 rounded-xl absolute bottom-10 bg-red-400"),
          incompleteForm ? tw("bg-gray-400") : tw("bg-red-400"),
        ]}
      >
        <Text style={tw("text-center text-white text-xl")}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
