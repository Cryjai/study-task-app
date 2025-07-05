// AhCry PWA - Main Application JavaScript
// 專為ADHD/gifted用戶設計的任務管理和學習應用

class AhCryApp {
    constructor() {
        this.currentUser = null;
        this.currentView = 'dashboard';
        this.studyTimer = null;
        this.studyTimeRemaining = 25 * 60; // 25 minutes in seconds
        this.isStudyTimerRunning = false;
        
        // Initialize app data
        this.initializeData();
        
        // Bind event handlers
        this.bindEvents();
        
        // Check authentication state
        this.checkAuthState();
        
        // Initialize PWA features
        this.initializePWA();
    }

    initializeData() {
        // Initialize with sample data if not exists
        if (!localStorage.getItem('ahcry_users')) {
            const initialData = {
                users: [
                    {
                        id: "user1",
                        email: "ahcry@example.com",
                        username: "AhCry阿Cry",
                        level: 15,
                        xp: 2350,
                        coins: 1250,
                        streak: 7,
                        weeklyStreak: 3,
                        avatar: "",
                        isAdmin: true,
                        joinDate: "2024-01-15",
                        badges: ["early_adopter", "streak_master", "task_ninja"],
                        settings: {
                            darkMode: false,
                            notifications: true,
                            publicProfile: true
                        }
                    }
                ],
                tasks: [
                    {
                        id: "task1",
                        title: "完成Calculus作業",
                        description: "微積分第三章練習題",
                        userId: "user1",
                        progress: 75,
                        privacy: "private",
                        dueDate: "2025-07-08",
                        category: "學習",
                        tags: ["數學", "作業"],
                        xpReward: 50,
                        completed: false,
                        createdAt: "2025-07-06"
                    },
                    {
                        id: "task2", 
                        title: "準備DSE英文口試",
                        description: "練習Part A和Part B",
                        userId: "user1",
                        progress: 30,
                        privacy: "friends",
                        dueDate: "2025-07-10",
                        category: "考試",
                        tags: ["英文", "DSE"],
                        xpReward: 100,
                        completed: false,
                        createdAt: "2025-07-05"
                    }
                ],
                guilds: [
                    {
                        id: "guild1",
                        name: "DSE戰士",
                        description: "一起衝刺DSE的小夥伴們",
                        members: ["user1"],
                        challenges: [
                            {
                                id: "challenge1",
                                title: "一週完成20個練習",
                                description: "本週內完成20個不同科目練習",
                                startDate: "2025-07-06",
                                endDate: "2025-07-13",
                                participants: ["user1"],
                                leaderboard: [
                                    {"userId": "user1", "progress": 8}
                                ]
                            }
                        ]
                    }
                ],
                leaderboard: [
                    {
                        userId: "user1",
                        username: "AhCry阿Cry",
                        xp: 2350,
                        level: 15,
                        weeklyXp: 420
                    }
                ],
                studyRooms: [
                    {
                        id: "room1",
                        name: "數學專題討論",
                        description: "一起解決數學難題",
                        participants: ["user1"],
                        isActive: true,
                        subject: "數學"
                    }
                ],
                gamification: {
                    levels: [
                        {"level": 1, "requiredXp": 0, "title": "新手"},
                        {"level": 2, "requiredXp": 100, "title": "學習者"},
                        {"level": 5, "requiredXp": 500, "title": "努力生"},
                        {"level": 10, "requiredXp": 1500, "title": "學霸"},
                        {"level": 15, "requiredXp": 3000, "title": "學神"},
                        {"level": 20, "requiredXp": 5000, "title": "傳說"}
                    ],
                    badges: [
                        {"id": "early_adopter", "name": "早鳥用戶", "description": "最早加入AhCry的用戶之一"},
                        {"id": "streak_master", "name": "連擊大師", "description": "連續7天完成任務"},
                        {"id": "task_ninja", "name": "任務忍者", "description": "一天內完成5個任務"}
                    ],
                    shop: [
                        {"id": "theme1", "name": "櫻花主題", "price": 500, "type": "theme"},
                        {"id": "avatar1", "name": "學霸頭像框", "price": 300, "type": "avatar"},
                        {"id": "boost1", "name": "XP雙倍券", "price": 200, "type": "boost"}
                    ]
                }
            };
            
            localStorage.setItem('ahcry_users', JSON.stringify(initialData.users));
            localStorage.setItem('ahcry_tasks', JSON.stringify(initialData.tasks));
            localStorage.setItem('ahcry_guilds', JSON.stringify(initialData.guilds));
            localStorage.setItem('ahcry_leaderboard', JSON.stringify(initialData.leaderboard));
            localStorage.setItem('ahcry_studyRooms', JSON.stringify(initialData.studyRooms));
            localStorage.setItem('ahcry_gamification', JSON.stringify(initialData.gamification));
        }
    }

