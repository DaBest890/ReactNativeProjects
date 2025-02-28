import React, { useState } from 'react';
import { View, Text, Button, ProgressBarAndroid, CheckBox, Image } from 'react-native';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';  // For .lottie files
import { DotLottieReact } from '@lottiefiles/dotlottie-react';  // For .lottie files

export default function TaskManagerScreen() {
  const totalTasks = 5;
  const [completedTasks, setCompletedTasks] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [badgeUnlocked, setBadgeUnlocked] = useState(false);

  const tasks = [
    { task: 'Do homework', completed: false },
    { task: 'Clean room', completed: false },
    { task: 'Read for 10 minutes', completed: false },
    { task: 'Walk the dog', completed: false },
    { task: 'Exercise for 15 minutes', completed: false }
  ];

  const handleCompletion = (index) => {
    let newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setCompletedTasks(newTasks.filter(task => task.completed).length);
    
    // Show confetti when all tasks are completed
    if (completedTasks + 1 === totalTasks) {
      setShowConfetti(true);
    }

    // Unlock the badge when all tasks are done
    if (completedTasks + 1 >= totalTasks) {
      setBadgeUnlocked(true);
    }
  };

  // Manually trigger confetti for testing
  const triggerConfetti = () => {
    setShowConfetti(true);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Task Manager</Text>

      {/* Progress Bar */}
      <ProgressBarAndroid
        styleAttr="Horizontal"
        indeterminate={false}
        progress={completedTasks / totalTasks}
      />
      <Text>{completedTasks}/{totalTasks} tasks completed</Text>

      {/* Task List */}
      {tasks.map((task, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <CheckBox
            value={task.completed}
            onValueChange={() => handleCompletion(index)}
          />
          <Text style={{ marginLeft: 10 }}>{task.task}</Text>
        </View>
      ))}

      {/* Show Confetti when All Tasks are Completed */}
      {showConfetti && (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 18, color: 'green' }}>Congratulations! You’ve completed all tasks!</Text>
          <DotLottieReact
            src={require('../assets/confetti.lottie')}  // Path to your .lottie file
            loop
            autoplay
            style={{ width: 150, height: 150, marginTop: 10 }}  // Adjust size as needed
          />
        </View>
      )}

      {/* Show Badge when Unlocked */}
      {badgeUnlocked && (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 18, color: 'blue' }}>You’ve unlocked the "Super Achiever" badge!</Text>
          <Image
            source={require('../assets/badge.png')} // Use a badge image or alternative
            style={{ width: 100, height: 100, marginTop: 10 }}
          />
        </View>
      )}

      {/* Button to Add Tasks */}
      <Button
        title="Complete Task"
        onPress={() => setCompletedTasks(completedTasks + 1)}
        style={{ marginTop: 20 }}
      />

      {/* Button to Trigger Confetti for Testing */}
      <Button
        title="Trigger Confetti"
        onPress={triggerConfetti}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}
