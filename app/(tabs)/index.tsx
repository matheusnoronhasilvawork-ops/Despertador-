import ParallaxScrollView from "@/default_app_project/components/parallax-scroll-view";
import { ThemedText } from "@/default_app_project/components/themed-text";
import { ThemedView } from "@/default_app_project/components/themed-view";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { Component, useEffect, useState } from "react";
import { Button, Pressable, SectionListComponent, Switch, TextInput, Touchable, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

type Alarm = {
    id: number;
    time: string;
    label: string;
    repeat: string;
    location: string;
    enabled: boolean;
}
export default function alarmScreen() {

    const [alarms, setAlarms] = useState<Alarm[]>([])
    const [isAddingAlarm, setIsAddingAlarm] = useState(false)
    const [alarmName, setAlarmName] = useState("")
    const [alarmTime, setAlarmTime] = useState(new Date())
    const [alarmRepeat, setAlarmRepeat] = useState("Everyday")
    const [showTimePicker, setShowTImePicker] = useState(false)
    const [locations, setLocations] = useState<string[]>([])
    const [deleteAlarmPopUp, setDeleteAlarmPopUp] = useState<number>()

    useEffect(() => {
        loadAlarms()
    }, [])

    async function loadAlarms() {
        const stored = await AsyncStorage.getItem('alarms');
        const parseStored = stored ? JSON.parse(stored) : [];
        if (parseStored.length > 0) {
            console.log("Loaded alarms from storage:", stored);
            setAlarms(parseStored)
        }

    }

    async function deleteAlarm(id: number) {

        const updatedAlarms = alarms.filter(alarm => alarm.id !== id)
        await AsyncStorage.setItem('alarms', JSON.stringify(updatedAlarms));

        setAlarms(updatedAlarms)

        setDeleteAlarmPopUp(undefined)
    }

    async function updateAlarms(updateList: Alarm[]) {
        setAlarms(updateList)
        await AsyncStorage.setItem('alarms', JSON.stringify(updateList))
    }


    function changeStateAlarm(id: number, enabled: boolean) {
        updateAlarms(alarms.map(alarm => alarm.id === id ? { ...alarm, enabled } : alarm));
    }

    async function handleAddAlarm() {

        const stored = await AsyncStorage.getItem('alarms')
        const parseStored = stored ? JSON.parse(stored) : []

        if (parseStored.length > 0) {

            const newId = parseStored.length > 1 ? Math.max(...parseStored.map((alarm: Alarm) => alarm.id)) + 1 : 1

            const newAlarm: Alarm = {
                id: newId,
                time: alarmTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                label: alarmName,
                repeat: alarmRepeat,
                location: "Home",
                enabled: true,
            }

            const updatedAlarms = [...parseStored, newAlarm]
            await AsyncStorage.setItem('alarms', JSON.stringify(updatedAlarms))

            setIsAddingAlarm(false)
            loadAlarms()
        }
    }

    return (
        <>
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
                    {!isAddingAlarm ? (
                        <>
                            <ThemedText
                                type="title"
                                style={{ fontSize: 24, textAlign: 'center' }}>
                                Your Alarms
                            </ThemedText>
                            <ThemedView style={{ width: "100%", gap: 12, marginTop: 20 }}>
                                <TouchableOpacity onPress={() => { setDeleteAlarmPopUp(undefined), setIsAddingAlarm(true) }} style={{ width: "100%", height: 60, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <FontAwesome name="plus" size={30} color={"#A1CEDC"} />
                                    <ThemedText style={{ fontSize: 12, fontWeight: "bold" }}> Create new alarm</ThemedText>
                                </TouchableOpacity>
                                {alarms.map((alarm, index) => (
                                    <Pressable
                                        onLongPress={() => setDeleteAlarmPopUp(alarm.id)}
                                        key={index}
                                        style={{ width: "100%", height: 120, padding: 12, borderBottomColor: "#eee", borderBottomWidth: 4, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderRadius: 8 }}>
                                        <ThemedView>
                                            <ThemedText>{alarm.label}</ThemedText>
                                            <ThemedText type="title" style={{ fontSize: 36 }}>{alarm.time}</ThemedText>
                                            <ThemedText style={{ fontSize: 12 }}> Going to: Home</ThemedText>
                                        </ThemedView>
                                        <ThemedView style={{ flexDirection: "column" }}>
                                            <ThemedText style={{ fontSize: 12 }}>{alarm.repeat}</ThemedText>
                                            <Switch
                                                value={alarm.enabled}
                                                onValueChange={(value) => changeStateAlarm(alarm.id, value)} />
                                        </ThemedView>
                                        {deleteAlarmPopUp === alarm.id && (
                                            <ThemedView style={{ alignItems: "center", position: "absolute", left: 60, top: 30, backgroundColor: "white", borderWidth: 2, borderRadius: 8, borderColor: "#c6c6c6ff", height: 100, width: 160 }}>
                                                <ThemedText>Delete?</ThemedText>
                                                <ThemedView>
                                                    <TouchableOpacity onPress={() => deleteAlarm(alarm.id)}>
                                                        <ThemedText>Yes</ThemedText>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => setDeleteAlarmPopUp(undefined)}>
                                                        <ThemedText style={{ color: "red" }}>No</ThemedText>
                                                    </TouchableOpacity>
                                                </ThemedView>
                                            </ThemedView>
                                        )}
                                    </Pressable>
                                ))}
                            </ThemedView>

                        </>
                    ) : (
                        <>
                            <ThemedText
                                type="title"
                                style={{ fontSize: 24, textAlign: 'center' }}>
                                Create new alarm
                            </ThemedText>
                            <ThemedView style={{ flex: 1, width: "100%" }}>
                                <ThemedText
                                    type="subtitle"
                                    style={{ fontSize: 16 }}>
                                    Alarm's name
                                </ThemedText>
                                <TextInput
                                    style={{ borderBottomColor: "#1d3d47", borderBottomWidth: 2, paddingBottom: 8, marginBottom: 16, width: "100%" }}
                                    value={alarmName}
                                    onChangeText={setAlarmName} />
                                <ThemedView style={{ flexDirection: "row", width: "100%", height: 80, alignItems: "center", gap: 30 }}>
                                    <ThemedView style={{ paddingBottom: 6, borderBlockColor: "#1d3d47", borderBottomWidth: 2, flex: 1, flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                                        <ThemedText
                                            type="subtitle"
                                            style={{ fontSize: 16 }}>
                                            Alarm's time
                                        </ThemedText>
                                        <ThemedView style={{ flexDirection: "row", gap: 12 }}>
                                            <ThemedText>{alarmTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</ThemedText>
                                            <TouchableOpacity style={{ backgroundColor: "#A1CEDC", borderRadius: 8, paddingInline: 8 }} onPressOut={() => setShowTImePicker(true)}>
                                                <ThemedText style={{ fontSize: 12 }}>Select time</ThemedText>
                                            </TouchableOpacity>
                                        </ThemedView>
                                        {showTimePicker && (
                                            <DateTimePicker
                                                mode="time"
                                                value={alarmTime}
                                                onChange={(event, selectedTime) => {
                                                    if (event.type === "set" && selectedTime) {
                                                        setAlarmTime(selectedTime)
                                                        setShowTImePicker(false)
                                                    } else {
                                                        setIsAddingAlarm(false)
                                                    }
                                                }}
                                                is24Hour />
                                        )}
                                    </ThemedView>
                                    <ThemedView style={{ borderBottomWidth: 2, borderBottomColor: "#1d3d47", paddingBottom: 50, flex: 1, height: "100%", justifyContent: "space-between" }}>
                                        <ThemedText
                                            type="subtitle"
                                            style={{ fontSize: 16 }}>
                                            Alarm's repeat on:
                                        </ThemedText>
                                        <Picker mode="dialog" itemStyle={{ fontSize: 2 }} style={{}} selectedValue={""} onValueChange={(itemValue, itemIndex) => {
                                            setAlarmRepeat(itemValue)
                                        }}>
                                            <Picker.Item label="Everyday" value={"everyday"} />
                                            <Picker.Item label="Weekdays" value={"weekdays"} />
                                            <Picker.Item label="Weekends" value={"weekends"} />
                                            <Picker.Item label="Monday" value={"mon"} />
                                            <Picker.Item label="Tuesday" value={"tue"} />
                                            <Picker.Item label="Wednesday" value={"wed"} />
                                            <Picker.Item label="Thursday" value={"thu"} />
                                            <Picker.Item label="Friday" value={"fri"} />
                                            <Picker.Item label="Saturday" value={"Sat"} />
                                            <Picker.Item label="Sunday" value={"Sun"} />
                                        </Picker>
                                    </ThemedView>
                                </ThemedView>
                                <ThemedView style={{ flexDirection: "column", borderBottomColor: "#1d3d47", borderBottomWidth: 2, gap: 6 }}>
                                    <ThemedText
                                        type="subtitle"
                                        style={{ fontSize: 16, marginTop: 16 }}>
                                        Choose a place to go
                                    </ThemedText>
                                    {locations.length === 0 ? (
                                        <ThemedText> There is no places available</ThemedText>
                                    ) : (
                                        <Picker style={{}} selectedValue={""} onValueChange={(itemValue, itemIndex) => { }}>
                                            <Picker.Item label="Home" value="home" />
                                            <Picker.Item label="Work" value="work" />
                                            <Picker.Item label="Gym" value="gym" />
                                            <Picker.Item label="School" value="school" />
                                        </Picker>
                                    )}
                                </ThemedView>
                                <ThemedView style={{ marginTop: 60, gap: 8 }}>
                                    <TouchableOpacity onPress={() => handleAddAlarm()} style={{ alignItems: "center", backgroundColor: "#1d3d47", borderRadius: 8, padding: 12 }}>
                                        <ThemedText style={{ color: "white" }}> Save Alarm </ThemedText>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ alignItems: "center", borderColor: "#1d3d47", borderWidth: 2, borderRadius: 8, padding: 12 }} onPress={() => setIsAddingAlarm(false)}>
                                        <ThemedText> Cancel</ThemedText>
                                    </TouchableOpacity>
                                </ThemedView>

                            </ThemedView>
                        </>
                    )}
                </ThemedView>


            </ParallaxScrollView>
        </>
    )
}