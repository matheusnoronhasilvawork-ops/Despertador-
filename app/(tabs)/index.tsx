import ParallaxScrollView from "@/default_app_project/components/parallax-scroll-view";
import { ThemedText } from "@/default_app_project/components/themed-text";
import { ThemedView } from "@/default_app_project/components/themed-view";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Component, useEffect, useState } from "react";
import { Switch, Touchable, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Alarm = {
id: number;
time: string;
label: string;
repeat: string;
enabled: boolean;
}
export default function alarmScreen() {
    
    const [alarms, setAlarms] = useState<Alarm[]>([])
    
    useEffect(() => {
        loadAlarms()
    }, [])

    async function loadAlarms() {
        const stored = await AsyncStorage.getItem('alarms');
        if (stored) {
            setAlarms(JSON.parse(stored))
        } else {
            setAlarms([
            {
                id: 1,
                time: "07:00",
                label: "Morning Alarm",
                repeat: "Everyday",
                enabled: true,
            },
            {
                id: 2,
                time: "08:30",
                label: "Workout Alarm",
                repeat: "Mon, Wed, Fri",
                enabled: false
            },
            {
                id: 3,
                time: "09:00",
                label: "Meeting Reminder",
                repeat: "Tue - Mon",
                enabled: true
            }
        ])
        }

    }

    async function updateAlarms(updateList: Alarm[]) {
        setAlarms(updateList)
        await AsyncStorage.setItem('alarms', JSON.stringify(updateList))
    }


    function changeStateAlarm(id: number, enabled: boolean) {
        updateAlarms(alarms.map(alarm => alarm.id === id ? { ...alarm, enabled } : alarm));
    }

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <FontAwesome
                    size={300}
                    color={"#1d3d47"}
                    style={{ position: 'absolute', bottom: -100, left: -30 }}
                    name="clock-o" />
            }>
            <ThemedView style={{ flex: 1, alignItems: "flex-start" }}>
                <ThemedText
                    type="title"
                    style={{ fontSize: 24, textAlign: 'center' }}>
                    Your Alarms
                </ThemedText>
                <ThemedView style={{ width: "100%", gap: 12, marginTop: 20 }}>
                    {alarms.map((alarm, index) => (
                        <ThemedView
                            key={index}
                            style={{ width: "100%", height: 120, padding: 12, elevation: 1, borderBottomColor: "#eee", borderBottomWidth: 4, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderRadius: 8 }}>
                            <ThemedView>
                                <ThemedText>{alarm.label}</ThemedText>
                                <ThemedText type="title" style={{ fontSize: 36 }}>{alarm.time}</ThemedText>
                            </ThemedView>
                            <ThemedView style={{ flexDirection: "column" }}>
                                <ThemedText style={{ fontSize: 12 }}>{alarm.repeat}</ThemedText>
                                <Switch
                                    value={alarm.enabled}
                                    onValueChange={(value) => changeStateAlarm(alarm.id, value)} />
                            </ThemedView>
                        </ThemedView>
                    ))}
                </ThemedView>
            </ThemedView>


        </ParallaxScrollView>
    )
}