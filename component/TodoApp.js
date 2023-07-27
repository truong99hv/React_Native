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
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import IconItem from "./IconItem";

const COLORS = { primary: "#1f145c", white: "#fff", complete: "#4D801A" };

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState(false);

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
      setTextInput("");
      Keyboard.dismiss();
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

    setTodos(editedTodos);
  };

  const deleteTodo = (todoId) => {
    const newTodosItem = todos.filter((item) => item.id != todoId);
    Alert.alert("Confirm", "Remove todos?", [
      {
        text: "Yes",
        onPress: () => setTodos(newTodosItem),
      },
      {
        text: "No",
      },
    ]);
  };

  const clearAllTodos = () => {
    Alert.alert("Confirm", "Clear todos?", [
      {
        text: "Yes",
        onPress: () => setTodos([]),
      },
      {
        text: "No",
      },
    ]);
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

            <IconItem IconName="done" bgColor={COLORS.complete} />
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
                  IconName="done"
                  bgColor={COLORS.complete}
                  todo={() => markTodoComplete(todo.id)}
                />
              ) : (
                <IconItem
                  bgColor={COLORS.complete}
                  todo={() => resetTodo(todo.id)}
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
            <IconItem IconName="edit" bgColor="blue" todo={handleEdit} />

            <IconItem
              IconName="delete"
              bgColor="red"
              todo={() => deleteTodo(todo.id)}
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
        <Icon name="delete" size={25} color="red" onPress={clearAllTodos} />
      </View>

      <View style={styles.filter}>
        <View style={styles.search}>
          <IconItem IconName="search" bgColor="grey" />
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        data={todos}
        renderItem={({ item }) => <ListItem todo={item} />}
      />

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 10,
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
  },
});
export default TodoApp;
