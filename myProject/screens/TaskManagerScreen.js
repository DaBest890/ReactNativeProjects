import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { ProgressBar } from 'react-native-paper';
import { Audio } from 'expo-av';
import { CurrencyContext } from '../context/CurrencyContext';
import GlobalStyles from '../styles/GlobalStyles';

export function TaskManagerScreen() {
  const { currency, rewardCurrency, spendCurrency, resetCurrency } = useContext(CurrencyContext);
  const totalTasks = 5;

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
  ]);

  const taskCompleteSound = useRef(null);

  // Removed the daily reset check from TaskManagerScreen.
  // Currency reset is handled in CurrencyContext globally.

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
          require('../assets/sounds/cashregisterpurchase.mp3'),
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
  // HANDLE TASK COMPLETION (One-Way)
  // =======================
  const handleCompletion = (index) => {
    setTasks((prevTasks) => {
      // Only mark the task as completed if it's not already completed
      if (prevTasks[index].completed) return prevTasks;
      const newTasks = prevTasks.map((t, i) =>
        i === index ? { ...t, completed: true } : t
      );
      const newCompletedCount = newTasks.filter((t) => t.completed).length;
      setCompletedTasks(newCompletedCount);
      // Reward currency only once per task completion
      rewardCurrency();
      playCompletionSound();
      setShowConfetti(false);
      setConfettiKey((prevKey) => prevKey + 1);
      if (newCompletedCount < totalTasks) {
        setConfettiLoop(false);
        setShowConfetti(true);
      } else {
        setConfettiLoop(true);
        setShowConfetti(true);
      }
      return newTasks;
    });
  };

  const stopConfetti = () => {
    setShowConfetti(false);
    setConfettiLoop(false);
  };

  // Optionally, you can include a manual reset for tasks only
  // This does not reset currency, since currency reset is handled globally.
  const resetDailyTasks = () => {
    const resetTasks = tasks.map(task => ({ ...task, completed: false }));
    setTasks(resetTasks);
    setCompletedTasks(0);
  };

  return (
    <View style={GlobalStyles.container}>
      {confettiLoop && (
        <View style={localStyles.clearButtonContainer} pointerEvents="auto">
          <TouchableOpacity style={localStyles.clearButton} onPress={stopConfetti}>
            <Text style={GlobalStyles.buttonText}>X</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <View style={localStyles.currencyContainer}>
          <Text style={localStyles.currencyText}>Dad Dollars: {currency}</Text>
        </View>

        {/* Optional manual reset button for daily tasks */}
          {__DEV__ && (
          <View style={localStyles.buttonContainer}>
            <TouchableOpacity style={GlobalStyles.button} onPress={resetDailyTasks}>
              <Text style={GlobalStyles.buttonText}>Reset Daily Tasks</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={[GlobalStyles.text, localStyles.title]}>Tasks</Text>
        <ProgressBar progress={totalTasks > 0 ? completedTasks / totalTasks : 0} />
        <Text style={GlobalStyles.text}>
          {completedTasks}/{totalTasks} tasks completed
        </Text>
        {tasks.map((task, index) => (
          <View key={index} style={localStyles.taskContainer}>
            <TouchableOpacity
              onPress={() => handleCompletion(index)}
              style={GlobalStyles.button}
            >
              <Text style={GlobalStyles.buttonText}>
                {task.completed ? '✔ Done' : '➤ Complete'}
              </Text>
            </TouchableOpacity>
            <Text style={[GlobalStyles.text, localStyles.taskText]}>{task.task}</Text>
          </View>
        ))}
      </View>
      {showConfetti && (
        <View style={localStyles.confettiContainer} pointerEvents="none">
          <LottieView
            key={confettiKey}
            source={require('../assets/confetti/animations/confetti.json')}
            autoPlay
            loop={confettiLoop}
            speed={1.5}
            resizeMode="cover"
            style={localStyles.confetti}
          />
        </View>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  currencyContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    gap: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  taskText: {
    fontSize: 20,
    color: '#333',
  },
  currencyText: {
    fontSize: 40,
    color: '#333',
    fontFamily: 'DynaPuff-Bold',
  },
  confetti: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  clearButtonContainer: {
    position: 'absolute',
    top: 600,
    right: 185,
    zIndex: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {},
});

export default TaskManagerScreen;
