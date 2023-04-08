import {View,Image, ImageBackground} from "react-native"

const NavModal = ({page}) => {
    const NavItemUnselected = ({ source}) => {
        return (
          <ImageBackground
            source={require("../../../assets/dotted-circle.png")}
            resizeMode="cover"
            className={`w-20 h-20 px-1 items-center flex flex-row justify-center`}
          >
            <Image source={source} style={{ width: 40, height: 40 }} />
          </ImageBackground>
        );
      };
    
      const NavItemSelected = ({ source, bgColor}) => {
        return (
          <View
            className={`w-20 h-20 px-1 items-center rounded-full bg-${bgColor} shadow-lg flex flex-row justify-center`}
          >
            <Image source={source} style={{ width: 40, height: 40 }} />
          </View>
        );
      };
    return (
      <View className="w-full h-24 flex flex-row items-center justify-between p-4">
        <NavItemSelected
          source={require("../../../assets/icons/box-w.png")}
          bgColor={"tomato"}
        />

        <Image
          source={require("../../../assets/border-tomato.png")}
          style={{ width: 40, height: 12 }}
        />

        {page >= 2 ? (
          <NavItemSelected
            source={require("../../../assets/icons/calendar-white.png")}
            bgColor={"black"}
          />
        ) : (
          <NavItemUnselected
            source={require("../../../assets/icons/calendar.png")}
          />
        )}

        <Image
          source={require("../../../assets/border-warm.png")}
          style={{ width: 40, height: 12 }}
        />

        {page == 3 ? (
          <NavItemSelected
            source={require("../../../assets/icons/present-white.png")}
            bgColor={"warm"}
          />
        ) : (
          <NavItemUnselected
            source={require("../../../assets/icons/present.png")}
          />
        )}
      </View>
    );
  };

  export {NavModal}
