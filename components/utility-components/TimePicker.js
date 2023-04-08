import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const TimePicker = () => {
  const [selectedHour, setSelectedHour] = useState("01");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedAmPm, setSelectedAmPm] = useState("AM");

  const [MOpen, setMOpen] = useState(false)
  const [HOpen, setHOpen] = useState(false)
  const [open, setOpen] = useState(false)

  const hours = Array.from({ length: 12 }, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString(),
  }));
  const minutes = Array.from({ length: 60 }, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString(),
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Time: </Text>
      <View style={styles.pickerContainer}>
        <DropDownPicker
          items={hours}
          open={HOpen}
          setOpen={setHOpen}
          value={selectedHour}
          containerStyle={[styles.picker, { height: 50 }]}
          itemStyle={styles.pickerItem}
          dropDownStyle={styles.dropDown}
          setValue={setSelectedHour}
        />
        <Text style={styles.separator}>:</Text>
        <DropDownPicker
          items={minutes}
          open={MOpen}
          setOpen={setMOpen}
          value={selectedMinute}
          setValue={setSelectedMinute}
          containerStyle={[styles.picker, { height: 50 }]}
          itemStyle={styles.pickerItem}
          dropDownStyle={styles.dropDown}
    
        />
        <DropDownPicker
          items={[
            { label: "AM", value: "AM" },
            { label: "PM", value: "PM" },
          ]}
          value={selectedAmPm}
          open={open}
          setOpen={setOpen}
          containerStyle={[styles.picker, { height: 50 }]}
          itemStyle={styles.pickerItem}
          dropDownStyle={styles.dropDown}
          setValue={setSelectedAmPm}
          showArrow={false}
        />
      </View>
      <Text style={styles.selectedTime}>
        Selected Time:{" "}
        {`${selectedHour}:${
          (selectedMinute < "10" && "0" + selectedMinute) || selectedMinute
        } ${selectedAmPm}`}
      </Text>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  label: {
    fontSize: 15,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  picker: {
    width: 75,
    marginHorizontal: 5,
  },
  pickerItem: {
    justifyContent: "flex-start",
    color: "white"
  },
  separator: {
    fontSize: 24,
    marginHorizontal: 5,
  },
  selectedTime: {
    fontSize: 18,
  },
  dropDown: {
    backgroundColor: "#fafafa",
  },
});

export default TimePicker;

