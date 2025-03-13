import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import { ProgressBar } from 'react-native-paper';
import { Audio } from 'expo-av';
import { CurrencyContext } from '../context/CurrencyContext';
import GlobalStyles from '../styles/GlobalStyles';

// =======================
// Task Item Component (Single Task)
// =======================
const TaskItem = ({ task, index, handleCompletion }) => (
  <View style={styles.taskContainer}>
    <TouchableOpacity onPress={() => handleCompletion(index)} style={GlobalStyles.button}>
      <Text style={GlobalStyles.buttonText}>
        {task.completed ? '✔ Done' : '➤ Complete'}
      </Text>
    </TouchableOpacity>
    <Text style={[GlobalStyles.text, styles.taskText]}>{task.task}</Text>
  </View>
);

// =======================
// Task List Component (Full Task List + Progress Bar)
// =======================
const TaskList = ({ tasks, handleCompletion, completedTasks, totalTasks }) => (
  <View>
    <Text style={[GlobalStyles.text, styles.title]}>Tasks</Text>
    <ProgressBar progress={totalTasks > 0 ? completedTasks / totalTasks : 0} />
    <Text style={GlobalStyles.text}>
      {completedTasks}/{totalTasks} tasks completed
    </Text>
    {tasks.map((task, index) => (
      <TaskItem key={index} task={task} index={index} handleCompletion={handleCompletion} />
    ))}
  </View>
);

// =======================
// Reset Tasks Modal Component
// =======================
const ResetTasksModal = ({ visible, onClose, onConfirm }) => {
  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    if (password === 'overlorddad') { // Change this to your actual password
      onConfirm();
      onClose();
    } else {
      Alert.alert('Incorrect Password', 'Try again.');
    }
    setPassword('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enter Password to Reset Tasks</Text>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={GlobalStyles.button} onPress={handleConfirm}>
              <Text style={GlobalStyles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={GlobalStyles.button} onPress={onClose}>
              <Text style={GlobalStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// =======================
// Main TaskManagerScreen
// =======================
export function TaskManagerScreen() {
  const { currency, rewardCurrency } = useContext(CurrencyContext);
  const totalTasks = 7;

  const [completedTasks, setCompletedTasks] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiLoop, setConfettiLoop] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [tasks, setTasks] = useState([
    { task: 'Do homework', completed: false },
    { task: 'Clean room', completed: false },
    { task: 'Read for 10 minutes', completed: false },
    { task: 'Play with Penelope', completed: false },
    { task: 'Leave Penelope alone', completed: false },
    { task: 'Jujitsu', completed: false },
    { task: 'Eat Fruit', completed: false }, 
  ]);
  const [resetModalVisible, setResetModalVisible] = useState(false);

  const taskCompleteSound = useRef(null);

  // =======================
  // AUDIO SETUP (MP3)
  // =======================
  useEffect(() => {
    async function setupAudio() {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          staysActiveInBackground: true,
          playThroughEarpieceAndroid: false,
        });

        if (taskCompleteSound.current) {
          await taskCompleteSound.current.unloadAsync();
        }

        taskCompleteSound.current = new Audio.Sound();
        await taskCompleteSound.current.loadAsync(
          require('../assets/sounds/TaskComplete.mp3'),
          { shouldPlay: false }
        );
        console.log('Sound loaded and audio mode set');
      } catch (error) {
        console.error('Error setting up audio:', error);
      }
    }

    setupAudio();
    return () => {
      if (taskCompleteSound.current) {
        taskCompleteSound.current.unloadAsync();
      }
    };
  }, []);

  const playCompletionSound = async () => {
    if (taskCompleteSound.current) {
      try {
        await taskCompleteSound.current.setPositionAsync(0);
        await taskCompleteSound.current.playAsync();
        console.log('Sound played successfully');
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
  };

  // =======================
  // HANDLE TASK COMPLETION
  // =======================
  const handleCompletion = (index) => {
    setTasks((prevTasks) => {
      if (prevTasks[index].completed) return prevTasks;
      const newTasks = prevTasks.map((t, i) =>
        i === index ? { ...t, completed: true } : t
      );
      setCompletedTasks(newTasks.filter((t) => t.completed).length);
      rewardCurrency();
      playCompletionSound();
      setShowConfetti(true);
      setConfettiLoop(completedTasks + 1 === totalTasks);
      setConfettiKey((prevKey) => prevKey + 1);
      return newTasks;
    });
  };

  const stopConfetti = () => {
    setShowConfetti(false);
    setConfettiLoop(false);
  };

  const resetDailyTasks = () => {
    setTasks(tasks.map(task => ({ ...task, completed: false })));
    setCompletedTasks(0);
  };

  return (
    <View style={GlobalStyles.container}>
      {confettiLoop && (
        <TouchableOpacity style={styles.clearButtonContainer} onPress={stopConfetti}>
          <Text style={GlobalStyles.buttonText}>X</Text>
        </TouchableOpacity>
      )}

      <View style={{ flex: 1 }}>
        <Text style={styles.currencyText}>Dad Dollars: {currency}</Text>

        <TaskList
          tasks={tasks}
          handleCompletion={handleCompletion}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
        />
        
          <TouchableOpacity style={GlobalStyles.button} onPress={() => setResetModalVisible(true)}>
            <Text style={GlobalStyles.buttonText}>Parent Daily Task Reset Button</Text>
          </TouchableOpacity>
      </View>

      <ResetTasksModal
        visible={resetModalVisible}
        onClose={() => setResetModalVisible(false)}
        onConfirm={resetDailyTasks}
      />

      {showConfetti && (
        <LottieView key={confettiKey} source={require('../assets/confetti/animations/confetti.json')} autoPlay loop={confettiLoop} style={styles.confetti} />
      )}
    </View>
  );
}

// =======================
// Styles
// =======================
const styles = StyleSheet.create({
  currencyText: { fontSize: 40, fontFamily: 'DynaPuff-Bold', textAlign: 'center', marginBottom: 10 },
  taskContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  taskText: { fontSize: 20, color: '#333' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { padding: 20, backgroundColor: 'white', borderRadius: 10 },
});

export default TaskManagerScreen;