    bindEvents() {
        // Authentication events
        document.getElementById('loginBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        document.getElementById('registerBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
        document.getElementById('showRegisterBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegister();
        });
        document.getElementById('showLoginBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLogin();
        });
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });

        // Navigation events
        document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });

        // Task management events
        document.getElementById('createTaskBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showCreateTaskModal();
        });
        document.getElementById('createTaskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateTask(e);
        });
        document.getElementById('cancelTaskBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideCreateTaskModal();
        });

        // Study timer events
        document.getElementById('startTimerBtn').addEventListener('click', () => this.startStudyTimer());
        document.getElementById('pauseTimerBtn').addEventListener('click', () => this.pauseStudyTimer());
        document.getElementById('resetTimerBtn').addEventListener('click', () => this.resetStudyTimer());

        // Settings events
        document.getElementById('darkModeToggle').addEventListener('click', () => this.toggleDarkMode());
        document.getElementById('notificationToggle').addEventListener('click', () => this.toggleNotifications());
        document.getElementById('publicProfileToggle').addEventListener('click', () => this.togglePublicProfile());

        // Guild events
        document.getElementById('createGuildBtn').addEventListener('click', () => this.showCreateGuildModal());

        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') || e.target.id === 'createTaskModal') {
                this.hideCreateTaskModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'n':
                        e.preventDefault();
                        if (this.currentUser) {
                            this.showCreateTaskModal();
                        }
                        break;
                    case 'd':
                        e.preventDefault();
                        if (this.currentUser) {
                            this.switchView('dashboard');
                        }
                        break;
                    case 't':
                        e.preventDefault();
                        if (this.currentUser) {
                            this.switchView('tasks');
                        }
                        break;
                }
            }
        });
    }

    checkAuthState() {
        const currentUserId = localStorage.getItem('ahcry_currentUser');
        if (currentUserId) {
            const users = JSON.parse(localStorage.getItem('ahcry_users') || '[]');
            this.currentUser = users.find(user => user.id === currentUserId);
            if (this.currentUser) {
                this.showApp();
                this.updateUserInfo();
                this.loadDashboard();
            } else {
                this.showAuth();
            }
        } else {
            this.showAuth();
        }
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        if (!email || !password) {
            this.showNotification('請填寫所有欄位', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showNotification('請輸入有效的電郵地址', 'error');
            return;
        }

        // Simulate login - in real app, this would authenticate with backend
        const users = JSON.parse(localStorage.getItem('ahcry_users') || '[]');
        const user = users.find(u => u.email === email);

        if (user) {
            this.currentUser = user;
            localStorage.setItem('ahcry_currentUser', user.id);
            this.showApp();
            this.updateUserInfo();
            this.loadDashboard();
            this.showNotification('歡迎回來！', 'success');
        } else {
            this.showNotification('電郵或密碼不正確', 'error');
        }
    }

    handleRegister() {
        const email = document.getElementById('registerEmail').value.trim();
        const username = document.getElementById('registerUsername').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        console.log('Register attempt:', { email, username, password, confirmPassword });

        if (!email || !username || !password || !confirmPassword) {
            this.showNotification('請填寫所有欄位', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showNotification('請輸入有效的電郵地址', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('密碼必須至少6個字符', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('密碼確認不符', 'error');
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('ahcry_users') || '[]');
        if (users.find(u => u.email === email)) {
            this.showNotification('此電郵已被使用', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: 'user' + Date.now(),
            email: email,
            username: username,
            level: 1,
            xp: 0,
            coins: 100,
            streak: 0,
            weeklyStreak: 0,
            avatar: "",
            isAdmin: false,
            joinDate: new Date().toISOString().split('T')[0],
            badges: [],
            settings: {
                darkMode: false,
                notifications: true,
                publicProfile: true
            }
        };

        users.push(newUser);
        localStorage.setItem('ahcry_users', JSON.stringify(users));
        
        this.currentUser = newUser;
        localStorage.setItem('ahcry_currentUser', newUser.id);
        
        // Clear form
        document.getElementById('registerForm').reset();
        
        this.showApp();
        this.updateUserInfo();
        this.loadDashboard();
        this.showNotification('註冊成功！歡迎加入AhCry！', 'success');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    handleLogout() {
        localStorage.removeItem('ahcry_currentUser');
        this.currentUser = null;
        this.showAuth();
        this.showNotification('已登出', 'info');
    }

    showAuth() {
        document.getElementById('authScreen').classList.remove('hidden');
        document.getElementById('appScreen').classList.add('hidden');
    }

    showApp() {
        document.getElementById('authScreen').classList.add('hidden');
        document.getElementById('appScreen').classList.remove('hidden');
        
        // Show admin panel if user is admin
        if (this.currentUser && this.currentUser.isAdmin) {
            document.querySelector('.admin-only').classList.remove('hidden');
        }
    }

    showRegister() {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
    }

    showLogin() {
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
    }

    updateUserInfo() {
        if (!this.currentUser) return;

        // Update navigation info
        document.getElementById('userLevel').textContent = this.currentUser.level;
        document.getElementById('userCoins').textContent = this.currentUser.coins;
        
        // Update dashboard info
        document.getElementById('currentLevel').textContent = this.currentUser.level;
        document.getElementById('currentXP').textContent = this.currentUser.xp;
        document.getElementById('streakCount').textContent = this.currentUser.streak;
        
        // Update XP progress bar
        const gamification = JSON.parse(localStorage.getItem('ahcry_gamification') || '{}');
        const currentLevelData = gamification.levels.find(l => l.level === this.currentUser.level);
        const nextLevelData = gamification.levels.find(l => l.level === this.currentUser.level + 1);
        
        if (currentLevelData && nextLevelData) {
            const progressPercent = ((this.currentUser.xp - currentLevelData.requiredXp) / (nextLevelData.requiredXp - currentLevelData.requiredXp)) * 100;
            document.getElementById('xpProgress').style.width = Math.min(Math.max(progressPercent, 0), 100) + '%';
            document.getElementById('nextLevelXP').textContent = nextLevelData.requiredXp;
        } else if (currentLevelData) {
            // Max level reached
            document.getElementById('xpProgress').style.width = '100%';
            document.getElementById('nextLevelXP').textContent = this.currentUser.xp;
        }
        
        // Update profile view
        document.getElementById('profileUsername').textContent = this.currentUser.username;
        document.getElementById('profileLevel').textContent = this.currentUser.level;
        document.getElementById('profileXP').textContent = this.currentUser.xp;
        document.getElementById('profileCoins').textContent = this.currentUser.coins;
        document.getElementById('profileStreak').textContent = this.currentUser.streak;
        
        // Update settings toggles
        document.getElementById('darkModeToggle').textContent = this.currentUser.settings.darkMode ? '淺色' : '深色';
        document.getElementById('notificationToggle').textContent = this.currentUser.settings.notifications ? '開啟' : '關閉';
        document.getElementById('publicProfileToggle').textContent = this.currentUser.settings.publicProfile ? '開啟' : '關閉';
    }

    switchView(viewName) {
        if (!this.currentUser) return;

        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Show selected view
        const targetView = document.getElementById(viewName + 'View');
        if (targetView) {
            targetView.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
            link.classList.remove('active');
        });
        
        document.querySelectorAll(`[data-view="${viewName}"]`).forEach(link => {
            link.classList.add('active');
        });

        this.currentView = viewName;

        // Load view specific data
        switch(viewName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'tasks':
                this.loadTasks();
                break;
            case 'guilds':
                this.loadGuilds();
                break;
            case 'study':
                this.loadStudyRooms();
                break;
            case 'leaderboard':
                this.loadLeaderboard();
                break;
            case 'profile':
                this.loadProfile();
                break;
            case 'admin':
                this.loadAdmin();
                break;
        }
    }

    loadDashboard() {
        const tasks = JSON.parse(localStorage.getItem('ahcry_tasks') || '[]');
        const userTasks = tasks.filter(task => task.userId === this.currentUser.id);
        const todayTasks = userTasks.filter(task => !task.completed);

        document.getElementById('todayTasksCount').textContent = todayTasks.length;

        // Load recent tasks
        const recentTasks = userTasks.slice(-5);
        const recentTasksContainer = document.getElementById('recentTasks');
        recentTasksContainer.innerHTML = '';

        recentTasks.forEach(task => {
            const taskElement = this.createTaskElement(task, true);
            recentTasksContainer.appendChild(taskElement);
        });

        if (recentTasks.length === 0) {
            recentTasksContainer.innerHTML = '<div class="text-center text-text-secondary py-8">還沒有任務，<a href="#" class="text-primary cursor-pointer" onclick="app.showCreateTaskModal()">立即創建</a>你的第一個任務吧！</div>';
        }
    }

    loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('ahcry_tasks') || '[]');
        const userTasks = tasks.filter(task => task.userId === this.currentUser.id);
        
        const tasksList = document.getElementById('tasksList');
        tasksList.innerHTML = '';

        userTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            tasksList.appendChild(taskElement);
        });

        if (userTasks.length === 0) {
            tasksList.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div><div class="empty-state-title">還沒有任務</div><div class="empty-state-description">創建你的第一個任務，開始你的學習之旅！</div><button class="btn btn--primary" onclick="app.showCreateTaskModal()">創建任務</button></div>';
        }

        // Update task statistics
        const completed = userTasks.filter(t => t.completed).length;
        const inProgress = userTasks.filter(t => !t.completed).length;
        
        document.getElementById('totalTasks').textContent = userTasks.length;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('inProgressTasks').textContent = inProgress;
    }

    createTaskElement(task, isCompact = false) {
        const taskDiv = document.createElement('div');
        taskDiv.className = `task-card ${task.completed ? 'completed' : ''}`;
        taskDiv.dataset.taskId = task.id;

        const privacyLabels = {
            'private': '私人',
            'friends': '朋友',
            'public': '公開'
        };

        taskDiv.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                    <h4 class="font-bold text-lg mb-1 ${task.completed ? 'line-through' : ''}">${task.title}</h4>
                    <p class="text-text-secondary text-sm mb-2">${task.description}</p>
                </div>
                <div class="flex items-center gap-2 ml-4">
                    <span class="task-privacy ${task.privacy}">${privacyLabels[task.privacy]}</span>
                    <span class="task-category">${task.category}</span>
                </div>
            </div>
            
            <div class="task-progress mb-3">
                <div class="task-progress-fill" style="width: ${task.progress}%"></div>
            </div>
            
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <span class="text-sm text-text-secondary">進度: ${task.progress}%</span>
                    <span class="text-sm text-text-secondary">截止: ${task.dueDate}</span>
                    <span class="xp-badge">+${task.xpReward} XP</span>
                </div>
                <div class="flex items-center gap-2">
                    ${!task.completed ? `
                        <button class="btn btn--sm btn--outline" onclick="app.updateTaskProgress('${task.id}', ${Math.min(task.progress + 25, 100)})">
                            +25%
                        </button>
                        <button class="btn btn--sm btn--primary" onclick="app.completeTask('${task.id}')">
                            完成
                        </button>
                    ` : `
                        <span class="status status--success">已完成</span>
                    `}
                </div>
            </div>
            
            ${task.tags && task.tags.length > 0 ? `
                <div class="task-tags">
                    ${task.tags.map(tag => `<span class="task-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
        `;

        return taskDiv;
    }

    showCreateTaskModal() {
        document.getElementById('createTaskModal').classList.remove('hidden');
        document.getElementById('taskTitle').focus();
    }

    hideCreateTaskModal() {
        document.getElementById('createTaskModal').classList.add('hidden');
        document.getElementById('createTaskForm').reset();
    }

    handleCreateTask(e) {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const dueDate = document.getElementById('taskDueDate').value;
        const privacy = document.getElementById('taskPrivacy').value;
        const category = document.getElementById('taskCategory').value;

        if (!title) {
            this.showNotification('請輸入任務標題', 'error');
            return;
        }

        const newTask = {
            id: 'task' + Date.now(),
            title: title,
            description: description || '沒有描述',
            userId: this.currentUser.id,
            progress: 0,
            privacy: privacy,
            dueDate: dueDate || new Date().toISOString().split('T')[0],
            category: category,
            tags: [],
            xpReward: 50,
            completed: false,
            createdAt: new Date().toISOString().split('T')[0]
        };

        const tasks = JSON.parse(localStorage.getItem('ahcry_tasks') || '[]');
        tasks.push(newTask);
        localStorage.setItem('ahcry_tasks', JSON.stringify(tasks));

        this.hideCreateTaskModal();
        this.loadTasks();
        this.loadDashboard();
        this.showNotification('任務創建成功！', 'success');
    }

    updateTaskProgress(taskId, newProgress) {
        const tasks = JSON.parse(localStorage.getItem('ahcry_tasks') || '[]');
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            const oldProgress = task.progress;
            task.progress = Math.min(newProgress, 100);
            localStorage.setItem('ahcry_tasks', JSON.stringify(tasks));
            
            // Award XP for progress
            if (newProgress > oldProgress) {
                this.awardXP(10);
            }
            
            this.loadTasks();
            this.loadDashboard();
            this.showNotification(`任務進度更新至 ${task.progress}%`, 'info');
        }
    }

    completeTask(taskId) {
        const tasks = JSON.parse(localStorage.getItem('ahcry_tasks') || '[]');
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            task.completed = true;
            task.progress = 100;
            localStorage.setItem('ahcry_tasks', JSON.stringify(tasks));
            
            // Award XP and coins
            this.awardXP(task.xpReward);
            this.awardCoins(25);
            
            // Update streak
            this.updateStreak();
            
            this.loadTasks();
            this.loadDashboard();
            this.updateUserInfo();
            this.showNotification(`任務完成！獲得 ${task.xpReward} XP 和 25 金幣`, 'success');
            
            // Trigger celebration animation
            this.triggerCelebration();
        }
    }

    awardXP(amount) {
        if (!this.currentUser) return;
        
        const oldLevel = this.currentUser.level;
        this.currentUser.xp += amount;
        
        // Check for level up
        const gamification = JSON.parse(localStorage.getItem('ahcry_gamification') || '{}');
        const newLevel = this.calculateLevel(this.currentUser.xp, gamification.levels);
        
        if (newLevel > oldLevel) {
            this.currentUser.level = newLevel;
            this.triggerLevelUp(newLevel);
        }
        
        // Update user in storage
        this.updateUserInStorage();
    }

    awardCoins(amount) {
        if (!this.currentUser) return;
        
        this.currentUser.coins += amount;
        this.updateUserInStorage();
    }

    calculateLevel(xp, levels) {
        let level = 1;
        for (const levelData of levels) {
            if (xp >= levelData.requiredXp) {
                level = levelData.level;
            } else {
                break;
            }
        }
        return level;
    }

    updateStreak() {
        if (!this.currentUser) return;
        
        const today = new Date().toISOString().split('T')[0];
        const lastTaskDate = localStorage.getItem('ahcry_lastTaskDate_' + this.currentUser.id);
        
        if (lastTaskDate !== today) {
            this.currentUser.streak += 1;
            localStorage.setItem('ahcry_lastTaskDate_' + this.currentUser.id, today);
            
            // Check for streak badges
            if (this.currentUser.streak === 7 && !this.currentUser.badges.includes('streak_master')) {
                this.currentUser.badges.push('streak_master');
                this.showNotification('解鎖成就：連擊大師！', 'success');
            }
            
            this.updateUserInStorage();
        }
    }

    updateUserInStorage() {
        const users = JSON.parse(localStorage.getItem('ahcry_users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = this.currentUser;
            localStorage.setItem('ahcry_users', JSON.stringify(users));
        }
    }

    triggerCelebration() {
        // Task completion animation
        const taskElements = document.querySelectorAll('.task-card');
        taskElements.forEach(el => {
            if (el.classList.contains('completed')) {
                el.classList.add('task-complete-animation');
                setTimeout(() => el.classList.remove('task-complete-animation'), 500);
            }
        });
    }

    triggerLevelUp(newLevel) {
        const gamification = JSON.parse(localStorage.getItem('ahcry_gamification') || '{}');
        const levelData = gamification.levels.find(l => l.level === newLevel);
        
        this.showNotification(`等級提升！現在是 ${newLevel} 級 ${levelData ? levelData.title : ''}！`, 'success');
        
        // Level up animation
        const levelElement = document.getElementById('userLevel');
        if (levelElement) {
            levelElement.classList.add('level-up-animation');
            setTimeout(() => {
                levelElement.classList.remove('level-up-animation');
            }, 600);
        }
    }

    loadGuilds() {
        const guilds = JSON.parse(localStorage.getItem('ahcry_guilds') || '[]');
        const guildsList = document.getElementById('guildsList');
        guildsList.innerHTML = '';

        guilds.forEach(guild => {
            const guildElement = document.createElement('div');
            guildElement.className = 'guild-card';
            guildElement.innerHTML = `
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <h4 class="font-bold text-lg mb-2">${guild.name}</h4>
                        <p class="text-text-secondary text-sm mb-3">${guild.description}</p>
                        <div class="flex items-center gap-4">
                            <span class="text-sm text-text-secondary">成員: ${guild.members.length}</span>
                            <span class="text-sm text-text-secondary">挑戰: ${guild.challenges.length}</span>
                        </div>
                    </div>
                    <button class="btn btn--primary btn--sm">加入</button>
                </div>
                
                ${guild.challenges.length > 0 ? `
                    <div class="border-t border-border pt-4">
                        <h5 class="font-bold mb-2">活躍挑戰</h5>
                        ${guild.challenges.map(challenge => `
                            <div class="bg-secondary p-3 rounded mb-2">
                                <div class="font-medium text-sm">${challenge.title}</div>
                                <div class="text-xs text-text-secondary">${challenge.description}</div>
                                <div class="text-xs text-text-secondary mt-1">截止: ${challenge.endDate}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            `;
            guildsList.appendChild(guildElement);
        });

        if (guilds.length === 0) {
            guildsList.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🏰</div><div class="empty-state-title">還沒有公會</div><div class="empty-state-description">創建或加入公會，與朋友一起學習！</div><button class="btn btn--primary" onclick="app.showCreateGuildModal()">創建公會</button></div>';
        }
    }

    loadStudyRooms() {
        const studyRooms = JSON.parse(localStorage.getItem('ahcry_studyRooms') || '[]');
        const studyRoomsList = document.getElementById('studyRoomsList');
        studyRoomsList.innerHTML = '';

        studyRooms.forEach(room => {
            const roomElement = document.createElement('div');
            roomElement.className = 'study-room-card';
            roomElement.innerHTML = `
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <h4 class="font-bold text-lg mb-1">${room.name}</h4>
                        <p class="text-text-secondary text-sm mb-2">${room.description}</p>
                        <div class="flex items-center gap-4">
                            <span class="text-sm text-text-secondary">科目: ${room.subject}</span>
                            <span class="text-sm text-text-secondary">參與者: ${room.participants.length}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="participant-indicator"></div>
                        <span class="text-sm text-success">${room.isActive ? '活躍' : '休息'}</span>
                    </div>
                </div>
                <button class="btn btn--primary btn--sm btn--full-width">加入學習室</button>
            `;
            studyRoomsList.appendChild(roomElement);
        });

        if (studyRooms.length === 0) {
            studyRoomsList.innerHTML = '<div class="text-center text-text-secondary py-8">暫無活躍學習室<br><button class="btn btn--primary mt-4">創建學習室</button></div>';
        }
    }

    loadLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('ahcry_leaderboard') || '[]');
        const leaderboardList = document.getElementById('leaderboardList');
        leaderboardList.innerHTML = '';

        leaderboard.sort((a, b) => b.xp - a.xp).forEach((user, index) => {
            const rank = index + 1;
            const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';
            
            const userElement = document.createElement('div');
            userElement.className = 'leaderboard-item';
            userElement.innerHTML = `
                <div class="leaderboard-rank ${rankClass}">${rank}</div>
                <div class="leaderboard-info flex-1">
                    <div class="font-bold">${user.username}</div>
                    <div class="text-sm text-text-secondary">等級 ${user.level}</div>
                </div>
                <div class="leaderboard-stats">
                    <div class="text-right">
                        <div class="font-bold">${user.xp} XP</div>
                        <div class="text-sm text-text-secondary">本週: ${user.weeklyXp}</div>
                    </div>
                </div>
            `;
            leaderboardList.appendChild(userElement);
        });

        if (leaderboard.length === 0) {
            leaderboardList.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🏆</div><div class="empty-state-title">排行榜暫時為空</div><div class="empty-state-description">完成更多任務來登上排行榜！</div></div>';
        }
    }

    loadProfile() {
        const gamification = JSON.parse(localStorage.getItem('ahcry_gamification') || '{}');
        const badgesList = document.getElementById('badgesList');
        badgesList.innerHTML = '';

        if (this.currentUser.badges.length > 0) {
            this.currentUser.badges.forEach(badgeId => {
                const badge = gamification.badges.find(b => b.id === badgeId);
                if (badge) {
                    const badgeElement = document.createElement('div');
                    badgeElement.className = 'badge';
                    badgeElement.innerHTML = `
                        <div class="badge-icon">🏆</div>
                        <div class="badge-name">${badge.name}</div>
                        <div class="badge-description">${badge.description}</div>
                    `;
                    badgesList.appendChild(badgeElement);
                }
            });
        } else {
            badgesList.innerHTML = '<div class="col-span-2 text-center text-text-secondary py-8">還沒有成就徽章<br>完成更多任務來解鎖！</div>';
        }
    }

    loadAdmin() {
        if (!this.currentUser || !this.currentUser.isAdmin) return;
        
        const users = JSON.parse(localStorage.getItem('ahcry_users') || '[]');
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = '';

        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'flex items-center justify-between p-4 bg-surface border border-border rounded-lg mb-3';
            userElement.innerHTML = `
                <div class="flex-1">
                    <div class="font-bold">${user.username}</div>
                    <div class="text-sm text-text-secondary">${user.email}</div>
                    <div class="text-sm text-text-secondary">等級 ${user.level} • ${user.xp} XP • 加入日期: ${user.joinDate}</div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="status ${user.isAdmin ? 'status--warning' : 'status--info'}">${user.isAdmin ? '管理員' : '用戶'}</span>
                    <button class="btn btn--outline btn--sm">編輯</button>
                    <button class="btn btn--outline btn--sm text-error">刪除</button>
                </div>
            `;
            usersList.appendChild(userElement);
        });
    }

    // Study Timer Functions
    startStudyTimer() {
        this.isStudyTimerRunning = true;
        this.studyTimer = setInterval(() => {
            this.studyTimeRemaining--;
            this.updateTimerDisplay();
            
            if (this.studyTimeRemaining <= 0) {
                this.pauseStudyTimer();
                this.showNotification('番茄鐘時間到！休息一下吧！', 'success');
                this.awardXP(20);
                this.updateUserInfo();
            }
        }, 1000);
        
        document.getElementById('startTimerBtn').textContent = '進行中...';
        document.getElementById('startTimerBtn').disabled = true;
    }

    pauseStudyTimer() {
        this.isStudyTimerRunning = false;
        if (this.studyTimer) {
            clearInterval(this.studyTimer);
            this.studyTimer = null;
        }
        
        document.getElementById('startTimerBtn').textContent = '開始';
        document.getElementById('startTimerBtn').disabled = false;
    }

    resetStudyTimer() {
        this.pauseStudyTimer();
        this.studyTimeRemaining = 25 * 60;
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.studyTimeRemaining / 60);
        const seconds = this.studyTimeRemaining % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('studyTimer').textContent = display;
    }

    // Settings Functions
    toggleDarkMode() {
        const html = document.documentElement;
        const currentScheme = html.getAttribute('data-color-scheme');
        const newScheme = currentScheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-color-scheme', newScheme);
        
        if (this.currentUser) {
            this.currentUser.settings.darkMode = newScheme === 'dark';
            this.updateUserInStorage();
        }
        
        document.getElementById('darkModeToggle').textContent = newScheme === 'dark' ? '淺色' : '深色';
        this.showNotification(`已切換至${newScheme === 'dark' ? '深色' : '淺色'}模式`, 'info');
    }

    toggleNotifications() {
        if (this.currentUser) {
            this.currentUser.settings.notifications = !this.currentUser.settings.notifications;
            this.updateUserInStorage();
            
            const button = document.getElementById('notificationToggle');
            button.textContent = this.currentUser.settings.notifications ? '開啟' : '關閉';
            this.showNotification(`通知已${this.currentUser.settings.notifications ? '開啟' : '關閉'}`, 'info');
        }
    }

    togglePublicProfile() {
        if (this.currentUser) {
            this.currentUser.settings.publicProfile = !this.currentUser.settings.publicProfile;
            this.updateUserInStorage();
            
            const button = document.getElementById('publicProfileToggle');
            button.textContent = this.currentUser.settings.publicProfile ? '開啟' : '關閉';
            this.showNotification(`公開檔案已${this.currentUser.settings.publicProfile ? '開啟' : '關閉'}`, 'info');
        }
    }

    // Modal Functions
    showCreateGuildModal() {
        this.showNotification('創建公會功能開發中...', 'info');
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // PWA Functions
    initializePWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(err => {
                console.log('Service Worker registration failed:', err);
            });
        }

        // Handle install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install prompt
            const installPrompt = document.createElement('div');
            installPrompt.className = 'pwa-install-prompt';
            installPrompt.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <h3 class="font-bold mb-1">安裝 AhCry</h3>
                        <p class="text-sm text-text-secondary">將 AhCry 安裝到主屏幕以獲得更好的體驗</p>
                    </div>
                    <button class="btn btn--primary" id="installBtn">安裝</button>
                    <button class="btn btn--outline ml-2" onclick="this.parentElement.parentElement.remove()">取消</button>
                </div>
            `;
            document.body.appendChild(installPrompt);
            
            document.getElementById('installBtn').addEventListener('click', () => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        this.showNotification('AhCry 已安裝！', 'success');
                    }
                    deferredPrompt = null;
                    installPrompt.remove();
                });
            });
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                this.showNotification('AhCry PWA - 版本 1.0.0', 'info');
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AhCryApp();
});

// Service Worker for PWA
if ('serviceWorker' in navigator) {
    const swCode = `
        const CACHE_NAME = 'ahcry-v1';
        const urlsToCache = [
            '/',
            '/index.html',
            '/style.css',
            '/app.js',
            'https://cdn.tailwindcss.com'
        ];

        self.addEventListener('install', event => {
            event.waitUntil(
                caches.open(CACHE_NAME)
                    .then(cache => cache.addAll(urlsToCache))
            );
        });

        self.addEventListener('fetch', event => {
            event.respondWith(
                caches.match(event.request)
                    .then(response => {
                        if (response) {
                            return response;
                        }
                        return fetch(event.request);
                    })
            );
        });
    `;

    const blob = new Blob([swCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);
    
    navigator.serviceWorker.register(swUrl).then(registration => {
        console.log('ServiceWorker registration successful');
    }).catch(err => {
        console.log('ServiceWorker registration failed: ', err);
    });
}