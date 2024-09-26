# **Tic-Tac-Win: The No-Draw Tic-Tac-Toe**

**Tic-Tac-Win** is a real-time, multiplayer version of Tic-Tac-Toe that guarantees a winner every time. Built using Firebase Firestore and Tailwind CSS, this game introduces a new twist to the traditional Tic-Tac-Toe rules: no more frustrating draws! Players can create or join rooms with a unique game code or link, and the game keeps going until one player wins by strategically reverting each player's earliest moves after their third move.

### **Why Tic-Tac-Win?**

In the classic game of Tic-Tac-Toe, if both players play perfectly, the game always ends in a **draw**. This can get boring and repetitive, especially when there’s no chance for victory. **Tic-Tac-Win** eliminates this problem by introducing an innovative mechanic: after each player’s third move, their earliest move gets removed from the board, forcing players to think more strategically. The game continues until one player wins—**no draws, just wins!**

## **Features**
- **Multiplayer Rooms**: Create a new game or join an existing one using a game code or link.
- **Real-Time Gameplay**: Play in real-time with your opponent using Firebase Firestore.
- **No Draws**: The game never ends in a draw by reverting a player's earliest moves after their third move, ensuring a winner every time.
- **Random Player Assignment**: Players are randomly assigned as 'X' or 'O' at the start of the game.
- **Restartable**: Once the game ends, players can restart the game without having to re-enter the game code.

## **How to Play**
1. **Start a New Game**: 
    - Click the "Start New Game" button to generate a unique game code.
    - Share the code or the link with another player.
2. **Join a Game**: 
    - If you have a game code, enter it in the input field and click "Join Game" to start playing.
3. **Gameplay**: 
    - Players take turns placing their symbols ('X' or 'O') on the 3x3 grid.
    - After each player places three moves, their earliest move will disappear, keeping only the most recent three moves on the board.
4. **Winning the Game**:
    - Win by aligning three of your symbols in a row, column, or diagonal.
    - The game will **always continue until one player wins**—there is no draw!
5. **Restart**: 
    - After a game is won, the players can restart the game without re-entering the game code.

## **Technologies Used**
- **Frontend**: 
  - **HTML** and **Tailwind CSS** for building the responsive UI.
  - **JavaScript (ES6 modules)** for implementing the game logic and real-time updates.
- **Backend**:
  - **Firebase Firestore** for real-time synchronization of game state across players.
  - **Firebase Hosting** (optional) for deploying the game.

## **Project Setup**

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/developer-pritam/tic-tac-win.git
cd tic-tac-win
```

### **Step 2: Set Up Firebase**

1. Go to the [Firebase Console](https://console.firebase.google.com/), create a new project, and enable Firestore.
2. Get your Firebase config object by registering a new web app in your Firebase project.
3. Replace the placeholders in the Firebase config section of your `index.html` file with your own Firebase credentials:
   ```javascript
   const firebaseConfig = {
     apiKey: 'YOUR_API_KEY',
     authDomain: 'YOUR_AUTH_DOMAIN',
     projectId: 'YOUR_PROJECT_ID',
   };
   ```

### **Step 3: Configure Firestore Rules**
For testing purposes, configure your Firestore security rules to allow reads and writes:
```bash
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{gameId} {
      allow read, write: if true;
    }
  }
}
```

> Note: Update these rules for production with proper authentication and access control.

### **Step 4: Run the Game**

- Open `index.html` in a browser to start the game. 
- You can also deploy it using Firebase Hosting for easy access.

### **Optional: Deploying with Firebase Hosting**
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in to Firebase:
   ```bash
   firebase login
   ```
3. Initialize Firebase Hosting in your project folder:
   ```bash
   firebase init hosting
   ```
4. Deploy your project:
   ```bash
   firebase deploy
   ```

## **Contributing**

Contributions are welcome! Please fork this repository, create a feature branch, and submit a pull request. Make sure your changes pass linting and function as expected.

## **License**

This project is licensed under the MIT License.

---

**Tic-Tac-Win: Play to Win!**

Say goodbye to boring, drawn-out games where no one wins. In **Tic-Tac-Win**, there is always a winner, and every game is fast-paced and exciting. Challenge your friends, think strategically, and claim your victory!