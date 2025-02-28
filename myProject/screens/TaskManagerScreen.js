import React, { useState } from 'react';
import { View, Text, Button, Image, TouchableOpacity } from 'react-native';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';  // For .lottie files
import { ProgressBar } from 'react-native-paper';
import LottieView from 'lottie-react-native';

export default function TaskManagerScreen() {
  const totalTasks = 5;
  const [completedTasks, setCompletedTasks] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [badgeUnlocked, setBadgeUnlocked] = useState(false);

  const [tasks, setTasks] = useState([
    { task: 'Do homework', completed: false },
    { task: 'Clean room', completed: false },
    { task: 'Read for 10 minutes', completed: false },
    { task: 'Walk the dog', completed: false },
    { task: 'Exercise for 15 minutes', completed: false }
  ]);

  const handleCompletion = (index) => {
    let newTasks = [...tasks];
    if (!newTasks[index].completed) {
      newTasks[index].completed = true;
      const newCompletedCount = completedTasks + 1;
      setCompletedTasks(newCompletedCount);

      // Show confetti when all tasks are completed
      if (newCompletedCount === totalTasks) {
        setShowConfetti(true);
        setBadgeUnlocked(true);
      }
    }
    setTasks(newTasks);
  };

  // Manually trigger confetti for testing
  const triggerConfetti = () => {
    setShowConfetti(true);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Task Manager</Text>

      {/* Progress Bar */}
      <ProgressBar progress={totalTasks > 0 ? completedTasks / totalTasks : 0} />

      {/* Task List */}
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

      {/* Show Confetti when All Tasks are Completed */}
      {showConfetti && (
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Text style={{ fontSize: 18, color: 'green' }}>Congratulations! You’ve completed all tasks!</Text>
       <LottieView
          source={require('../assets/animations/confetti.json')}
          autoPlay
          loop
          style={{ width: 150, height: 150, marginTop: 10 }}
        />
      </View>
      )}

      {/* Show Badge when Unlocked 
      {badgeUnlocked && (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 18, color: 'blue' }}>You’ve unlocked the "Super Achiever" badge!</Text>
          <Image
            source={require('../assets/badge.png')} // Use a badge image or alternative
            style={{ width: 100, height: 100, marginTop: 10 }}
          />
        </View>
      )}
        */}
      {/* Button to Trigger Confetti for Testing */}
      <Button
        title="Trigger Confetti"
        onPress={triggerConfetti}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}
