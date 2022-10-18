import React, {
  useContext,
  useState,
  createContext,
  useEffect,
  useMemo,
} from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  signInWithCredential,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";

import { auth } from "../firebase";

const AuthContext = createContext({});

WebBrowser.maybeCompleteAuthSession();

// const config = {
//   iosClientId:
//     "981884698734-8kv6qou2c1qd5kj19mj9vuemrs61pb2d.apps.googleusercontent.com",
//   androidClientId:
//     "981884698734-3d5cf108br4rmpfmvhj4fsi6rhmjvr9n.apps.googleusercontent.com",
//   scopes: ["profile", "email"],
//   permissions: ["public_profile", "email", "gender", "location"],
//   expoClientId:
//     "981884698734-fgv48vercp8vrtm37f694oaeb9pmr4ll.apps.googleusercontent.com",
// };

const config = {
  iosClientId:
    "981884698734-ik9mgpihppgngak9a84fsgamvi8r9kh3.apps.googleusercontent.com",
  androidClientId:
    "981884698734-grv3ed6q4iehr0rvp8cn2ocp5aisv64e.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
  expoClientId:
    "981884698734-fgv48vercp8vrtm37f694oaeb9pmr4ll.apps.googleusercontent.com",
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [___, googleResponse, signInWithGoogle] = Google.useAuthRequest(config);

  useEffect(() => {
    async function logInWithGoogle(idToken, accessToken) {
      setLoading(true);
      try {
        const credential = GoogleAuthProvider.credential(idToken, accessToken);
        await signInWithCredential(auth, credential);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (googleResponse?.type === "success") {
      const { idToken, accessToken } = googleResponse.authentication;
      logInWithGoogle(idToken, accessToken);
    }
  }, [googleResponse]);

  useEffect(() => {
    // * onAuthStateChanged -> Listener ->  Always emit a event when auth state changes
    const onSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Logged in user
        setUser(user);
      } else {
        // Not Logged in user
        setUser(null);
      }
    });
    setLoading(false);

    return () => {
      onSub();
    };
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // * The signInWithGoogle working ->
  // * 1. promptAsync -> Gives us the prompt to login with Google Accounts. We get a Token and ID in return
  // * 2. Use that token,id,and GoogleAuthProvider we create a Credentials object
  // * 3. Using the Credentials object, signInWithCredential and Firebase auth we give all the info firebase need internally to identify the user who signed in.

  // const signInWithGoogle = async () => {
  //   setLoading(true);
  //   try {
  //     const logInResult = await promptAsync();
  //     if (logInResult.type === "success") {
  //       const { idToken, accessToken } = logInResult.authentication;
  //       const credential = GoogleAuthProvider.credential(idToken, accessToken);
  //       await signInWithCredential(auth, credential);
  //     }
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const updateUser = (user) => {
    setUser(user);
  };

  const memoedValues = {
    user,
    updateUser,
    signInWithGoogle,
    loading,
    error,
    logout,
  };

  return (
    <AuthContext.Provider value={memoedValues}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
