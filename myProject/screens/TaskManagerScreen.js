import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { ProgressBar } from 'react-native-paper';
import { Audio } from 'expo-av';
import { useContext } from 'react';
import { CurrencyContext } from '../context/CurrencyContext';
import GlobalStyles from '../styles/GlobalStyles'; // Reusable global styles
import { Platform } from 'react-native';

export default function TaskManagerScreen() {
  const { currency, rewardCurrency, spendCurrency, resetCurrency } = useContext(CurrencyContext);
  const totalTasks = 5;

  const [completedTasks, setCompletedTasks] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiLoop, setConfettiLoop] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  const taskCompleteSound = useRef(null);

  const [tasks, setTasks] = useState([
    { task: 'Do homework', completed: false },
    { task: 'Clean room', completed: false },
    { task: 'Read for 10 minutes', completed: false },
    { task: 'Play with Penelope', completed: false },
    { task: 'Leave Penelope alone', completed: false },
    { task: 'Jujitsu', completed: false },
  ]);

  // =======================
  //   AUDIO SETUP (MP3)
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

        // Unload any previously loaded sound
        if (taskCompleteSound.current) {
          await taskCompleteSound.current.unloadAsync();
        }

        // Load the task completion sound
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

    // Cleanup on unmount
    return () => {
      if (taskCompleteSound.current) {
        taskCompleteSound.current.unloadAsync();
      }
    };
  }, []);

  // =======================
  //   PLAY COMPLETION SOUND
  // =======================
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
  //   HANDLE TASK COMPLETION
  // =======================
  const handleCompletion = (index) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((t, i) =>
        i === index ? { ...t, completed: !t.completed } : t
      );
      const newCompletedCount = newTasks.filter((t) => t.completed).length;

      // Update the completed task count
      setCompletedTasks(newCompletedCount);

      // Reward currency if a task was newly completed
      if (newCompletedCount > completedTasks) {
        rewardCurrency();
      }

      // Play sound
      playCompletionSound();

      // Confetti logic
      setShowConfetti(false); // Hide any active confetti
        setConfettiKey((prevKey) => prevKey + 1);

        if (newCompletedCount < totalTasks) {
          // Not all tasks done -> play confetti once
          setConfettiLoop(false);
          setShowConfetti(true);

        } else {
          // All tasks complete -> loop confetti
          setConfettiLoop(true);
          setShowConfetti(true);
        }

      return newTasks;
    });
  };

  // =======================
  //   STOP CONFETTI
  // =======================
  const stopConfetti = () => {
    setShowConfetti(false);
    setConfettiLoop(false);
  };

  // =======================
  //   RENDER
  // =======================
  return (
    <View style={GlobalStyles.container}>
      {/* X Button: shown only when confetti is looping (all tasks done) */}
      {confettiLoop && (
        <View style={localStyles.clearButtonContainer} pointerEvents="auto">
          <TouchableOpacity style={localStyles.clearButton} onPress={stopConfetti}>
            <Text style={GlobalStyles.buttonText}>X</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ flex: 1 }}>
        {/* Currency Display */}
        <View style={localStyles.currencyContainer}>
          <Text style={localStyles.currencyText}>Currency: {currency}</Text>
        </View>
          {/* Spend / Reset Currency Buttons */}

  {/*{__DEV__ &&( //WORKING ON THIS
        <View style={localStyles.buttonContainer}>
          <TouchableOpacity style={GlobalStyles.button} onPress={() => spendCurrency(10)}>
            <Text style={GlobalStyles.buttonText}>Buy New Game</Text>
          </TouchableOpacity>
          <TouchableOpacity style={GlobalStyles.button} onPress={resetCurrency}>
            <Text style={GlobalStyles.buttonText}>Reset Currency</Text>
          </TouchableOpacity>
        </View>
            )}
*/}
        {/* Task Progress */}
        <Text style={[GlobalStyles.text, localStyles.title]}>Tasks</Text>
        <ProgressBar progress={totalTasks > 0 ? completedTasks / totalTasks : 0} />
        <Text style={GlobalStyles.text}>
          {completedTasks}/{totalTasks} tasks completed
        </Text>

        {/* Task List */}
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

      {/* Confetti Animation */}
      {showConfetti && (
        <View style={localStyles.confettiContainer} pointerEvents="none">
          <LottieView
            key={confettiKey}
            source={require('../assets/confetti/animations/confetti.json')} // Ensure path is correct
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
};

// =======================
//   LOCAL STYLES
// =======================
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
    fontSize: 50,
    color: '#333',
    fontFamily: 'DynaPuff-Bold', //Custom font for currency text
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
  clearButton: {
    // Optionally apply a style here, or rely on GlobalStyles.buttonText for text styling
  },
});
