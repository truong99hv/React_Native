import { SearchBar } from "react-native-elements";
import { View } from "react-native";

const SearchBarCustom = (props) => {
  const {
    textSearch,
    updateSearch,
    backgroundColor,
    placeholderTextColor,
    color,
  } = props;
  return (
    <SearchBar
      placeholder="Search..."
      value={textSearch}
      onChangeText={updateSearch}
      containerStyle={{
        backgroundColor: 0,
        borderBottomWidth: 0,
        borderTopWidth: 0,
        paddingHorizontal: 0,
      }}
      inputContainerStyle={{
        backgroundColor: backgroundColor,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 30,
      }}
      inputStyle={{
        color: color,
      }}
      placeholderTextColor={placeholderTextColor}
    />
  );
};

export default SearchBarCustom;
