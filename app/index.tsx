import { useState } from "react";
import {
  FlatList,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (input.trim() === "") return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: input.trim(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setInput("");
    Keyboard.dismiss();
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const remaining = tasks.filter((task) => !task.completed).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      <View style={styles.header}>
        <Text style={styles.greeting}>MY PRODUCTIVITY</Text>
        <Text style={styles.heading}>My Todo List</Text>
        <Text style={styles.subtitle}>
          Organize your day, one task at a time.
        </Text>

        <View style={styles.counterBox}>
          <Text style={styles.counterNumber}>{remaining}</Text>
          <Text style={styles.counterText}>Tasks Remaining</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Add a New Task</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="What needs to be done?"
            placeholderTextColor="#9CA3AF"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={addTask}
          />

          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Today's Tasks ({tasks.length})</Text>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No tasks yet. Add your first task!
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <TouchableOpacity
                style={[styles.checkbox, item.completed && styles.checkedBox]}
                onPress={() => toggleTask(item.id)}
              >
                <Text style={styles.checkText}>
                  {item.completed ? "✓" : ""}
                </Text>
              </TouchableOpacity>

              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.completedText,
                ]}
              >
                {item.title}
              </Text>

              <TouchableOpacity
                onPress={() => deleteTask(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <Text style={styles.footer}>Stay Focused. Stay Productive.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    backgroundColor: "#111827",
    padding: 25,
    paddingTop: 55,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  greeting: {
    color: "#A5B4FC",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    color: "#D1D5DB",
    fontSize: 14,
    marginTop: 8,
  },
  counterBox: {
    backgroundColor: "#312E81",
    padding: 18,
    borderRadius: 16,
    marginTop: 25,
  },
  counterNumber: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
  },
  counterText: {
    color: "#C7D2FE",
    fontSize: 13,
    marginTop: 3,
  },
  content: {
    flex: 1,
    padding: 22,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 12,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  addButton: {
    backgroundColor: "#4F46E5",
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  list: {
    paddingBottom: 15,
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  checkbox: {
    width: 23,
    height: 23,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
  },
  checkedBox: {
    backgroundColor: "#4F46E5",
  },
  checkText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  taskText: {
    flex: 1,
    color: "#1F2937",
    fontSize: 14,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  deleteButton: {
    padding: 7,
  },
  deleteText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 35,
    fontSize: 14,
  },
  footer: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    padding: 15,
  },
});
