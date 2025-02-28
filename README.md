# My React Native Projects Repository

This repository is a **React Native** mobile app project built using **Expo**. Below are the instructions for setting up the project on your local machine.
Each folder represents one mobile app project

## Pre-requisites

Before running the application, make sure you have the following installed:

### 1. **Visual Studio Code (VS Code)**
- Download [**Visual Studio Code**](https://code.visualstudio.com/).
- VS Code is the IDE used for editing the code.

### 2. **Node.js & npm**
- **Node.js** is required to run the application.
- Download [**Node.js**](https://nodejs.org/) (LTS version recommended).
- **npm** (Node Package Manager) is installed automatically with Node.js and will be used for installing dependencies.

### 3. **Expo CLI**
- Expo is a toolchain for React Native apps.
- To install **Expo CLI**, open **CMD** and run the following command:
  ```bash
  npm install -g expo-cli
  ```
### Now that you have the proper setup we move to clone this repository
### Note: Keep in mind when you are in your CMD, it doesn't matter what directory you are in **specifically** when you are using git commands

## 1. Clone the Repository
Open up **Visual Studio Code** and on the **Welcome tab** click 'Clone Git Repository...'

Now copy and paste this URL into the VS command pallete: https://github.com/DaBest890/ReactNativeProjects ![image](https://github.com/user-attachments/assets/93c952ea-4591-44b0-af4e-1d54fb6db7b1)

You will then be prompted to choose a location for this repository, make one. ![image](https://github.com/user-attachments/assets/ec8c0f28-83e9-4be3-b296-387dc4fbe7c7)



## 2. Install Dependencies
Now press **'Ctrl + `'** to open up the Visual Studio Code terminal **or** you can use **CMD**

1. Locate your own local projects directory, mine is:
```bash
cd C:\Users\Maximo\Documents\ReactNativeProjects
```
2. Now make sure you are in the correct directory to install dependencies, if you have the folder open in VS Code, your VS Code terminal will already be in the correct directory.
```bash
cd C:\Your-Projects-Directory
```
3. After verifying you are in the correct directory, type the command
```bash
npm install
```
This will prompt node packet manager from **Node.js** to install all the dependencies the cloned repository needs to run onto your computer.

## 3. Finished
At this point your computer should have all of the dependencies to run the myProjects app, you can change change directory to myProject
```bash
cd C:\Users\Maximo\Documents\ReactNativeProjects\myProject
```
This is like opening up the app, and then you press **'CTRL+`'** in VS Code to open up the terminal and once you are in the correct directory type.
```
npx expo start
```
To start the server, which should look like ![image](https://github.com/user-attachments/assets/e090a864-cde2-4327-b8fe-56ae1cd36d27)
You can now press **'a'** to start your emulator and it will run the app in the myProjects folder






