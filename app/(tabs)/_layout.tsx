import { Tabs } from "expo-router";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TabLayout() {

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Alarm",
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="clock-o" color={color} />,
                }}
            />
            <Tabs.Screen
                name="tracker"
                options={{
                    title: "Tracker",
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="circle" color={color} />,
                }}
            />
            
        </Tabs>
        )
}