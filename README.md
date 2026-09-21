# Acharya EVS Quiz - 01 (Ecosystems Assessment)

**Organized by Team 1 • Acharya Institutes**  
**Subject:** Environmental Studies (EVS)  
**Topic:** Ecosystem - Structure, Function, Services & Threats (15 MCQs)

---

## 🚀 Overview

This web portal is designed for conducting live interactive classroom quiz sessions at Acharya Institutes. It delivers a dark-themed experience with a pure black background and crisp white typography, branded with the official Acharya logo and Team 1 credentials.

### ✨ Key Features

1. **Candidate Authentication**:
   - **Student Full Name** (Example: *Shubham Kumar*)
   - **College USN** (Example: *1AY24CS105*)
   - **Class Section** (Fixed exclusively to **Section D**, options removed)
   - **Acharya Institutional Email ID** (Example: *shubham.24.ise@acharya.ac.in*)

2. **15 MCQ Ecosystem Assessment**:
   - All 15 questions extracted directly from the official PDF presentation.
   - Categorized across 4 topic domains:
     - *Ecosystem Definition & Components (Q1–Q3)*
     - *Specific Ecosystems (Q4–Q9, Q15)*
     - *Energy Flow & Food Chains (Q10–Q11)*
     - *Ecosystem Services & Threats (Q12–Q14)*
   - Difficulty ratings: Easy, Medium, and Difficult.

3. **15-Second Question Timeout & Auto-Switch**:
   - Each question has an individual real-time **15-second countdown timer**.
   - Features dynamic color feedback: Cyan (15–8s), Warning Amber (7–4s), and Pulsing Urgent Crimson (3–0s), accompanied by a synchronized countdown progress bar.
   - If time expires before an option is chosen, the question is marked as *Unanswered* and the system automatically advances to the next question.
   - Selecting any option (A, B, C, or D) immediately locks in the answer, stops the countdown, and smoothly transitions to the next question after 450ms.
   - Full keyboard shortcut support: Press `A`/`B`/`C`/`D` or `1`/`2`/`3`/`4` to answer, or arrow keys to navigate.

4. **⚡ Kahoot-Style Fastest-Finger Speed Scoring Scheme**:
   - Live Kahoot point calculation: Instant responses earn up to **1,000 points** per correct question, scaling down with response latency.
   - Floating speed animation upon answering: `+940 pts (1.4s) ⚡ FAST FINGER!`.
   - Live score counter in top bar: Updates in real time (up to 15,000 speed points).
   - Discreet speed-accuracy merit mark calculated internally and reported on the scorecard.
   - Reflex performance tier badges: *⚡ Lightning Reflexes (Tier S+)*, *🚀 Rapid Responder (Tier S)*, *🎯 Steady Strategist (Tier A)*.

5. **Instant Scorecard & Detailed Review**:
   - Animated score ring and accuracy percentage.
   - Performance verdict badge.
   - Fastest-finger speed summary: Total points, average response time, fastest answer, and merit adjusted mark.
   - Topic-wise competency breakdown bars.
   - Question-by-question review displaying chosen answer, correct answer, time taken, speed points, result, and in-depth explanation from the PDF.

6. **Reports & Host-Only CSV Security**:
   - **Download PDF Scorecard**: Available to all candidates upon quiz completion as their official verified scorecard.
   - **Host-Only CSV Protection**: CSV datasets (individual student exports and the Master Class CSV) are strictly restricted to the session host/faculty. Regular students cannot see or download CSV files.
    - **Host & Faculty Portal (Direct Access)**: Click **"Host Portal"** in the top navigation to view the live dashboard directly without any password prompts. From here, the host can download the Master Class CSV, export individual candidate CSVs, and review live attempt logs.

7. **⚡ Multi-Device 60-Member Live Sync (Section D Cohort)**:
   - Engineered to run **60 students simultaneously** on their mobile smartphones in the classroom.
   - When each student completes their quiz on their phone, their scores, response times, and answers automatically stream live to the host server.
   - **Host Dashboard Cohort Tracker**:
     - Visual turnout progress bar: `X / 60 Submitted (%)`.
     - Remaining student counter: `(60 - X) Pending`.
     - Real-time auto-polling every 3 seconds to reflect submissions as they happen.
     - One-click copyable **Classroom Wi-Fi Link** for easy distribution to all 60 students.

8. **📱 Smartphone-Optimized Touch UI**:
   - Tested across iPhone and Android devices with safe-area insets (`viewport-fit=cover`).
   - Large touch targets (56px minimum height), haptic press feedback, and zero iOS Safari auto-zoom glitch.

---

## 💻 How to Run for 60 Students Concurrently

To conduct a live assessment session for all 60 students in Section D:

1. Open your terminal in the `quiz/` folder and run:
   ```bash
   node server.js
   ```
2. The server will output your local Classroom Wi-Fi URL:
   ```
   Local Host URL:    http://localhost:8085
   Classroom Wi-Fi:   http://192.168.X.Y:8085 (or http://10.X.X.X:8085)
   ```
3. Share the **Classroom Wi-Fi URL** on the classroom screen/board or have students connect to the same Wi-Fi network and open the link on their mobile smartphones.
4. As students finish within 15s per question, open the **Host Portal** to watch the live counter update to `60 / 60`.
5. Once completed, click **"Download Master Class CSV (Host)"** to export the entire Section D spreadsheet!

---

## 📁 Project Structure

```
quiz/
├── assets/
│   ├── acharya-logo-transparent.png   # Official transparent Acharya logo
│   └── acharya-logo.png               # Acharya logo
├── server.js                          # Node.js multi-device live sync server (60 members)
├── attempts.json                      # Synchronized submissions database
├── index.html                         # Main application markup & layout
├── styles.css                         # Dark theme (Black & White with neon accents)
├── questions.js                       # 15 MCQ questions, answers & explanations
├── logo-data.js                       # Base64 logo embed for offline PDF export
├── app.js                             # Quiz engine, auto-advance, scoring, PDF & CSV
└── README.md                          # Documentation
```