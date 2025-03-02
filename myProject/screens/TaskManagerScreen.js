import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { ProgressBar } from 'react-native-paper';
import { Audio } from 'expo-av';
import {useContext} from 'react'; // Allowing us to use context
import {CurrencyContext} from '../context/CurrencyContext'; // Importing CurrencyContext here

export default function TaskManagerScreen() {
  const { currency, rewardCurrency } = useContext(CurrencyContext); // Use global currency
  const totalTasks = 5;
  
  
  const [completedTasks, setCompletedTasks] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiLoop, setConfettiLoop] = useState(false);
  const [badgeUnlocked, setBadgeUnlocked] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const taskCompleteSound = useRef(null);

  const [tasks, setTasks] = useState([
    { task: 'Do homework', completed: false },
    { task: 'Clean room', completed: false },
    { task: 'Read for 10 minutes', completed: false },
    { task: 'Play with Penelope', completed: false },
    { task: 'Leave Penelope alone', completed: false },
    { task: 'Jujitsu', completed: false }
  ]);

  useEffect(() => {
    async function setupAudio() {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          staysActiveInBackground: true,
          playThroughEarpieceAndroid: false 
        });
  
        if (taskCompleteSound.current) {
          await taskCompleteSound.current.unloadAsync(); // Ensure old sound is removed
        }
  
        taskCompleteSound.current = new Audio.Sound();
        await taskCompleteSound.current.loadAsync(
          require('../assets/sounds/TaskComplete.mp3'),
          { shouldPlay: false }
        );
        console.log("Sound loaded and audio mode set");
      } catch (error) {
        console.error("Error setting up audio:", error);
      }
    }
  
    setupAudio();
  
  return () => {
      if (taskCompleteSound.current) {
        taskCompleteSound.current.unloadAsync(); // Unload sound to prevent issues
      }
    };
  }, []);
  
  

  const playCompletionSound = async () => {
    if (taskCompleteSound.current) {
      try {
        await taskCompleteSound.current.setPositionAsync(0); // Force start
        await taskCompleteSound.current.playAsync(); // Explicitly play
        console.log("Sound played successfully");
  
        const newStatus = await taskCompleteSound.current.getStatusAsync();
        console.log("Sound status after playing:", newStatus);
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    }
  };
  
  
  
  

  const handleCompletion = (index) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      );
      const newCompletedCount = newTasks.filter(task => task.completed).length;
      setCompletedTasks(newCompletedCount);
      if (newCompletedCount > completedTasks) {
        rewardCurrency(); // Grant currency reward for completing a task
      }
      playCompletionSound();
      setShowConfetti(false);
      setTimeout(() => {
        setShowConfetti(true);
        setConfettiKey(prevKey => prevKey + 1);
        setConfettiLoop(newCompletedCount >= totalTasks);
      }, 100);
      return newTasks;
    });
  };

  const stopConfetti = () => {
    setShowConfetti(false);
    setConfettiLoop(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {confettiLoop && (
        <View style={styles.clearButtonContainer} pointerEvents="auto">
          <TouchableOpacity style={styles.clearButton} onPress={stopConfetti}>
            <Text style={styles.clearButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={{ flex: 1, padding: 20 }}>
        <View style={styles.currencyContainer}>
          <Text style={styles.currencyText}>Currency: {currency}</Text>
        </View>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Tasks</Text>
        <ProgressBar progress={totalTasks > 0 ? completedTasks / totalTasks : 0} />
        <Text>{completedTasks}/{totalTasks} tasks completed</Text>
        {tasks.map((task, index) => (
          <View key={index} style={styles.taskContainer}>
            <TouchableOpacity
              onPress={() => handleCompletion(index)}
              style={[styles.taskButton, task.completed ? styles.taskButtonCompleted : styles.taskButtonIncomplete]}
            >
              <Text style={styles.taskButtonText}>{task.completed ? '✔ Done' : '➤ Complete'}</Text>
            </TouchableOpacity>
            <Text style={styles.taskText}>{task.task}</Text>
          </View>
        ))}
      </View>
      {(showConfetti) && (
        <View style={styles.confettiContainer} pointerEvents="none">
          <LottieView
            key={confettiKey}
            source={require('../assets/confetti/animations/confetti.json')}
            autoPlay
            loop={confettiLoop}
            speed={1.5}
            resizeMode="cover"
            style={styles.confetti}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  currencyContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  currencyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  taskButtonCompleted: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskButtonIncomplete: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
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
  clearButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  }
});
