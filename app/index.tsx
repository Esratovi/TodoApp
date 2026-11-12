import { useState } from "react";
import {
  FlatList,
  Keyboard,
  Platform,
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

type Filter = "all" | "active" | "done";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "done", label: "Done" },
];

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [focused, setFocused] = useState(false);

  const addTask = () => {
    const title = input.trim();
    if (!title) return;
    setTasks((prev) => [
      { id: Date.now().toString(), title, completed: false },
      ...prev,
    ]);
    setInput("");
    Keyboard.dismiss();
  };

  const toggleTask = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );

  const deleteTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const clearCompleted = () =>
    setTasks((prev) => prev.filter((t) => !t.completed));

  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.completed).length;
  const remaining = total - doneCount;
  const progress = total === 0 ? 0 : (doneCount / total) * 100;

  const visibleTasks = tasks.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.completed : t.completed,
  );

  const emptyMessage =
    total === 0
      ? "No tasks yet.\nAdd your first task above!"
      : filter === "active"
        ? "All caught up! 🎉"
        : "Nothing completed yet.";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <Text style={styles.greeting}>MY PRODUCTIVITY</Text>
        <Text style={styles.heading}>My Todo List</Text>
        <Text style={styles.subtitle}>
          Organize your day, one task at a time.
        </Text>

        <View style={styles.counterBox}>
          <View style={styles.counterTop}>
            <View>
              <Text style={styles.counterNumber}>{remaining}</Text>
              <Text style={styles.counterText}>Tasks Remaining</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {doneCount}/{total} done
              </Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Add a New Task</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, focused && styles.inputFocused]}
            placeholder="What needs to be done?"
            placeholderTextColor="#9CA3AF"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={addTask}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={addTask}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.chip, filter === f.key && styles.chipActive]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  filter === f.key && styles.chipTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Today's Tasks ({total})</Text>
          {doneCount > 0 && (
            <TouchableOpacity onPress={clearCompleted}>
              <Text style={styles.clearText}>Clear completed</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={visibleTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>📝</Text>
              <Text style={styles.emptyText}>{emptyMessage}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={[styles.taskCard, item.completed && styles.taskCardDone]}
            >
              <View
                style={[styles.accent, item.completed && styles.accentDone]}
              />

              <TouchableOpacity
                style={[styles.checkbox, item.completed && styles.checkedBox]}
                onPress={() => toggleTask(item.id)}
                activeOpacity={0.7}
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
                activeOpacity={0.7}
              >
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <Text style={styles.footer}>Stay Focused. Stay Productive. ✨</Text>
    </View>
  );
}

const shadow = Platform.select({
  web: { boxShadow: "0px 4px 14px rgba(17, 24, 39, 0.08)" } as object,
  default: {
    shadowColor: "#111827",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },

  header: {
    backgroundColor: "#0F172A",
    padding: 24,
    paddingTop: 56,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  glowOne: {
    position: "absolute",
    top: -60,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#6366F1",
    opacity: 0.25,
  },
  glowTwo: {
    position: "absolute",
    bottom: -70,
    left: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#EC4899",
    opacity: 0.15,
  },
  greeting: {
    color: "#A5B4FC",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 3,
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 8,
  },
  subtitle: { color: "#CBD5E1", fontSize: 14, marginTop: 6 },

  counterBox: {
    backgroundColor: "rgba(99, 102, 241, 0.28)",
    borderWidth: 1,
    borderColor: "rgba(165, 180, 252, 0.35)",
    padding: 18,
    borderRadius: 20,
    marginTop: 22,
  },
  counterTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counterNumber: { color: "#FFFFFF", fontSize: 38, fontWeight: "800" },
  counterText: { color: "#C7D2FE", fontSize: 13, marginTop: 2 },
  badge: {
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
  progressTrack: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 4,
    marginTop: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    backgroundColor: "#34D399",
    borderRadius: 4,
  },

  content: { flex: 1, paddingHorizontal: 22, paddingTop: 10 },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 12,
    marginTop: 12,
  },
  inputRow: { flexDirection: "row", gap: 10 },
  input: {
    flex: 1,
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    color: "#0F172A",
    ...shadow,
  },
  inputFocused: { borderColor: "#6366F1" },
  addButton: {
    backgroundColor: "#4F46E5",
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: -2,
  },

  filterRow: { flexDirection: "row", gap: 8, marginTop: 18 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  chipActive: { backgroundColor: "#4F46E5" },
  chipText: { color: "#4B5563", fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: "#FFFFFF" },

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clearText: { color: "#EF4444", fontSize: 13, fontWeight: "700" },

  list: { paddingBottom: 20 },
  taskCard: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingRight: 12,
    paddingLeft: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
    overflow: "hidden",
    ...shadow,
  },
  taskCardDone: { opacity: 0.75 },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: "#6366F1",
  },
  accentDone: { backgroundColor: "#34D399" },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
  },
  checkedBox: { backgroundColor: "#34D399", borderColor: "#34D399" },
  checkText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 14 },
  taskText: { flex: 1, color: "#1F2937", fontSize: 15, fontWeight: "500" },
  completedText: { textDecorationLine: "line-through", color: "#9CA3AF" },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: { color: "#EF4444", fontSize: 13, fontWeight: "bold" },

  emptyBox: { alignItems: "center", marginTop: 30 },
  emptyEmoji: { fontSize: 44 },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
  },

  footer: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    padding: 14,
  },
});
