import React from "react";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createStackNavigator } from "react-navigation/stack";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";
import LoginScreen from "./screens/LoginScreen";
import ModalScreen from "./screens/ModalScreen";
import MatchedScreen from "./screens/MatchedScreen";
import MessageScreen from "./screens/MessageScreen";

import { useAuth } from "./hooks/useAuth";

// const Stack = createNativeStackNavigator();
const Stack = createStackNavigator();

const StackNavigatior = () => {
  const { user } = useAuth();
  return (
    // * Removing the header Provided by the Stack NavigationContainer

    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
            <Stack.Screen name="Chat" component={ChatScreen}></Stack.Screen>
            <Stack.Screen
              name="Message"
              component={MessageScreen}
            ></Stack.Screen>
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="Modal" component={ModalScreen}></Stack.Screen>
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "transparentModal" }}>
            <Stack.Screen name="Match" component={MatchedScreen}></Stack.Screen>
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigatior;
