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
   - **Host & Faculty Portal (Passcode Protected)**: Click **"Host Portal"** in the top navigation to unlock host access using the Host Passcode (e.g. `2024` or `team1`). From here, the host can download the Master Class CSV, export individual candidate CSVs, review attempt logs, and lock the session before handing devices back to students.

7. **📱 Fully Responsive Design**:
   - Optimized for mobile smartphones, tablets, laptops, and large interactive monitors.
   - Touch-friendly option cards (min-height 52px), fluid top bar, and zero horizontal scroll.

---

## 💻 How to Run

You can open and run this application in two ways:

### Method 1: Direct File Launch
Double-click `index.html` in the folder to open it in any modern web browser (Chrome, Edge, Firefox, Brave, Safari).

### Method 2: Local HTTP Server (Recommended)
Open a terminal in the folder and run:
```bash
python -m http.server 8085
```
Then visit [http://localhost:8085](http://localhost:8085).

---

## 📁 Project Structure

```
quiz/
├── assets/
│   ├── acharya-logo-transparent.png   # Official transparent Acharya logo
│   └── acharya-logo.png               # Acharya logo
├── index.html                         # Main application markup & layout
├── styles.css                         # Dark theme (Black & White with neon accents)
├── questions.js                       # 15 MCQ questions, answers & explanations
├── logo-data.js                       # Base64 logo embed for offline PDF export
├── app.js                             # Quiz engine, auto-advance, scoring, PDF & CSV
└── README.md                          # Documentation
```