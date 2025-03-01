import React, { useState } from 'react';
import { View, Text, Button, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native'; // Import the correct Lottie package
import { ProgressBar } from 'react-native-paper';

export default function TaskManagerScreen() {
  const totalTasks = 5;
  const [completedTasks, setCompletedTasks] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [badgeUnlocked, setBadgeUnlocked] = useState(false);

  const [tasks, setTasks] = useState([
    { task: 'Do homework', completed: false },
    { task: 'Clean room', completed: false },
    { task: 'Read for 10 minutes', completed: false },
    { task: 'Play with Penelope', completed: false },
    { task: 'Leave Penelope alone', completed: false },
    { task: 'Jujitsu', completed: false }
  ]);

  const handleCompletion = (index) => {
    let newTasks = [...tasks];
    if (!newTasks[index].completed) {
      newTasks[index].completed = true;
      const newCompletedCount = completedTasks + 1;
      setCompletedTasks(newCompletedCount);

      if (newCompletedCount === totalTasks) {
        setShowConfetti(true);
        setBadgeUnlocked(true);
      }
    }
    setTasks(newTasks);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Task Manager</Text>
      <ProgressBar progress={totalTasks > 0 ? completedTasks / totalTasks : 0} />
      <Text>{completedTasks}/{totalTasks} tasks completed</Text>

      {tasks.map((task, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <TouchableOpacity
            onPress={() => handleCompletion(index)}
            style={{
              backgroundColor: task.completed ? 'gray' : 'blue',
              padding: 10,
              borderRadius: 5,
              marginRight: 10,
            }}
          >
            <Text style={{ color: 'white' }}>{task.completed ? 'Done' : 'Complete'}</Text>
          </TouchableOpacity>
          <Text>{task.task}</Text>
        </View>
      ))}

      {/* Confetti Animation */}
      {showConfetti && (
        <LottieView
          source={require('../assets/confetti/animations/confetti.json')}
          autoPlay
          loop
         speed={1.5}
          resizeMode="cover"
         style={styles.confetti}
       />
)}



      {/* Badge Display 
      {badgeUnlocked && (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 18, color: 'blue' }}>You’ve unlocked the "Super Achiever" badge!</Text>
          <Image
            source={require('../assets/badge.png')}
            style={{ width: 100, height: 100, marginTop: 10 }}
          />
        </View>
      )}
        */}
      <Button title="Trigger Confetti" onPress={triggerConfetti} style={{ marginTop: 20 }} />
    </View>
  );
}

// **Place the styles BELOW the component**
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  taskButton: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  taskButtonText: {
    color: 'white',
  },
  confetti: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 150,
    left: 0,
    transform: [{ scale: 1.5 }], // Make confetti feel like it's bursting out
  },
  badgeContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  badgeText: {
    fontSize: 18,
    color: 'blue',
  },
  badgeImage: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
});

