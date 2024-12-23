import { View, Text } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { Input, Button } from "@ui-kitten/components";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { transform } from "@babel/core";

// const FormData = global.FormData;
const RestaurantForm = () => {
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [image, setImage] = useState<any>(null);

  const pickImage = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } catch (error) {}
  };

  const handleForm = async () => {
    if (!name || !address || !image) {
      alert("Please fill all fields and select an image!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name); // Append the name field
      formData.append("address", address); // Append the address field

      if (image?.uri) {
        formData.append("image", {
          uri: image.uri,
          type: "image/png",
          name: "restaurant-image",
        } as any);
      }
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // transformRequest: () => {
        //   return formData;
        // },
      };
      // Send the FormData object to the backend
      const response = await axios.post(
        "http://192.168.149.37:3000/add", // Your backend endpoint
        formData,
        config
      );

      // Handle success response
      console.log("Response:", response.data);
      alert("Restaurant registered successfully!");

      // Reset fields
      setName("");
      setAddress("");
      setImage(null);
    } catch (error) {
      // Handle errors
      console.error("Error adding restaurant:", error);
      alert("Failed to register restaurant. Please try again.");
    }
  };

  return (
    <View>
      <Text style={tw`text-2xl p-3`}>Register Restaurant</Text>
      <Input
        placeholder="Enter Restaurant Name"
        value={name}
        onChangeText={(val) => setName(val)}
        style={tw`m-3`}
        label={"Restaurant Name"}
      />
      <Input
        placeholder="Enter Restaurant Address"
        value={address}
        onChangeText={(val) => setAddress(val)}
        style={tw`m-3`}
        label={"Restaurant Address"}
      />
      <Button appearance="outline" style={tw`w-1/2 m-3`} onPress={pickImage}>
        Upload Image
      </Button>
      <Button appearance="filled" style={tw`w-1/2 m-3`} onPress={handleForm}>
        Submit
      </Button>
    </View>
  );
};

export default RestaurantForm;
