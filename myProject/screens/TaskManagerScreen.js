import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
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

  {/* New handleCompletion */}
  const handleCompletion = (index) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      );

      const newCompletedCount = newTasks.filter(task => task.completed).length;
      setCompletedTasks(newCompletedCount);

      if (newCompletedCount >= totalTasks) {
        setShowConfetti(true);
        setBadgeUnlocked(true);
      }

      return newTasks;
    });
  };

  {/* Old handleCompletion 
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
  */}

  const triggerConfetti = () => {
    setShowConfetti((prev) => !prev);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Full-Screen Confetti Animation (Now in its own View) */}
      {showConfetti && (
        <View style={styles.confettiContainer} pointerEvents="none">
          <LottieView
            source={require('../assets/confetti/animations/confetti.json')}
            autoPlay
            loop
            speed={1.5}
            resizeMode="cover"
            style={styles.confetti}
          />
        </View>
      )}

      {/* Main Content */}
      <View style={{ padding: 20, flex: 1 }}>
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

        {/* Badge Display (Currently Commented Out) 
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
  confettiContainer: {
    position: 'absolute', 
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1, // Keeps it above everything
    pointerEvents: 'none', // Allows touches to pass through
  },
  confetti: {
    width: '100%',
    height: '100%',
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

