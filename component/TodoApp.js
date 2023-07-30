import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  AsyncStorage,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import IconItem from "./IconItem";
import SearchBarCustom from "./SearchBarCustom";
import { CheckBox } from "react-native-elements";
import Toast from "react-native-toast-message";

const COLORS = {
  primary: "#1f145c",
  white: "#fff",
  complete: "#4D801A",
  grey: "#B2B6BC",
};

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState("");
  const [selectIndex, setSelectIndex] = useState("All");
  const [sortOrder, setSortOrder] = useState("ASC");

  useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);

  const addTodo = () => {
    if (textInput == "") {
      Alert.alert("Error", "Please input todo");
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      // setTodos([newTodo, ...todos]);
      setTextInput("");
      Keyboard.dismiss();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `New task added (${newTodo.task}) successfully.`,
        visibilityTime: 1500,
        autoHide: true,
        topOffset: 30,
        position: "top",
      });
    }
  };

  const saveTodoToUserDevice = async (todos) => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem("todos", stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodosFromUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem("todos");
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markTodoComplete = (todoId) => {
    const newTodosItem = todos.map((item) => {
      if (item.id == todoId) {
        return { ...item, completed: true };
      }
      return item;
    });

    setTodos(newTodosItem);
  };

  const resetTodo = (todoId) => {
    const resetTodos = todos.map((item) => {
      if (item.id == todoId) {
        return { ...item, completed: false };
      }
      return item;
    });

    setTodos(resetTodos);
  };

  const editTodo = (todoId, editedTask) => {
    const editedTodos = todos.map((item) => {
      if (item.id === todoId) {
        return { ...item, task: editedTask };
      }
      return item;
    });

    Toast.show({
      type: "info",
      text1: "Success",
      text2: `Successfully edited the task .`,
      visibilityTime: 1500,
      autoHide: true,
      topOffset: 30,
      position: "top",
    });
    setTodos(editedTodos);
  };

  const deleteTodo = (todoId) => {
    const newTodosItem = todos.filter((item) => item.id != todoId);
    Alert.alert("Confirm", "Remove todos?", [
      {
        text: "Yes",
        onPress: () => {
          setTodos(newTodosItem),
            Toast.show({
              type: "error",
              text1: "Success",
              text2: `Successfully deleted the task .`,
              visibilityTime: 1500,
              autoHide: true,
              topOffset: 30,
              position: "top",
            });
        },
      },
      {
        text: "No",
      },
    ]);
  };

  const clearAllTodos = () => {
    if (search === "" && selectIndex === "All") {
      Alert.alert("Confirm", "Clear all todos?", [
        {
          text: "Yes",
          onPress: () => setTodos([]),
        },
        {
          text: "No",
        },
      ]);
    } else {
      Alert.alert("Confirm", "Clear filtered todos?", [
        {
          text: "Yes",
          onPress: () => {
            const remainingTodos = todos.filter((todo) => {
              if (
                search !== "" &&
                !todo.task.toLowerCase().includes(search.toLowerCase())
              ) {
                return true;
              }
              if (selectIndex === "Done" && !todo.completed) {
                return true;
              }
              if (selectIndex === "Incomplete" && todo.completed) {
                return true;
              }
              return false;
            });
            setTodos(remainingTodos);
          },
        },
        {
          text: "No",
        },
      ]);
    }
  };

  const updateSearch = (search) => {
    setSearch(search);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
  };

  // const filterTasks = () => {
  //   if (search === "") {
  //     if (selectIndex === "Done") {
  //       return todos.filter((todo) => todo.completed);
  //     } else if (selectIndex === "Incomplete") {
  //       return todos.filter((todo) => !todo.completed);
  //     } else {
  //       return todos;
  //     }
  //   } else {
  //     let filteredBySearch = todos.filter((todo) =>
  //       todo.task.toLowerCase().includes(search.toLowerCase())
  //     );

  //     if (selectIndex === "Done") {
  //       return filteredBySearch.filter((todo) => todo.completed);
  //     } else if (selectIndex === "Incomplete") {
  //       return filteredBySearch.filter((todo) => !todo.completed);
  //     } else {
  //       return filteredBySearch;
  //     }
  //   }
  // };

  const filterTasks = () => {
    let filteredTasks = todos.slice();

    if (search !== "") {
      filteredTasks = filteredTasks.filter((todo) =>
        todo.task.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectIndex === "Done") {
      filteredTasks = filteredTasks.filter((todo) => todo.completed);
    } else if (selectIndex === "Incomplete") {
      filteredTasks = filteredTasks.filter((todo) => !todo.completed);
    }

    if (sortOrder === "ASC") {
      filteredTasks.sort((a, b) => a.task.localeCompare(b.task));
    } else if (sortOrder === "DESC") {
      filteredTasks.sort((a, b) => b.task.localeCompare(a.task));
    }

    return filteredTasks;
  };

  const updateSelectIndex = (index) => {
    setSelectIndex(index);
  };

  const ListItem = ({ todo }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedTask, setEditedTask] = useState(todo.task);

    const handleEdit = () => {
      if (!editMode) {
        setEditMode(true);
      } else {
        editTodo(todo.id, editedTask);
        setEditMode(false);
      }
    };

    return (
      <View style={styles.listItem}>
        {editMode ? (
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <TextInput
              value={editedTask}
              onChangeText={(text) => setEditedTask(text)}
              autoFocus
              onBlur={handleEdit}
              onSubmitEditing={handleEdit}
            />

            <IconItem
              IconName="done"
              bgColor={COLORS.complete}
              color={COLORS.white}
              todo={() => handleSort}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
            }}
          >
            <View style={{ marginRight: 10 }}>
              {!todo.completed ? (
                <IconItem
                  bgColor={COLORS.complete}
                  color={COLORS.white}
                  todo={() => markTodoComplete(todo.id)}
                />
              ) : (
                <IconItem
                  bgColor={COLORS.complete}
                  todo={() => resetTodo(todo.id)}
                  color={COLORS.white}
                  IconName="done"
                />
              )}
            </View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                color: todo.completed ? "grey" : COLORS.primary,
                textDecorationLine: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.task}
            </Text>
          </View>
        )}
        {editMode ? (
          ""
        ) : (
          <View style={styles.listIcon}>
            <IconItem
              IconName="edit"
              bgColor="blue"
              todo={handleEdit}
              color={COLORS.white}
            />

            <IconItem
              IconName="delete"
              bgColor="red"
              todo={() => deleteTodo(todo.id)}
              color={COLORS.white}
            />
          </View>
        )}
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View style={styles.header}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
            color: COLORS.primary,
          }}
        >
          TODO APP
        </Text>
      </View>
      {todos.length > 0 || filterTasks().length > 0 ? (
        <View>
          <SearchBarCustom
            textSearch={search}
            updateSearch={updateSearch}
            backgroundColor={COLORS.grey}
            placeholderTextColor={COLORS.primary}
            color={COLORS.primary}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginRight: 20,
              marginLeft: 20,
            }}
          >
            <CheckBox
              title="Done"
              checked={selectIndex === "Done"}
              onPress={() => updateSelectIndex("Done")}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
            />
            <CheckBox
              checked={selectIndex === "Incomplete"}
              title="Incomplete"
              onPress={() => updateSelectIndex("Incomplete")}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
            />
            <CheckBox
              checked={selectIndex === "All"}
              title="All"
              onPress={() => updateSelectIndex("All")}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
            />
          </View>
        </View>
      ) : (
        ""
      )}

      {todos.length === 0 || filterTasks().length === 0 ? (
        <Text style={{ marginLeft: 20, color: COLORS.complete, fontSize: 16 }}>
          No Task
        </Text>
      ) : (
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 15,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <Text
              style={{
                color: COLORS.complete,
                fontSize: 16,
              }}
            >
              Result: {filterTasks().length}
            </Text>

            <IconItem
              IconName="filter-alt"
              color={COLORS.primary}
              textName="Sort"
              todo={handleSort}
            />

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ marginRight: 5 }}>Clear All</Text>
              <Icon
                name="delete"
                size={25}
                color="red"
                onPress={clearAllTodos}
              />
            </View>
          </View>

          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20, paddingBottom: "auto" }}
            data={filterTasks()}
            renderItem={({ item }) => <ListItem todo={item} />}
          />
        </View>
      )}

      <View style={styles.footer}>
        <View style={[styles.inputContainer, isFocused && styles.inputFocused]}>
          <TextInput
            style={{ flex: 1 }}
            value={textInput}
            placeholder="Add Todo ..."
            onChangeText={(text) => setTextInput(text)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Icon name="add" color="white" size={30} />
          </View>
        </TouchableOpacity>
      </View>

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    paddingBottom: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },

  inputContainer: {
    height: 50,
    paddingHorizontal: 20,
    elevation: 40,
    backgroundColor: COLORS.white,
    flex: 1,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  inputFocused: {
    shadowColor: "blue",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    elevation: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  listIcon: { flexDirection: "row" },

  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },

  header: {
    marginTop: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: COLORS.primary,
    borderBottomWidth: 1,
  },
});
export default TodoApp;
