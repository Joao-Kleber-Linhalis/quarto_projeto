import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Home from "./src/Home";
import FormProduto from "./src/FormProduto";

const App = function (){

  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home}></Stack.Screen>
        <Stack.Screen name="Cadastro" component={FormProduto}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;