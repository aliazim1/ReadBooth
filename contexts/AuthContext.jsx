import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const setAuth = (authUser) => {
    setUser(authUser);
  };

  const setUserData = (userData) => {
    setUser({ ...userData });
  };

  // Register for push notifications when the user is set
  // useEffect(() => {
  //   if (!user) return;

  //   const registerForPushNotificationsAsync = async () => {
  //     try {
  //       let token;
  //       const { status: existingStatus } =
  //         await Notifications.getPermissionsAsync();
  //       let finalStatus = existingStatus;

  //       if (existingStatus !== "granted") {
  //         const { status } = await Notifications.requestPermissionsAsync();
  //         finalStatus = status;
  //       }

  //       if (finalStatus !== "granted") {
  //         alert("Failed to get push token for push notifications!");
  //         return;
  //       }

  //       token = (await Notifications.getExpoPushTokenAsync()).data;
  //       console.log("Push notification token:", token);

  //       // Save token to Supabase for this user
  //       await supabase
  //         .from("userPushTokens")
  //         .upsert({ userId: user.id, token }, { onConflict: ["userId"] });
  //     } catch (err) {
  //       console.log("Push notification registration error:", err);
  //     }
  //   };

  //   registerForPushNotificationsAsync();
  // }, [user]);

  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
