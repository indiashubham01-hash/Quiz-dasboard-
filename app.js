/**
 * ACHARYA INSTITUTES - TEAM 1
 * EVS QUIZ - 01: ECOSYSTEMS CLASS ASSESSMENT
 * Core Application Logic & Data Export
 */

(function () {
  'use strict';

  // State Management
  const QUESTION_DURATION = 15; // 15 seconds per question
  const state = {
    currentStudent: null,
    currentQuestionIndex: 0,
    answers: new Array(15).fill(null),
    responseTimes: new Array(15).fill(null),
    speedPoints: new Array(15).fill(0),
    totalSpeedPoints: 0,
    questionStartTime: null,
    startTime: null,
    timerInterval: null,
    secondsElapsed: 0,
    questionTimeRemaining: 15,
    questionTimerInterval: null,
    lastAttemptResult: null,
    isHostAuthenticated: sessionStorage.getItem('ACHARYA_HOST_AUTH') === 'true',
    hostPollInterval: null,
    serverCapacity: 60
  };

  const STORAGE_KEY = 'acharya_evs_quiz_attempts_v1';
  const OFFLINE_QUEUE_KEY = 'acharya_evs_quiz_sync_queue_v1';
  const VALID_HOST_PASSWORDS = ['2024', 'team1', 'acharya', 'acharya2024', 'host', 'evs2024', 'admin'];

  // DOM Elements
  const DOM = {
    headerLogo: document.getElementById('headerLogo'),
    btnTeacherDash: document.getElementById('btnTeacherDash'),
    hostBtnText: document.getElementById('hostBtnText'),
    
    // Views
    loginView: document.getElementById('loginView'),
    quizView: document.getElementById('quizView'),
    resultsView: document.getElementById('resultsView'),

    // Login Form
    btnFillSample: document.getElementById('btnFillSample'),
    loginForm: document.getElementById('studentLoginForm'),
    inputName: document.getElementById('studentName'),
    inputUsn: document.getElementById('studentUsn'),
    inputSection: document.getElementById('studentSection'),
    inputEmail: document.getElementById('studentEmail'),
    btnStartQuiz: document.getElementById('btnStartQuiz'),

    // Quiz Elements
    activeStudentInitials: document.getElementById('activeStudentInitials'),
    activeStudentName: document.getElementById('activeStudentName'),
    activeStudentUsn: document.getElementById('activeStudentUsn'),
    activeStudentSection: document.getElementById('activeStudentSection'),
    timerDisplay: document.getElementById('timerDisplay'),
    kahootPointsChip: document.getElementById('kahootPointsChip'),
    livePointsDisplay: document.getElementById('livePointsDisplay'),
    qTimerChip: document.getElementById('qTimerChip'),
    qTimerSeconds: document.getElementById('qTimerSeconds'),
    qTimerFill: document.getElementById('qTimerFill'),
    currentQNum: document.getElementById('currentQNum'),
    progressPercent: document.getElementById('progressPercent'),
    progressBarFill: document.getElementById('progressBarFill'),
    qTopicBadge: document.getElementById('qTopicBadge'),
    qDiffBadge: document.getElementById('qDiffBadge'),
    questionText: document.getElementById('questionText'),
    optionsContainer: document.getElementById('optionsContainer'),
    speedFeedbackPopup: document.getElementById('speedFeedbackPopup'),
    btnPrevQ: document.getElementById('btnPrevQ'),
    btnNextQ: document.getElementById('btnNextQ'),
    btnFinishQuiz: document.getElementById('btnFinishQuiz'),

    // Results Elements
    scoreCircleBar: document.getElementById('scoreCircleBar'),
    finalScoreVal: document.getElementById('finalScoreVal'),
    resultsVerdict: document.getElementById('resultsVerdict'),
    resultsPercentBadge: document.getElementById('resultsPercentBadge'),
    reflexTierBadge: document.getElementById('reflexTierBadge'),
    totalPointsDisplay: document.getElementById('totalPointsDisplay'),
    avgSpeedDisplay: document.getElementById('avgSpeedDisplay'),
    fastestAnswerDisplay: document.getElementById('fastestAnswerDisplay'),
    meritScoreDisplay: document.getElementById('meritScoreDisplay'),
    recapName: document.getElementById('recapName'),
    recapUsn: document.getElementById('recapUsn'),
    recapSection: document.getElementById('recapSection'),
    recapEmail: document.getElementById('recapEmail'),
    recapDuration: document.getElementById('recapDuration'),
    topicBarsContainer: document.getElementById('topicBarsContainer'),
    reviewListContainer: document.getElementById('reviewListContainer'),
    btnDownloadPdf: document.getElementById('btnDownloadPdf'),
    btnNewStudent: document.getElementById('btnNewStudent'),

    // Host Password Authentication Modal
    hostAuthModal: document.getElementById('hostAuthModal'),
    hostAuthForm: document.getElementById('hostAuthForm'),
    hostPasscodeInput: document.getElementById('hostPasscodeInput'),
    hostAuthError: document.getElementById('hostAuthError'),
    btnCloseHostAuthModal: document.getElementById('btnCloseHostAuthModal'),
    btnCancelHostAuth: document.getElementById('btnCancelHostAuth'),
    btnLockHostMode: document.getElementById('btnLockHostMode'),

    // Teacher Modal
    teacherModal: document.getElementById('teacherModal'),
    btnCloseTeacherModal: document.getElementById('btnCloseTeacherModal'),
    btnCloseTeacherModal2: document.getElementById('btnCloseTeacherModal2'),
    adminSearchInput: document.getElementById('adminSearchInput'),
    adminTableBody: document.getElementById('adminTableBody'),
    adminEmptyState: document.getElementById('adminEmptyState'),
    statTotalAttempts: document.getElementById('statTotalAttempts'),
    statClassAverage: document.getElementById('statClassAverage'),
    statHighestScore: document.getElementById('statHighestScore'),
    statPassRate: document.getElementById('statPassRate'),
    btnExportClassCsv: document.getElementById('btnExportClassCsv'),
    btnExportOfflineJson: document.getElementById('btnExportOfflineJson'),
    btnClearData: document.getElementById('btnClearData'),

    // Cohort Tracker & Live Network Banner
    cohortLiveStatus: document.getElementById('cohortLiveStatus'),
    cohortProgressFill: document.getElementById('cohortProgressFill'),
    cohortProgressText: document.getElementById('cohortProgressText'),
    cohortRemainingText: document.getElementById('cohortRemainingText'),
    classroomWifiUrl: document.getElementById('classroomWifiUrl'),
    btnCopyClassUrl: document.getElementById('btnCopyClassUrl'),

    toastContainer: document.getElementById('toastContainer')
  };

  // Pre-load Logo DataURL for PDF Generation
  let acharyaLogoDataUrl = null;
  function preloadLogoBase64() {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        acharyaLogoDataUrl = canvas.toDataURL('image/png');
      } catch (err) {
        console.warn('Could not cache logo base64:', err);
      }
    };
    img.src = 'assets/acharya-logo-transparent.png';
  }

  // Toast Notification Helper
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? '✓' : type === 'warn' ? '⚠' : 'ℹ';
    toast.innerHTML = `<span style="font-weight:bold; color:var(--accent-cyan);">${icon}</span> <span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Format Seconds to MM:SS
  function formatDuration(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  // View Switching
  function switchView(viewName) {
    DOM.loginView.classList.remove('active');
    DOM.quizView.classList.remove('active');
    DOM.resultsView.classList.remove('active');

    if (viewName === 'login') DOM.loginView.classList.add('active');
    if (viewName === 'quiz') DOM.quizView.classList.add('active');
    if (viewName === 'results') DOM.resultsView.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Local & Offline Storage Helpers
  function getStoredAttempts() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed reading localStorage', e);
      return [];
    }
  }

  function mergeAttempts(localList, serverList) {
    const map = new Map();
    // Add local attempts first
    (localList || []).forEach(item => {
      if (item && (item.id || item.usn)) {
        const key = item.id || (item.usn + '_' + (item.timestamp || item.completedAt || ''));
        map.set(key, item);
      }
    });
    // Merge or update with server attempts
    (serverList || []).forEach(item => {
      if (item && (item.id || item.usn)) {
        const key = item.id || (item.usn + '_' + (item.timestamp || item.completedAt || ''));
        map.set(key, item);
      }
    });
    return Array.from(map.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }

  function getSyncQueue() {
    try {
      const data = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function addToSyncQueue(attempt) {
    try {
      const queue = getSyncQueue();
      const exists = queue.some(item => (item.id && item.id === attempt.id) || (item.usn === attempt.usn && item.timestamp === attempt.timestamp));
      if (!exists) {
        queue.push(attempt);
        localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
      }
    } catch (e) {
      console.error('Failed saving to sync queue', e);
    }
  }

  function removeSyncQueueItem(record) {
    try {
      const queue = getSyncQueue();
      const updated = queue.filter(item => !((item.id && item.id === record.id) || (item.usn === record.usn && item.timestamp === record.timestamp)));
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updated));
    } catch (e) {}
  }

  function saveAttempt(attempt) {
    try {
      const list = getStoredAttempts();
      const existingIdx = list.findIndex(item => (item.id && item.id === attempt.id) || (item.usn === attempt.usn && item.timestamp === attempt.timestamp));
      if (existingIdx >= 0) {
        list[existingIdx] = attempt;
      } else {
        list.unshift(attempt);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      // Reliable backup in sync queue
      addToSyncQueue(attempt);
    } catch (e) {
      console.error('Failed saving to localStorage', e);
    }
  }

  // =========================================================================
  // 1. LOGIN & START QUIZ
  // =========================================================================
  function handleLoginSubmit(e) {
    e.preventDefault();

    const name = DOM.inputName.value.trim();
    const usn = DOM.inputUsn.value.trim().toUpperCase();
    const section = (DOM.inputSection && DOM.inputSection.value.trim()) ? DOM.inputSection.value.trim() : 'Section D';
    const email = DOM.inputEmail.value.trim();

    if (!name) {
      showToast('Please enter your full name.', 'warn');
      DOM.inputName.focus();
      return;
    }
    if (!usn || usn.length < 5) {
      showToast('Please enter a valid College USN.', 'warn');
      DOM.inputUsn.focus();
      return;
    }
    if (!email || !email.includes('@')) {
      showToast('Please enter your valid Acharya Email ID.', 'warn');
      DOM.inputEmail.focus();
      return;
    }

    // Initialize Student Session
    state.currentStudent = {
      name,
      usn,
      section,
      email,
      initials: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    };

    // Update Quiz Header Student Chip
    DOM.activeStudentName.textContent = name;
    DOM.activeStudentUsn.textContent = usn;
    DOM.activeStudentSection.textContent = section;
    DOM.activeStudentInitials.textContent = state.currentStudent.initials;

    // Reset Quiz State
    state.currentQuestionIndex = 0;
    state.answers = new Array(QUIZ_DATA.questions.length).fill(null);
    state.responseTimes = new Array(QUIZ_DATA.questions.length).fill(null);
    state.speedPoints = new Array(QUIZ_DATA.questions.length).fill(0);
    state.totalSpeedPoints = 0;
    if (DOM.livePointsDisplay) DOM.livePointsDisplay.textContent = '0';
    state.secondsElapsed = 0;
    state.startTime = new Date();

    // Start Timer
    if (state.timerInterval) clearInterval(state.timerInterval);
    DOM.timerDisplay.textContent = '00:00';
    state.timerInterval = setInterval(() => {
      state.secondsElapsed++;
      DOM.timerDisplay.textContent = formatDuration(state.secondsElapsed);
    }, 1000);

    // Switch to Quiz View & Render Question 1
    switchView('quiz');
    renderQuestion(0);
    showToast(`Welcome ${name}! EVS Quiz - 01 started.`, 'success');
  }

  // =========================================================================
  // 2. RENDER QUESTION & AUTO-SWITCH LOGIC
  // =========================================================================
  function renderQuestion(index) {
    if (index < 0 || index >= QUIZ_DATA.questions.length) return;
    state.currentQuestionIndex = index;

    const q = QUIZ_DATA.questions[index];
    const total = QUIZ_DATA.questions.length;
    const currentNum = index + 1;

    // Record question start timestamp for fastest-finger calculation
    state.questionStartTime = performance.now();

    // Clear previous floating feedback
    if (DOM.speedFeedbackPopup) DOM.speedFeedbackPopup.innerHTML = '';

    // Update Progress
    DOM.currentQNum.textContent = currentNum;
    const pct = Math.round((currentNum / total) * 100);
    DOM.progressPercent.textContent = `${pct}%`;
    DOM.progressBarFill.style.width = `${pct}%`;

    // Badges & Statement
    DOM.qTopicBadge.textContent = q.topic;
    DOM.qDiffBadge.textContent = q.difficulty;
    DOM.qDiffBadge.className = `diff-badge ${q.difficulty}`;
    DOM.questionText.textContent = `${currentNum}. ${q.question}`;

    // Clear and build options
    DOM.optionsContainer.innerHTML = '';
    const selectedAnswer = state.answers[index];

    const optionKeys = ['A', 'B', 'C', 'D'];
    optionKeys.forEach((key) => {
      const card = document.createElement('div');
      card.className = 'option-card';
      card.setAttribute('data-key', key);

      if (selectedAnswer === key) {
        card.classList.add('selected');
      }

      card.innerHTML = `
        <div class="option-key">${key}</div>
        <div class="option-text">${q.options[key]}</div>
      `;

      card.addEventListener('click', () => handleSelectOption(key));
      DOM.optionsContainer.appendChild(card);
    });

    // Navigation Buttons State
    DOM.btnPrevQ.disabled = index === 0;
    if (index === total - 1) {
      DOM.btnNextQ.style.display = 'none';
      DOM.btnFinishQuiz.style.display = 'inline-flex';
    } else {
      DOM.btnNextQ.style.display = 'inline-flex';
      DOM.btnFinishQuiz.style.display = 'none';
    }

    // Start 15-second timer for this question
    startQuestionCountdown(index);
  }

  // =========================================================================
  // 15-SECOND QUESTION COUNTDOWN TIMER & KAHOOT SPEED ENGINE
  // =========================================================================
  function stopQuestionCountdown() {
    if (state.questionTimerInterval) {
      clearInterval(state.questionTimerInterval);
      state.questionTimerInterval = null;
    }
  }

  function startQuestionCountdown(qIndex) {
    stopQuestionCountdown();
    state.questionTimeRemaining = QUESTION_DURATION;
    updateQuestionTimerUI(QUESTION_DURATION);

    state.questionTimerInterval = setInterval(() => {
      state.questionTimeRemaining--;
      const rem = state.questionTimeRemaining;
      updateQuestionTimerUI(rem);

      if (rem <= 0) {
        stopQuestionCountdown();
        handleQuestionTimeout(qIndex);
      }
    }, 1000);
  }

  function updateQuestionTimerUI(seconds) {
    if (!DOM.qTimerSeconds || !DOM.qTimerChip || !DOM.qTimerFill) return;
    DOM.qTimerSeconds.textContent = `${seconds}s`;
    const pct = Math.max(0, (seconds / QUESTION_DURATION) * 100);
    DOM.qTimerFill.style.width = `${pct}%`;

    DOM.qTimerChip.classList.remove('warning', 'critical');
    DOM.qTimerFill.classList.remove('warning', 'critical');

    if (seconds <= 4) {
      DOM.qTimerChip.classList.add('critical');
      DOM.qTimerFill.classList.add('critical');
    } else if (seconds <= 7) {
      DOM.qTimerChip.classList.add('warning');
      DOM.qTimerFill.classList.add('warning');
    }
  }

  function handleQuestionTimeout(qIndex) {
    // If student hasn't selected an answer, record as Unanswered
    if (!state.answers[qIndex]) {
      state.answers[qIndex] = 'Unanswered';
    }
    state.responseTimes[qIndex] = 15.0;
    state.speedPoints[qIndex] = 0;

    showToast(`Time out for Question ${qIndex + 1}! Advancing to next...`, 'warn');

    // Auto-advance to next question or submit
    if (qIndex < QUIZ_DATA.questions.length - 1) {
      renderQuestion(qIndex + 1);
    } else {
      finishQuiz();
    }
  }

  function handleSelectOption(key) {
    // Stop countdown immediately once student makes a selection
    stopQuestionCountdown();

    const qIndex = state.currentQuestionIndex;
    state.answers[qIndex] = key;

    // Calculate response speed
    const elapsedMs = state.questionStartTime ? (performance.now() - state.questionStartTime) : 1000;
    const elapsedSec = Math.min(15, Math.max(0.2, Math.round((elapsedMs / 1000) * 10) / 10));
    state.responseTimes[qIndex] = elapsedSec;

    // Check correctness & compute Kahoot fastest-finger speed score
    const isCorrect = key === QUIZ_DATA.questions[qIndex].correctAnswer;
    let earnedPoints = 0;
    if (isCorrect) {
      // Kahoot-style fastest finger formula:
      // Maximum 1000 pts for instant answer, scales down smoothly to 350 pts at 15s
      earnedPoints = Math.round(Math.max(350, (1 - (elapsedSec / 25)) * 1000));
    }
    state.speedPoints[qIndex] = earnedPoints;
    state.totalSpeedPoints = state.speedPoints.reduce((acc, val) => acc + val, 0);

    // Update live Kahoot points counter in top bar
    if (DOM.livePointsDisplay) {
      DOM.livePointsDisplay.textContent = state.totalSpeedPoints.toLocaleString();
    }
    if (DOM.kahootPointsChip) {
      DOM.kahootPointsChip.classList.remove('pulse');
      void DOM.kahootPointsChip.offsetWidth;
      DOM.kahootPointsChip.classList.add('pulse');
    }

    // Floating speed feedback popup
    if (DOM.speedFeedbackPopup) {
      DOM.speedFeedbackPopup.innerHTML = '';
      const popup = document.createElement('div');
      if (isCorrect) {
        popup.className = 'speed-popup-item fast';
        popup.innerHTML = `<span>⚡ +${earnedPoints} pts</span> <span style="font-size:0.75rem; opacity:0.9;">(${elapsedSec}s) FAST FINGER!</span>`;
      } else {
        popup.className = 'speed-popup-item';
        popup.style.background = 'rgba(244, 63, 94, 0.2)';
        popup.style.color = '#fb7185';
        popup.innerHTML = `<span>Recorded</span> <span style="font-size:0.75rem; opacity:0.8;">(${elapsedSec}s)</span>`;
      }
      DOM.speedFeedbackPopup.appendChild(popup);
    }

    // Immediate UI feedback on chosen card
    const cards = DOM.optionsContainer.querySelectorAll('.option-card');
    cards.forEach(card => {
      if (card.getAttribute('data-key') === key) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });

    // Clear any pending transition
    if (state.autoSwitchTimeout) {
      clearTimeout(state.autoSwitchTimeout);
    }

    // Auto-switch to next question after 450ms smooth transition
    state.autoSwitchTimeout = setTimeout(() => {
      if (qIndex < QUIZ_DATA.questions.length - 1) {
        renderQuestion(qIndex + 1);
      } else {
        // If question 15 reached and answered, verify and submit
        finishQuiz();
      }
    }, 450);
  }

  // Prev / Next Button Handlers
  DOM.btnPrevQ.addEventListener('click', () => {
    if (state.currentQuestionIndex > 0) {
      stopQuestionCountdown();
      if (state.autoSwitchTimeout) clearTimeout(state.autoSwitchTimeout);
      renderQuestion(state.currentQuestionIndex - 1);
    }
  });

  DOM.btnNextQ.addEventListener('click', () => {
    if (state.currentQuestionIndex < QUIZ_DATA.questions.length - 1) {
      stopQuestionCountdown();
      if (state.autoSwitchTimeout) clearTimeout(state.autoSwitchTimeout);
      renderQuestion(state.currentQuestionIndex + 1);
    }
  });

  DOM.btnFinishQuiz.addEventListener('click', () => {
    finishQuiz();
  });

  // Keyboard navigation support (1-4 or A-D)
  window.addEventListener('keydown', (e) => {
    if (!DOM.quizView.classList.contains('active')) return;
    const key = e.key.toUpperCase();
    if (['A', 'B', 'C', 'D'].includes(key)) {
      handleSelectOption(key);
    } else if (['1', '2', '3', '4'].includes(key)) {
      const map = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
      handleSelectOption(map[key]);
    } else if (e.key === 'ArrowRight' && state.currentQuestionIndex < QUIZ_DATA.questions.length - 1) {
      renderQuestion(state.currentQuestionIndex + 1);
    } else if (e.key === 'ArrowLeft' && state.currentQuestionIndex > 0) {
      renderQuestion(state.currentQuestionIndex - 1);
    }
  });

  // =========================================================================
  // 3. FINISH QUIZ, EVALUATE & SAVE
  // =========================================================================
  function finishQuiz() {
    stopQuestionCountdown();
    if (state.autoSwitchTimeout) clearTimeout(state.autoSwitchTimeout);
    if (state.timerInterval) clearInterval(state.timerInterval);

    // Calculate score
    let score = 0;
    const detailedAnswers = QUIZ_DATA.questions.map((q, idx) => {
      const studentAns = state.answers[idx];
      const isCorrect = studentAns === q.correctAnswer;
      if (isCorrect) score++;

      return {
        qId: q.id,
        question: q.question,
        options: q.options,
        userAnswer: studentAns || 'Unanswered',
        correctAnswer: q.correctAnswer,
        isCorrect: isCorrect,
        responseTime: state.responseTimes[idx] !== null ? state.responseTimes[idx] : 15.0,
        speedPoints: state.speedPoints[idx] || 0,
        explanation: q.explanation,
        topic: q.topic,
        difficulty: q.difficulty
      };
    });

    const totalQ = QUIZ_DATA.questions.length;
    const percentage = Math.round((score / totalQ) * 1000) / 10;
    const durationStr = formatDuration(state.secondsElapsed);
    const completedAt = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Fastest Finger Speed Metrics
    const validTimes = state.responseTimes.map(t => (t === null ? 15.0 : t));
    const avgSpeed = (validTimes.reduce((a, b) => a + b, 0) / validTimes.length).toFixed(1);
    const fastestTime = Math.min(...validTimes).toFixed(1);
    const totalKahootPoints = state.totalSpeedPoints;

    // Discreet Speed-Accuracy Merit Scheme:
    // Base academic marks + fastest finger merit bonus
    let bonusMarks = 0;
    state.speedPoints.forEach((pts) => {
      if (pts >= 850) bonusMarks += 0.20;
      else if (pts >= 600) bonusMarks += 0.12;
      else if (pts > 0) bonusMarks += 0.05;
    });
    const meritAdjustedMark = (score + Math.min(2.0, bonusMarks)).toFixed(1);

    // Reflex Tier
    let reflexTier = '⏱️ Deliberate Thinker';
    if (score >= 12 && parseFloat(avgSpeed) <= 4.0) {
      reflexTier = '⚡ Lightning Reflexes (Tier S+)';
    } else if (score >= 10 && parseFloat(avgSpeed) <= 7.0) {
      reflexTier = '🚀 Rapid Responder (Tier S)';
    } else if (score >= 8) {
      reflexTier = '🎯 Steady Strategist (Tier A)';
    }

    // Topic performance breakdown
    const topicStats = {};
    QUIZ_DATA.questions.forEach((q, idx) => {
      const topic = q.topic;
      if (!topicStats[topic]) topicStats[topic] = { total: 0, correct: 0 };
      topicStats[topic].total++;
      if (state.answers[idx] === q.correctAnswer) {
        topicStats[topic].correct++;
      }
    });

    // Verdict
    let verdict = 'Needs Improvement';
    if (score >= 14) verdict = 'Outstanding Mastery!';
    else if (score >= 12) verdict = 'Distinction - Excellent!';
    else if (score >= 9) verdict = 'First Class - Very Good!';
    else if (score >= 8) verdict = 'Qualified - Passed';

    // Store Attempt Result Object
    const attemptRecord = {
      id: 'ATT_' + Date.now(),
      completedAt: completedAt,
      timestamp: Date.now(),
      studentName: state.currentStudent.name,
      usn: state.currentStudent.usn,
      section: state.currentStudent.section,
      email: state.currentStudent.email,
      score: score,
      totalQuestions: totalQ,
      percentage: percentage,
      duration: durationStr,
      verdict: verdict,
      speedPoints: totalKahootPoints,
      avgSpeed: avgSpeed,
      fastestTime: fastestTime,
      meritScore: meritAdjustedMark,
      reflexTier: reflexTier,
      detailedAnswers: detailedAnswers,
      topicStats: topicStats
    };

    state.lastAttemptResult = attemptRecord;
    saveAttempt(attemptRecord);
    syncAttemptToServer(attemptRecord);

    // Populate Results Screen
    displayResults(attemptRecord);
    switchView('results');
    showToast(`Quiz completed! You scored ${score}/${totalQ} • ${totalKahootPoints.toLocaleString()} Speed Points ⚡`, 'success');
  }

  // =========================================================================
  // 4. DISPLAY RESULTS SCREEN
  // =========================================================================
  function displayResults(record) {
    DOM.finalScoreVal.textContent = record.score;
    DOM.resultsVerdict.textContent = record.verdict;
    DOM.resultsPercentBadge.textContent = `${record.percentage}% Accuracy`;

    // Circular progress animation (circumference is ~440 for r=70)
    const maxDash = 440;
    const progressOffset = maxDash - (maxDash * (record.score / record.totalQuestions));
    setTimeout(() => {
      DOM.scoreCircleBar.style.strokeDashoffset = progressOffset;
    }, 100);

    // Fastest Finger Speed Analytics
    if (DOM.totalPointsDisplay) DOM.totalPointsDisplay.textContent = (record.speedPoints || 0).toLocaleString();
    if (DOM.avgSpeedDisplay) DOM.avgSpeedDisplay.textContent = `${record.avgSpeed || '0.0'}s`;
    if (DOM.fastestAnswerDisplay) DOM.fastestAnswerDisplay.textContent = `${record.fastestTime || '0.0'}s`;
    if (DOM.meritScoreDisplay) DOM.meritScoreDisplay.textContent = `${record.meritScore || record.score} / 15`;
    if (DOM.reflexTierBadge) DOM.reflexTierBadge.textContent = record.reflexTier || '⚡ Tier S+';

    // Student Recap
    DOM.recapName.textContent = record.studentName;
    DOM.recapUsn.textContent = record.usn;
    DOM.recapSection.textContent = record.section;
    DOM.recapEmail.textContent = record.email;
    DOM.recapDuration.textContent = `${record.duration} mins`;

    // Topic Performance Bars
    DOM.topicBarsContainer.innerHTML = '';
    for (const [topicName, data] of Object.entries(record.topicStats)) {
      const topicPct = Math.round((data.correct / data.total) * 100);
      const card = document.createElement('div');
      card.className = 'topic-bar-card';
      card.innerHTML = `
        <div class="topic-bar-info">
          <span>${topicName}</span>
          <span style="color: var(--accent-cyan); font-family: var(--font-mono);">${data.correct}/${data.total} (${topicPct}%)</span>
        </div>
        <div class="topic-progress-bg">
          <div class="topic-progress-bar" style="width: ${topicPct}%;"></div>
        </div>
      `;
      DOM.topicBarsContainer.appendChild(card);
    }

    // Detailed Review Accordion List
    DOM.reviewListContainer.innerHTML = '';
    record.detailedAnswers.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = `review-item ${item.isCorrect ? 'correct' : 'incorrect'}`;

      const userAnsText = item.userAnswer !== 'Unanswered' && item.options[item.userAnswer] 
        ? `${item.userAnswer}) ${item.options[item.userAnswer]}` 
        : 'Not Attempted (Time Expired)';
      const correctAnsText = `${item.correctAnswer}) ${item.options[item.correctAnswer]}`;

      itemDiv.innerHTML = `
        <div class="review-q-header">
          <div class="review-q-text">Q${index + 1}. ${item.question}</div>
          <span class="review-status-pill ${item.isCorrect ? 'correct' : 'incorrect'}">
            ${item.isCorrect ? `✓ Correct (+1)` : '✗ Incorrect (0)'}
          </span>
        </div>
        <div class="review-answers-box">
          <div class="answer-row user-ans ${item.isCorrect ? '' : 'wrong'}">
            <strong>Your Selection:</strong> <span>${userAnsText}</span>
            <span style="margin-left: auto; font-family: var(--font-mono); font-size: 0.78rem; color: ${item.speedPoints > 0 ? '#fbbf24' : 'var(--text-muted)'};">
              ⏱️ ${item.responseTime}s ${item.speedPoints > 0 ? `(+${item.speedPoints} pts)` : '(0 pts)'}
            </span>
          </div>
          ${!item.isCorrect ? `
            <div class="answer-row correct-ans">
              <strong>Correct Answer:</strong> <span>${correctAnsText}</span>
            </div>
          ` : ''}
        </div>
        <div class="review-explanation">
          <strong>Key Explanation:</strong> ${item.explanation}
        </div>
      `;
      DOM.reviewListContainer.appendChild(itemDiv);
    });
  }

  // =========================================================================
  // 5. CSV REPORT GENERATION (INDIVIDUAL & CLASS MASTER - HOST ONLY)
  // =========================================================================
  function exportIndividualCsv(record) {
    if (!record) return;

    // Build standard CSV
    const rows = [
      ['ACHARYA INSTITUTES - TEAM 1 ASSESSMENT REPORT'],
      ['Subject', 'Environmental Studies (EVS Quiz - 01)'],
      ['Date & Time', record.completedAt],
      ['Student Name', record.studentName],
      ['USN', record.usn],
      ['Section', record.section],
      ['Acharya Email', record.email],
      ['Score (out of 15)', `${record.score} / ${record.totalQuestions}`],
      ['Fastest-Finger Speed Points (Kahoot)', `${record.speedPoints || 0} pts`],
      ['Average Response Speed', `${record.avgSpeed || '0.0'}s`],
      ['Fastest Response Record', `${record.fastestTime || '0.0'}s`],
      ['Merit Adjusted Mark', `${record.meritScore || record.score} / 15`],
      ['Reflex Performance Tier', record.reflexTier || 'N/A'],
      ['Accuracy Percentage', `${record.percentage}%`],
      ['Total Time Spent', record.duration],
      ['Performance Verdict', record.verdict],
      [],
      ['Q#', 'Question', 'Topic', 'Your Answer', 'Correct Answer', 'Response Time (s)', 'Speed Pts', 'Status', 'Explanation']
    ];

    record.detailedAnswers.forEach((q, idx) => {
      rows.push([
        idx + 1,
        `"${q.question.replace(/"/g, '""')}"`,
        `"${q.topic}"`,
        `"${q.userAnswer}"`,
        `"${q.correctAnswer}"`,
        q.responseTime || '15.0',
        q.speedPoints || 0,
        q.isCorrect ? 'Correct' : 'Incorrect',
        `"${q.explanation.replace(/"/g, '""')}"`
      ]);
    });

    const csvContent = '\uFEFF' + rows.map(e => e.join(',')).join('\n');
    downloadBlob(csvContent, `Acharya_EVS_Quiz01_${record.usn}.csv`, 'text/csv;charset=utf-8;');
    showToast(`Student CSV Report exported for ${record.usn}.`, 'success');
  }

  function exportClassMasterCsv() {
    const list = getStoredAttempts();
    if (list.length === 0) {
      showToast('No class attempts available to export.', 'warn');
      return;
    }

    const headers = [
      'Record ID',
      'Submission Timestamp',
      'USN',
      'Student Name',
      'Section',
      'Acharya Email',
      'Score (out of 15)',
      'Kahoot Speed Points',
      'Avg Response Speed (s)',
      'Merit Mark (out of 15)',
      'Reflex Tier',
      'Percentage (%)',
      'Duration',
      'Result Verdict'
    ];

    // Add Q1 to Q15 columns
    for (let i = 1; i <= 15; i++) {
      headers.push(`Q${i}_Answer`);
      headers.push(`Q${i}_Time(s)`);
      headers.push(`Q${i}_Pts`);
      headers.push(`Q${i}_IsCorrect`);
    }

    const rows = [headers];

    list.forEach(item => {
      const row = [
        item.id,
        `"${item.completedAt}"`,
        `"${item.usn}"`,
        `"${item.studentName.replace(/"/g, '""')}"`,
        `"${item.section}"`,
        `"${item.email}"`,
        item.score,
        item.speedPoints || 0,
        item.avgSpeed || '0.0',
        item.meritScore || item.score,
        `"${item.reflexTier || ''}"`,
        item.percentage,
        `"${item.duration}"`,
        `"${item.verdict}"`
      ];

      for (let i = 0; i < 15; i++) {
        const qDetail = item.detailedAnswers && item.detailedAnswers[i];
        if (qDetail) {
          row.push(`"${qDetail.userAnswer}"`);
          row.push(qDetail.responseTime || '15.0');
          row.push(qDetail.speedPoints || 0);
          row.push(qDetail.isCorrect ? '1' : '0');
        } else {
          row.push('""');
          row.push('15.0');
          row.push('0');
          row.push('0');
        }
      }
      rows.push(row);
    });

    const csvContent = '\uFEFF' + rows.map(e => e.join(',')).join('\n');
    downloadBlob(csvContent, `Acharya_EVS_Quiz01_Master_Class_Report_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
    showToast(`Master CSV with ${list.length} student records exported.`, 'success');
  }

  function downloadBlob(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // =========================================================================
  // 6. PDF SCORECARD GENERATION (WITH ACHARYA BRANDING & SPEED METRICS)
  // =========================================================================
  function generateStudentPdf(record) {
    if (!record) return;

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      // Top Decorative Banner
      doc.setFillColor(7, 8, 14);
      doc.rect(0, 0, pageWidth, 42, 'F');
      doc.setFillColor(0, 242, 254);
      doc.rect(0, 42, pageWidth, 1.5, 'F');

      // Add Logo if available
      const logoToUse = (typeof window !== 'undefined' && window.ACHARYA_LOGO_BASE64) || acharyaLogoDataUrl;
      if (logoToUse) {
        try {
          doc.addImage(logoToUse, 'PNG', 14, 8, 38, 26);
        } catch (err) {
          console.warn('Could not render logo in PDF', err);
        }
      }

      // Header Typography
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text('ACHARYA INSTITUTES', 58, 16);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 242, 254);
      doc.text('EVS QUIZ - 01 : ECOSYSTEM ASSESSMENT', 58, 22);

      doc.setFontSize(8.5);
      doc.setTextColor(180, 190, 205);
      doc.text('Subject: Environmental Studies • Organized by Team 1', 58, 28);
      doc.text(`Attempted On: ${record.completedAt}`, 58, 34);

      // Student Particulars Box
      doc.setDrawColor(220, 226, 235);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, 48, pageWidth - 28, 32, 3, 3, 'FD');

      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('CANDIDATE PROFILE & SESSION RECORD', 18, 54);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);

      doc.text(`Student Name: `, 18, 61);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${record.studentName}`, 42, 61);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`College USN: `, 18, 67);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${record.usn}`, 42, 67);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Section: `, 95, 61);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${record.section}`, 110, 61);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Acharya Email: `, 95, 67);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${record.email}`, 118, 67);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Fastest-Finger Points: `, 18, 74);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(217, 119, 6);
      doc.text(`${(record.speedPoints || 0).toLocaleString()} pts`, 54, 74);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Avg Speed / Reflex: `, 95, 74);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${record.avgSpeed || '0.0'}s (${record.reflexTier || 'Standard'})`, 126, 74);

      // Score Summary Highlight Card
      const scoreBoxX = pageWidth - 55;
      doc.setFillColor(16, 185, 129);
      doc.roundedRect(scoreBoxX, 48, 41, 32, 3, 3, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('SCORE & SPEED', scoreBoxX + 9, 54);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(`${record.score} / ${record.totalQuestions}`, scoreBoxX + 12, 62);

      doc.setFontSize(8);
      doc.text(`⚡ ${(record.speedPoints || 0).toLocaleString()} pts`, scoreBoxX + 7, 69);
      doc.text(`${record.percentage}% (${record.verdict})`, scoreBoxX + 3, 76);

      // Topic Breakdown Summary Table
      const topicRows = [];
      for (const [topicName, data] of Object.entries(record.topicStats)) {
        const pct = Math.round((data.correct / data.total) * 100);
        topicRows.push([topicName, `${data.correct} / ${data.total}`, `${pct}%`]);
      }

      doc.autoTable({
        startY: 84,
        head: [['Assessment Topic Domain', 'Score', 'Percentage']],
        body: topicRows,
        theme: 'striped',
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        margin: { left: 14, right: 14 }
      });

      // Detailed Question Analysis Table with Response Speed
      const questionRows = record.detailedAnswers.map((item, idx) => {
        return [
          `Q${idx + 1}`,
          item.question,
          item.userAnswer,
          item.correctAnswer,
          `${item.responseTime || '15.0'}s`,
          item.speedPoints > 0 ? `+${item.speedPoints}` : '0',
          item.isCorrect ? 'CORRECT' : 'INCORRECT',
          item.explanation
        ];
      });

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 6,
        head: [['#', 'Question Statement', 'Choice', 'Key', 'Time', 'Pts', 'Result', 'Explanation']],
        body: questionRows,
        theme: 'grid',
        styles: {
          fontSize: 7.2,
          cellPadding: 2,
          overflow: 'linebreak'
        },
        columnStyles: {
          0: { cellWidth: 8, fontStyle: 'bold', halign: 'center' },
          1: { cellWidth: 54 },
          2: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
          3: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
          4: { cellWidth: 13, halign: 'center' },
          5: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
          6: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
          7: { cellWidth: 51 }
        },
        headStyles: {
          fillColor: [30, 41, 59],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        didParseCell: function (data) {
          if (data.section === 'body' && data.column.index === 6) {
            if (data.cell.raw === 'CORRECT') {
              data.cell.styles.textColor = [16, 185, 129];
            } else {
              data.cell.styles.textColor = [225, 29, 72];
            }
          }
        },
        margin: { left: 14, right: 14 }
      });

      // Footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Acharya Institutes • EVS Quiz-01 • Team 1 Official Verification • Page ${i} of ${totalPages}`,
          14,
          doc.internal.pageSize.getHeight() - 6
        );
      }

      // Save PDF
      doc.save(`Acharya_EVS_Quiz01_${record.usn}_Scorecard.pdf`);
      showToast('Official Acharya PDF Scorecard downloaded!', 'success');
    } catch (err) {
      console.error('PDF Generation error:', err);
      showToast('Error generating PDF report. Please check console.', 'warn');
    }
  }



  // =========================================================================
  // 6.5 MULTI-DEVICE 60-STUDENT LIVE NETWORK SYNC & OFFLINE QUEUE
  // =========================================================================
  async function syncAttemptToServer(record) {
    if (!record) return;
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      if (res.ok) {
        const data = await res.json();
        removeSyncQueueItem(record);
        if (DOM.cohortLiveStatus) {
          DOM.cohortLiveStatus.textContent = 'Live Server Sync Active';
          DOM.cohortLiveStatus.style.color = '#34d399';
        }
        showToast(`✓ Submissions synced live to Host (${data.totalSubmitted}/60 Section D students)`, 'info');
      } else {
        markOfflineMode('Server returned non-200 status');
      }
    } catch (err) {
      markOfflineMode(err.message);
    }
  }

  async function flushSyncQueue() {
    const queue = getSyncQueue();
    if (!queue || queue.length === 0) return;

    for (const item of [...queue]) {
      try {
        const res = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        if (res.ok) {
          removeSyncQueueItem(item);
        }
      } catch (err) {
        break; // Still offline, retry on next cycle
      }
    }
  }

  function markOfflineMode(reason) {
    if (DOM.cohortLiveStatus) {
      DOM.cohortLiveStatus.textContent = 'Offline Mode (Data Saved Locally)';
      DOM.cohortLiveStatus.style.color = '#fbbf24';
    }
  }

  function startHostPolling() {
    stopHostPolling();
    state.hostPollInterval = setInterval(fetchLiveServerAttempts, 3000);
  }

  function stopHostPolling() {
    if (state.hostPollInterval) {
      clearInterval(state.hostPollInterval);
      state.hostPollInterval = null;
    }
  }

  // =========================================================================
  // 7. TEACHER / HOST MASTER DASHBOARD & 60-MEMBER COHORT TRACKER
  // =========================================================================
  async function renderTeacherDashboard() {
    await fetchLiveServerAttempts();
  }

  async function fetchLiveServerAttempts() {
    let localList = getStoredAttempts();
    let mergedList = localList;

    try {
      // Flush any pending queue items first
      await flushSyncQueue();

      // 1. Query server network & cohort capacity status
      const infoRes = await fetch('/api/info');
      if (infoRes.ok) {
        const info = await infoRes.json();
        if (DOM.classroomWifiUrl) DOM.classroomWifiUrl.textContent = info.joinUrl;
        if (DOM.cohortProgressFill) DOM.cohortProgressFill.style.width = `${info.turnoutPercentage}%`;
        if (DOM.cohortProgressText) DOM.cohortProgressText.textContent = `${info.totalAttempts} / ${info.capacity} Submitted (${info.turnoutPercentage}%)`;
        if (DOM.cohortRemainingText) DOM.cohortRemainingText.textContent = `${info.remaining} Remaining to Submit`;
        if (DOM.cohortLiveStatus) {
          DOM.cohortLiveStatus.textContent = 'Live Server Sync Active';
          DOM.cohortLiveStatus.style.color = '#34d399';
        }
      }

      // 2. Fetch synchronized attempts across all 60 devices
      const attemptsRes = await fetch('/api/attempts');
      if (attemptsRes.ok) {
        const serverAttempts = await attemptsRes.json();
        if (Array.isArray(serverAttempts)) {
          mergedList = mergeAttempts(localList, serverAttempts);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedList));
        }
      }
    } catch (err) {
      markOfflineMode(err.message);
      if (DOM.classroomWifiUrl && !DOM.classroomWifiUrl.textContent.startsWith('http')) {
        DOM.classroomWifiUrl.textContent = window.location.origin || 'Offline (Local Device)';
      }
    }

    renderTeacherDashboardStats(mergedList);
  }

  function exportOfflineJson() {
    const list = getStoredAttempts();
    if (!list || list.length === 0) {
      showToast('No offline quiz records available to export.', 'warn');
      return;
    }
    const jsonStr = JSON.stringify(list, null, 2);
    downloadBlob(jsonStr, `Acharya_EVS_Quiz01_Attempts_Backup_${new Date().toISOString().slice(0, 10)}.json`, 'application/json;charset=utf-8;');
    showToast(`✓ Exported ${list.length} offline student attempts to JSON backup.`, 'success');
  }

  function renderTeacherDashboardStats(list) {
    const total = list.length;
    DOM.statTotalAttempts.textContent = total;

    // Progress bar fallback calculation
    const pct = Math.min(100, Math.round((total / state.serverCapacity) * 100));
    if (DOM.cohortProgressFill && !DOM.cohortProgressFill.style.width) {
      DOM.cohortProgressFill.style.width = `${pct}%`;
    }
    if (DOM.cohortProgressText && (!DOM.cohortProgressText.textContent || DOM.cohortProgressText.textContent.includes('0 / 60'))) {
      DOM.cohortProgressText.textContent = `${total} / ${state.serverCapacity} Submitted (${pct}%)`;
    }
    if (DOM.cohortRemainingText && (!DOM.cohortRemainingText.textContent || DOM.cohortRemainingText.textContent.includes('60 Remaining'))) {
      DOM.cohortRemainingText.textContent = `${Math.max(0, state.serverCapacity - total)} Remaining to Submit`;
    }

    if (total === 0) {
      DOM.statClassAverage.textContent = '0.0';
      DOM.statHighestScore.textContent = '0';
      DOM.statPassRate.textContent = '0%';
      DOM.adminTableBody.innerHTML = '';
      DOM.adminEmptyState.style.display = 'block';
      return;
    }

    DOM.adminEmptyState.style.display = 'none';

    let totalScore = 0;
    let highest = 0;
    let passedCount = 0;

    list.forEach(item => {
      totalScore += item.score;
      if (item.score > highest) highest = item.score;
      if (item.score >= 8) passedCount++;
    });

    const avg = (totalScore / total).toFixed(1);
    const passRate = Math.round((passedCount / total) * 100);

    DOM.statClassAverage.textContent = `${avg} / 15`;
    DOM.statHighestScore.textContent = `${highest} / 15`;
    DOM.statPassRate.textContent = `${passRate}%`;

    // Filter table
    filterAdminTable();
  }

  function filterAdminTable() {
    const list = getStoredAttempts();
    const query = DOM.adminSearchInput.value.trim().toLowerCase();

    DOM.adminTableBody.innerHTML = '';

    const filtered = list.filter(item => {
      if (!query) return true;
      return (
        item.studentName.toLowerCase().includes(query) ||
        item.usn.toLowerCase().includes(query) ||
        item.section.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query)
      );
    });

    if (filtered.length === 0) {
      DOM.adminTableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 2rem; color: var(--text-muted);">No matching students found.</td></tr>`;
      return;
    }

    filtered.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td class="usn-cell">${item.usn}</td>
        <td class="student-name-cell">${item.studentName}</td>
        <td>${item.section}</td>
        <td style="font-weight: 700; color: ${item.score >= 8 ? '#34d399' : '#fb7185'};">${item.score}/15</td>
        <td style="font-family: var(--font-mono); font-weight: 700; color: #fbbf24;">${(item.speedPoints || 0).toLocaleString()}</td>
        <td style="font-family: var(--font-mono);">${item.avgSpeed || '0.0'}s</td>
        <td style="font-family: var(--font-mono);">${item.percentage}%</td>
        <td style="font-size: 0.75rem; color: var(--text-muted);">${item.completedAt}</td>
        <td class="actions-cell">
          <button class="btn-table-action btn-table-csv" data-idx="${index}" title="Download Candidate CSV (Host Only)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>CSV</span>
          </button>
          <button class="btn-table-action btn-table-pdf" data-idx="${index}" title="Download Candidate PDF Scorecard">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span>PDF</span>
          </button>
        </td>
      `;

      const btnCsv = tr.querySelector('.btn-table-csv');
      const btnPdf = tr.querySelector('.btn-table-pdf');
      if (btnCsv) {
        btnCsv.addEventListener('click', (ev) => {
          ev.stopPropagation();
          exportIndividualCsv(item);
        });
      }
      if (btnPdf) {
        btnPdf.addEventListener('click', (ev) => {
          ev.stopPropagation();
          generateStudentPdf(item);
        });
      }

      DOM.adminTableBody.appendChild(tr);
    });
  }

  // =========================================================================
  // 6. HOST AUTHENTICATION & ACCESS CONTROL
  // =========================================================================
  function openHostAuthModal() {
    if (DOM.hostPasscodeInput) DOM.hostPasscodeInput.value = '';
    if (DOM.hostAuthError) DOM.hostAuthError.style.display = 'none';
    if (DOM.hostAuthModal) DOM.hostAuthModal.classList.add('active');
    setTimeout(() => {
      if (DOM.hostPasscodeInput) DOM.hostPasscodeInput.focus();
    }, 120);
  }

  function closeHostAuthModal() {
    if (DOM.hostAuthModal) DOM.hostAuthModal.classList.remove('active');
    if (DOM.hostPasscodeInput) DOM.hostPasscodeInput.value = '';
    if (DOM.hostAuthError) DOM.hostAuthError.style.display = 'none';
  }

  function handleHostAuthSubmit(e) {
    e.preventDefault();
    const entered = DOM.hostPasscodeInput ? DOM.hostPasscodeInput.value.trim().toLowerCase() : '';

    if (VALID_HOST_PASSWORDS.includes(entered)) {
      state.isHostAuthenticated = true;
      sessionStorage.setItem('ACHARYA_HOST_AUTH', 'true');
      closeHostAuthModal();
      DOM.teacherModal.classList.add('active');
      renderTeacherDashboard();
      startHostPolling();
      showToast('✓ Host authenticated. Dashboard unlocked.', 'success');
    } else {
      if (DOM.hostAuthError) DOM.hostAuthError.style.display = 'block';
      if (DOM.hostPasscodeInput) DOM.hostPasscodeInput.select();
    }
  }

  function lockHostMode() {
    state.isHostAuthenticated = false;
    sessionStorage.removeItem('ACHARYA_HOST_AUTH');
    DOM.teacherModal.classList.remove('active');
    stopHostPolling();
    showToast('🔒 Host dashboard locked.', 'info');
  }

  // Teacher / Host modal toggle (Password Protected)
  DOM.btnTeacherDash.addEventListener('click', () => {
    if (state.isHostAuthenticated) {
      DOM.teacherModal.classList.add('active');
      renderTeacherDashboard();
      startHostPolling();
    } else {
      openHostAuthModal();
    }
  });

  DOM.btnCloseTeacherModal.addEventListener('click', () => {
    DOM.teacherModal.classList.remove('active');
    stopHostPolling();
  });

  DOM.btnCloseTeacherModal2.addEventListener('click', () => {
    DOM.teacherModal.classList.remove('active');
    stopHostPolling();
  });

  if (DOM.btnLockHostMode) {
    DOM.btnLockHostMode.addEventListener('click', lockHostMode);
  }

  if (DOM.hostAuthForm) {
    DOM.hostAuthForm.addEventListener('submit', handleHostAuthSubmit);
  }
  if (DOM.btnCloseHostAuthModal) {
    DOM.btnCloseHostAuthModal.addEventListener('click', closeHostAuthModal);
  }
  if (DOM.btnCancelHostAuth) {
    DOM.btnCancelHostAuth.addEventListener('click', closeHostAuthModal);
  }
  if (DOM.hostAuthModal) {
    DOM.hostAuthModal.addEventListener('click', (e) => {
      if (e.target === DOM.hostAuthModal) closeHostAuthModal();
    });
  }

  // Copy Classroom Wi-Fi URL Button
  if (DOM.btnCopyClassUrl) {
    DOM.btnCopyClassUrl.addEventListener('click', () => {
      const urlText = DOM.classroomWifiUrl ? DOM.classroomWifiUrl.textContent.trim() : '';
      if (urlText && !urlText.includes('Loading')) {
        navigator.clipboard.writeText(urlText).then(() => {
          showToast('✓ Classroom URL copied! Share with all 60 students.', 'success');
        }).catch(() => {
          showToast(`URL: ${urlText}`, 'info');
        });
      }
    });
  }

  DOM.adminSearchInput.addEventListener('input', filterAdminTable);

  DOM.btnExportClassCsv.addEventListener('click', exportClassMasterCsv);
  if (DOM.btnExportOfflineJson) {
    DOM.btnExportOfflineJson.addEventListener('click', exportOfflineJson);
  }

  window.addEventListener('online', () => {
    flushSyncQueue();
    fetchLiveServerAttempts();
    showToast('🌐 Network reconnected. Syncing offline data...', 'info');
  });

  // Background queue sync check every 15s
  setInterval(flushSyncQueue, 15000);

  DOM.btnClearData.addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear all student quiz records from this device and host server?')) {
      localStorage.removeItem(STORAGE_KEY);
      try {
        await fetch('/api/attempts', { method: 'DELETE' });
      } catch (e) {}
      renderTeacherDashboard();
      showToast('All previous quiz session records cleared.', 'info');
    }
  });

  // Close modal when clicking outside
  DOM.teacherModal.addEventListener('click', (e) => {
    if (e.target === DOM.teacherModal) {
      DOM.teacherModal.classList.remove('active');
      stopHostPolling();
    }
  });

  // =========================================================================
  // 8. EVENT LISTENERS
  // =========================================================================
  DOM.loginForm.addEventListener('submit', handleLoginSubmit);

  DOM.btnDownloadPdf.addEventListener('click', () => {
    generateStudentPdf(state.lastAttemptResult);
  });

  DOM.btnNewStudent.addEventListener('click', () => {
    stopQuestionCountdown();
    if (state.timerInterval) clearInterval(state.timerInterval);
    DOM.loginForm.reset();
    DOM.inputSection.value = 'Section D';
    switchView('login');
    showToast('Ready for next candidate.', 'info');
  });

  // Init
  preloadLogoBase64();

})();
