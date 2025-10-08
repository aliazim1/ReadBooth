import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key, value) => {
  try {
    const jsonVakue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonVakue);
  } catch (error) {
    alert(error);
  }
};

export const getData = async (key) => {
  try {
    const jsonVakue = await AsyncStorage.getItem(key);
    return jsonVakue != null ? JSON.parse(jsonVakue) : null;
  } catch (error) {
    alert(error);
  }
};
