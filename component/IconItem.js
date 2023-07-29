import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
const COLORS = { primary: "#1f145c", white: "#fff" };
const IconItem = (props) => {
  const { bgColor, IconName, todo, color, textName } = props;
  return (
    <TouchableOpacity onPress={todo}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={[styles.actionIcon, { backgroundColor: bgColor }]}>
          <Icon name={IconName} size={20} color={color} />
        </View>
        <Text style={{ color: "#000", marginLeft: 5 }}>{textName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    marginLeft: 5,
    borderRadius: 3,
  },
});

export default IconItem;
