import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../backend/config";
import { Calendar } from "react-native-calendars";
import { AntDesign } from "@expo/vector-icons";

import { useState, useEffect } from "react";

export default function DatesScreen({
  setSelectedTime,
  selectedTime,
  author,
  setPage,
  handleConfirm
}) {
  const [calendar, setCalendar] = useState();
  const [selected, setSelected] = useState();
  const [availableTimes, setAvailableTimes] = useState([]);
  const [markedDates, setMarkedDates] = useState();

  function getMarked() {
    const marked = {
      [selected]: {
        disableTouchEvent: true,
        selected: true,
      },
    };
    calendar?.map((cal) => {
      if (cal.available) {
        marked[cal.date] = { marked: true, selected: selected == cal.date };
      }
    });
    setMarkedDates(marked);
  }

  function getTimes() {
    let times = [];

    for (let i = 0; i < calendar?.length; i++) {
      if (calendar[i].date === selected) {
        times = calendar[i]?.availableTimes;
      }
    }

    return times;
  }

  function formatSelected() {
    const date = new Date(selectedTime.date);
    const options = { day: 'numeric', month: 'long', year: "numeric", timeZone: 'UTC' };
    const formattedDate = date.toLocaleDateString("en-US", options); 
    
    return`${formattedDate} at ${convertTime(selectedTime.time)}`;
  }

  const convertTime = (time) => {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];

    return (
      (hour <= 12 && `${hour}:${minute} ${(hour == 12 && "pm") || "am"}`) ||
      `${hour - 12}:${minute} pm`
    );
  };

  useEffect(() => {
    if (author) {
      const businessRef = doc(db, "users", author);
      const docUnsubscribe = onSnapshot(businessRef, (docSnap) => {
        if (docSnap.exists()) {
          setCalendar(docSnap.data().calendar);
        } else {
          console.log("User not found");
        }
      });

      return () => docUnsubscribe();
    }
  }, [author]);

  useEffect(() => {
    setAvailableTimes(getTimes());
    getMarked();
  }, [selected, calendar]);

  const customTheme = {
    backgroundColor: "white",
    calendarBackground: "white",
    textSectionTitleColor: "#000000",
    selectedDayBackgroundColor: "#FF776D",
    selectedDayTextColor: "#FFFFFF",
    todayTextColor: "#FF776D",
    dayTextColor: "#000000",
    textDisabledColor: "#BFBFBF",
    dotColor: "#FF776D",
    selectedDotColor: "#FFFFFF",
    arrowColor: "black",
    monthTextColor: "#000000",
    indicatorColor: "#FF776D",
  };

  return (
    <View className="flex w-full items-center justify-between h-3/4">
      <View className="mb-5">
        <Calendar
          onDayPress={(day) => {
            setSelected(day.dateString);
          }}
          style={{ height: 350, width: 350 }}
          markedDates={markedDates}
          theme={customTheme}
          key="Hi"
        />
      </View>

      {availableTimes && (
        <View className="w-full flex items-center justify-center">
          {(selectedTime && (
            <Text className="text-center font-bold">
              You've selected {formatSelected()}
            </Text>
          )) || (
            <Text className="">
              Available Times (tap on a time to select it)
            </Text>
          )}

          <FlatList
            data={availableTimes}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedTime({ date: selected, time: item })}
                className={`${
                  selectedTime && selectedTime.time == item && "bg-tomato"
                } rounded-full h-8 flex flex-row m-1 items-center justify-between p-1`}
                style={{
                  borderColor: "#ED6E65",
                  borderStyle: "solid",
                  borderWidth: 1,
                }}
              >
                <Text
                  className={`${
                    (selectedTime &&
                      selectedTime.time == item &&
                      "text-white") ||
                    "text-tomato"
                  } font-semibold mr-1`}
                >
                  {convertTime(item)}
                </Text>
              </TouchableOpacity>
            )}
            //Setting the number of columns
            className="w-full pl-8 mt-2 h-10"
            numColumns={2}
          />
        </View>
      )}

      <View className="w-full">
          <View className="flex flex-row w-full justify-between px-10">
            <View>
              <TouchableOpacity
                className="flex justify-center items-center"
                onPress={() => setPage(1)}
              >
                <View className="flex flex-row justify-center items-center gap-x-3">
                  <AntDesign name="arrowleft" size={30} color="black" />
                  <Text className="text-xl font-semibold text-black">Back</Text>
                </View>
              </TouchableOpacity>
            </View>

            {selectedTime && <View>
              <TouchableOpacity
                className="flex justify-center items-center"
                onPress={handleConfirm}
              >
                <View className="flex flex-row justify-center items-center gap-x-3">
                  <Text
                    className="text-xl font-bold text-cherry
      "
                  >
                    Confirm
                  </Text>
                  <AntDesign name="arrowright" size={30} color="#D8473D" />
                </View>
              </TouchableOpacity>
            </View>}
          </View>

      </View>
    </View>
  );
}
