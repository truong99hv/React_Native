import { Text, View } from "react-native";
import IconItlem from "./IconItlem";
import { useState } from "react";

const ListItem = ({ todo }) => {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);

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
  return (
    <View style={styles.listItem}>
      <View style={{ flex: 1 }}>
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
      {!todo.completed ? (
        <IconItlem
          IconName="done"
          bgColor="green"
          todo={() => markTodoComplete(todo.id)}
        />
      ) : (
        <IconItlem
          IconName="replay"
          bgColor="grey"
          todo={() => resetTodo(todo.id)}
        />
      )}

      <IconItlem
        IconName="delete"
        bgColor="red"
        todo={() => deleteTodo(todo.id)}
      />
    </View>
  );
};

export default ListItem;
