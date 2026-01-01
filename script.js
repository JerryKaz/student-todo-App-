// Student Todo List Application - Main JavaScript File
class StudentTodoApp {
    constructor() {
        this.initializeApp();
        this.bindEvents();
        this.loadFromLocalStorage();
        this.setupServiceWorker();
    }

    initializeApp() {
        // Check authentication
        this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        
        // Initialize data stores
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        this.resources = JSON.parse(localStorage.getItem('resources')) || this.getDefaultResources();
        this.settings = JSON.parse(localStorage.getItem('settings')) || this.getDefaultSettings();
        
        // Set initial theme
        this.setTheme(this.settings.theme || 'auto');
        
        // Show appropriate screen based on authentication
        if (this.isAuthenticated && this.currentUser) {
            this.showApp();
        } else {
            this.showAuth();
        }
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loadingScreen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loadingScreen').style.display = 'none';
            }, 300);
        }, 1000);
    }

    getDefaultResources() {
        return [
            {
                id: 1,
                title: 'University Library',
                description: 'Access digital library resources',
                category: 'library',
                icon: 'fas fa-book',
                url: 'https://library.university.edu',
                color: '#007AFF'
            },
            {
                id: 2,
                title: 'Learning Management System',
                description: 'Course materials and assignments',
                category: 'tools',
                icon: 'fas fa-graduation-cap',
                url: 'https://lms.university.edu',
                color: '#34C759'
            },
            {
                id: 3,
                title: 'Student Portal',
                description: 'Grades, registration, and fees',
                category: 'tools',
                icon: 'fas fa-user-graduate',
                url: 'https://portal.university.edu',
                color: '#FF9500'
            },
            {
                id: 4,
                title: 'Research Database',
                description: 'Academic journals and papers',
                category: 'library',
                icon: 'fas fa-search',
                url: 'https://research.university.edu',
                color: '#AF52DE'
            },
            {
                id: 5,
                title: 'Study Groups',
                description: 'Collaborate with peers',
                category: 'study',
                icon: 'fas fa-users',
                url: 'https://groups.university.edu',
                color: '#FF2D55'
            },
            {
                id: 6,
                title: 'Writing Center',
                description: 'Get help with assignments',
                category: 'study',
                icon: 'fas fa-pen-fancy',
                url: 'https://writing.university.edu',
                color: '#32D74B'
            }
        ];
    }

    getDefaultSettings() {
        return {
            theme: 'auto',
            taskReminders: true,
            resourceUpdates: true,
            dailyDigest: false
        };
    }

    bindEvents() {
        // Authentication events
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });
        
        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });
        
        document.getElementById('loginFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        document.getElementById('registerFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
        
        document.getElementById('togglePassword').addEventListener('click', () => {
            this.togglePasswordVisibility();
        });
        
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });
        
        // Sidebar navigation
        document.querySelectorAll('.sidebar-menu li').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                this.navigateTo(page);
            });
        });
        
        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            this.toggleSidebar();
        });
        
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Quick actions
        document.getElementById('quickAddTask').addEventListener('click', () => {
            this.showNewTaskModal();
        });
        
        // New task button
        document.getElementById('newTaskBtn').addEventListener('click', () => {
            this.showNewTaskModal();
        });
        
        document.getElementById('addFirstTask').addEventListener('click', () => {
            this.showNewTaskModal();
        });
        
        // Task modal
        document.getElementById('closeTaskModal').addEventListener('click', () => {
            this.hideNewTaskModal();
        });
        
        document.getElementById('cancelTask').addEventListener('click', () => {
            this.hideNewTaskModal();
        });
        
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewTask();
        });
        
        // Task filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterTasks(e.target.getAttribute('data-filter'));
            });
        });
        
        // Task sort
        document.getElementById('sortTasks').addEventListener('change', (e) => {
            this.sortTasks(e.target.value);
        });
        
        // Notification bell
        document.getElementById('notificationBell').addEventListener('click', () => {
            this.toggleNotificationCenter();
        });
        
        document.getElementById('closeNotifications').addEventListener('click', () => {
            this.hideNotificationCenter();
        });
        
        // Mark all as read
        document.getElementById('markAllRead').addEventListener('click', () => {
            this.markAllNotificationsAsRead();
        });
        
        // View all links
        document.querySelectorAll('.view-all').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateTo(page);
            });
        });
        
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        // Resource search
        document.getElementById('resourceSearch').addEventListener('input', (e) => {
            this.filterResources(e.target.value);
        });
        
        // Resource categories
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.filterResourcesByCategory(category);
            });
        });
        
        // Theme options
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = e.target.getAttribute('data-theme');
                this.setTheme(theme);
            });
        });
        
        // Settings toggles
        document.getElementById('taskReminders').addEventListener('change', (e) => {
            this.updateSetting('taskReminders', e.target.checked);
        });
        
        document.getElementById('resourceUpdates').addEventListener('change', (e) => {
            this.updateSetting('resourceUpdates', e.target.checked);
        });
        
        document.getElementById('dailyDigest').addEventListener('change', (e) => {
            this.updateSetting('dailyDigest', e.target.checked);
        });
        
        // Data management
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });
        
        document.getElementById('importData').addEventListener('click', () => {
            this.importData();
        });
        
        document.getElementById('clearData').addEventListener('click', () => {
            this.clearData();
        });
        
        // Profile updates
        document.getElementById('profileName').addEventListener('change', (e) => {
            this.updateProfileName(e.target.value);
        });
        
        // Calendar navigation
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.navigateCalendar(-1);
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            this.navigateCalendar(1);
        });
        
        // Close modals on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideNewTaskModal();
            }
            
            if (!e.target.closest('.notification-center') && 
                !e.target.closest('.notification-btn') &&
                document.getElementById('notificationCenter').classList.contains('active')) {
                this.hideNotificationCenter();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N for new task
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.showNewTaskModal();
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                this.hideNewTaskModal();
                this.hideNotificationCenter();
            }
        });
        
        // Simulate real-time notifications
        setInterval(() => {
            this.checkForUpcomingTasks();
        }, 60000); // Check every minute
        
        // Initial check
        this.checkForUpcomingTasks();
    }

    showAuth() {
        document.getElementById('authScreen').style.display = 'flex';
        document.getElementById('appContainer').style.display = 'none';
    }

    showApp() {
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'flex';
        
        // Update user info
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
            document.getElementById('userEmail').textContent = this.currentUser.email;
            document.getElementById('userAvatar').textContent = this.getInitials(this.currentUser.name);
            
            document.getElementById('profileName').value = this.currentUser.name;
            document.getElementById('profileEmail').value = this.currentUser.email;
            document.getElementById('profileStudentId').value = this.currentUser.studentId || 'STU123456';
        }
        
        // Update dashboard
        this.updateDashboard();
        this.updateTasksList();
        this.updateNotifications();
        this.updateResources();
        this.generateCalendar();
        
        // Set initial filter and sort
        this.filterTasks('all');
        this.sortTasks('dueDate');
    }

    getInitials(name) {
        return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
    }

    showRegisterForm() {
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.add('active');
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('togglePassword');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            passwordInput.type = 'password';
            toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }

    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Simple validation
        if (!email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }
        
        // Simulate API call
        this.showLoading();
        
        setTimeout(() => {
            // For demo purposes, accept any email/password
            this.currentUser = {
                name: email.split('@')[0].split('.').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' '),
                email: email,
                studentId: 'STU' + Math.floor(100000 + Math.random() * 900000)
            };
            
            this.isAuthenticated = true;
            
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            localStorage.setItem('isAuthenticated', 'true');
            
            this.hideLoading();
            this.showToast('Login successful!', 'success');
            this.showApp();
            
            // Add welcome notification
            this.addNotification(
                'Welcome to UniTask!',
                'Get started by adding your first task.',
                'success'
            );
        }, 1000);
    }

    handleRegister() {
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const studentId = document.getElementById('regStudentId').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        // Validation
        if (!name || !email || !studentId || !password || !confirmPassword) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 8) {
            this.showToast('Password must be at least 8 characters', 'error');
            return;
        }
        
        // Simulate API call
        this.showLoading();
        
        setTimeout(() => {
            this.currentUser = {
                name: name,
                email: email,
                studentId: studentId
            };
            
            this.isAuthenticated = true;
            
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            localStorage.setItem('isAuthenticated', 'true');
            
            this.hideLoading();
            this.showToast('Registration successful!', 'success');
            this.showApp();
            
            // Add welcome notification
            this.addNotification(
                'Welcome to UniTask!',
                'Your account has been created successfully.',
                'success'
            );
            
            // Add sample tasks for new users
            this.addSampleTasks();
        }, 1500);
    }

    addSampleTasks() {
        const sampleTasks = [
            {
                id: Date.now(),
                title: 'Complete Math Assignment',
                description: 'Chapter 5 exercises 1-20',
                dueDate: this.getDateString(2), // 2 days from now
                priority: 'high',
                category: 'assignment',
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 1,
                title: 'Study for Physics Exam',
                description: 'Review chapters 1-4',
                dueDate: this.getDateString(7), // 1 week from now
                priority: 'high',
                category: 'exam',
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 2,
                title: 'Group Project Meeting',
                description: 'Discuss project progress',
                dueDate: this.getDateString(1), // Tomorrow
                priority: 'medium',
                category: 'project',
                completed: false,
                createdAt: new Date().toISOString()
            }
        ];
        
        sampleTasks.forEach(task => {
            this.tasks.push(task);
        });
        
        this.saveToLocalStorage();
        this.updateDashboard();
        this.updateTasksList();
    }

    getDateString(daysFromNow) {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date.toISOString().split('T')[0];
    }

    handleLogout() {
        this.isAuthenticated = false;
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('currentUser');
        
        // Clear form fields
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        
        this.showToast('Logged out successfully', 'success');
        this.showAuth();
        this.showLoginForm();
    }

    navigateTo(page) {
        // Update active menu item
        document.querySelectorAll('.sidebar-menu li').forEach(item => {
            item.classList.remove('active');
        });
        
        document.querySelector(`.sidebar-menu li[data-page="${page}"]`).classList.add('active');
        
        // Update page title
        const pageTitles = {
            dashboard: 'Dashboard',
            todo: 'My Tasks',
            calendar: 'Calendar',
            resources: 'Resources',
            notifications: 'Notifications',
            settings: 'Settings'
        };
        
        document.getElementById('pageTitle').textContent = pageTitles[page];
        
        // Update page content
        document.querySelectorAll('.page').forEach(pageElement => {
            pageElement.classList.remove('active');
        });
        
        document.getElementById(page + 'Page').classList.add('active');
        
        // Update subtitle
        const subtitles = {
            dashboard: 'Welcome back! Here\'s your overview',
            todo: 'Manage your academic tasks',
            calendar: 'View your schedule',
            resources: 'Academic resources and tools',
            notifications: 'Stay updated',
            settings: 'Customize your experience'
        };
        
        document.getElementById('pageSubtitle').textContent = subtitles[page];
        
        // Close sidebar on mobile
        if (window.innerWidth <= 1024) {
            document.getElementById('sidebar').classList.remove('active');
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('collapsed');
        
        // Update icon
        const icon = document.querySelector('#sidebarToggle i');
        if (sidebar.classList.contains('collapsed')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-chevron-right');
        } else {
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-bars');
        }
    }

    setTheme(theme) {
        this.settings.theme = theme;
        this.saveSettings();
        
        // Update theme buttons
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        
        document.querySelector(`.theme-option[data-theme="${theme}"]`).classList.add('active');
        
        // Apply theme
        let actualTheme = theme;
        
        if (theme === 'auto') {
            actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        document.documentElement.setAttribute('data-theme', actualTheme);
        
        // Update theme toggle icon
        const themeIcon = document.querySelector('#themeToggle i');
        if (actualTheme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    toggleTheme() {
        const currentTheme = this.settings.theme;
        let newTheme;
        
        if (currentTheme === 'light') {
            newTheme = 'dark';
        } else if (currentTheme === 'dark') {
            newTheme = 'auto';
        } else {
            newTheme = 'light';
        }
        
        this.setTheme(newTheme);
    }

    showNewTaskModal() {
        document.getElementById('newTaskModal').classList.add('active');
        document.getElementById('taskTitle').focus();
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('taskDueDate').min = today;
        
        // Set default due date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('taskDueDate').value = tomorrow.toISOString().split('T')[0];
    }

    hideNewTaskModal() {
        document.getElementById('newTaskModal').classList.remove('active');
        document.getElementById('taskForm').reset();
    }

    handleNewTask() {
        const task = {
            id: Date.now(),
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            dueDate: document.getElementById('taskDueDate').value,
            priority: document.getElementById('taskPriority').value,
            category: document.getElementById('taskCategory').value,
            reminder: document.getElementById('taskReminder').checked,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.tasks.push(task);
        this.saveToLocalStorage();
        
        this.updateDashboard();
        this.updateTasksList();
        this.hideNewTaskModal();
        
        this.showToast('Task added successfully!', 'success');
        
        // Navigate to todo page
        this.navigateTo('todo');
        
        // Add notification if reminder is set
        if (task.reminder) {
            this.scheduleReminder(task);
        }
    }

    scheduleReminder(task) {
        // Schedule reminder for 1 day before due date
        const dueDate = new Date(task.dueDate);
        const reminderDate = new Date(dueDate);
        reminderDate.setDate(reminderDate.getDate() - 1);
        
        const now = new Date();
        const timeUntilReminder = reminderDate.getTime() - now.getTime();
        
        if (timeUntilReminder > 0) {
            setTimeout(() => {
                this.addNotification(
                    'Task Reminder',
                    `${task.title} is due tomorrow!`,
                    'warning'
                );
            }, timeUntilReminder);
        }
    }

    filterTasks(filter) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`.filter-btn[data-filter="${filter}"]`).classList.add('active');
        
        // Filter tasks
        let filteredTasks = [...this.tasks];
        
        if (filter === 'pending') {
            filteredTasks = filteredTasks.filter(task => !task.completed);
        } else if (filter === 'completed') {
            filteredTasks = filteredTasks.filter(task => task.completed);
        } else if (filter === 'overdue') {
            const today = new Date().toISOString().split('T')[0];
            filteredTasks = filteredTasks.filter(task => 
                !task.completed && task.dueDate < today
            );
        }
        
        // Get current sort
        const sortBy = document.getElementById('sortTasks').value;
        this.sortAndDisplayTasks(filteredTasks, sortBy);
    }

    sortTasks(sortBy) {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        let filteredTasks = [...this.tasks];
        
        // Reapply current filter
        if (activeFilter === 'pending') {
            filteredTasks = filteredTasks.filter(task => !task.completed);
        } else if (activeFilter === 'completed') {
            filteredTasks = filteredTasks.filter(task => task.completed);
        } else if (activeFilter === 'overdue') {
            const today = new Date().toISOString().split('T')[0];
            filteredTasks = filteredTasks.filter(task => 
                !task.completed && task.dueDate < today
            );
        }
        
        this.sortAndDisplayTasks(filteredTasks, sortBy);
    }

    sortAndDisplayTasks(tasks, sortBy) {
        const sortedTasks = [...tasks].sort((a, b) => {
            switch (sortBy) {
                case 'dueDate':
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'created':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });
        
        this.displayTasks(sortedTasks);
    }

    displayTasks(tasks) {
        const container = document.getElementById('tasksContainer');
        const emptyState = document.getElementById('emptyTasksState');
        
        if (tasks.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        container.innerHTML = tasks.map(task => `
            <div class="task-item" data-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                     onclick="app.toggleTaskCompletion(${task.id})">
                    ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <div class="task-info">
                    <div class="task-title">${task.title}</div>
                    <div class="task-due">
                        Due: ${this.formatDate(task.dueDate)}
                        <span class="task-priority priority-${task.priority}">
                            ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                    </div>
                    ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
                </div>
                <button class="icon-btn" onclick="app.deleteTask(${task.id})" aria-label="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    toggleTaskCompletion(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
            this.saveToLocalStorage();
            
            this.updateDashboard();
            this.updateTasksList();
            
            // Update notification count
            this.updateNotificationCount();
            
            // Show toast
            const status = this.tasks[taskIndex].completed ? 'completed' : 'marked as pending';
            this.showToast(`Task ${status}!`, 'success');
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveToLocalStorage();
            
            this.updateDashboard();
            this.updateTasksList();
            
            this.showToast('Task deleted successfully!', 'success');
        }
    }

    updateDashboard() {
        // Calculate stats
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        
        const today = new Date().toISOString().split('T')[0];
        const overdueTasks = this.tasks.filter(task => 
            !task.completed && task.dueDate < today
        ).length;
        
        // Calculate tasks due this week
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        const weekFromNowStr = weekFromNow.toISOString().split('T')[0];
        
        const upcomingTasks = this.tasks.filter(task => 
            !task.completed && 
            task.dueDate >= today && 
            task.dueDate <= weekFromNowStr
        ).length;
        
        // Update stats
        document.getElementById('pendingTasks').textContent = pendingTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('overdueTasks').textContent = overdueTasks;
        document.getElementById('upcomingTasks').textContent = upcomingTasks;
        
        // Update task count badge
        document.getElementById('taskCount').textContent = pendingTasks;
        
        // Update upcoming tasks list
        this.updateUpcomingTasksList();
        
        // Update recent resources
        this.updateRecentResources();
    }

    updateUpcomingTasksList() {
        const container = document.getElementById('upcomingTasksList');
        const today = new Date().toISOString().split('T')[0];
        
        const upcomingTasks = this.tasks
            .filter(task => !task.completed && task.dueDate >= today)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 5); // Show only 5 most recent
        
        if (upcomingTasks.length === 0) {
            container.innerHTML = '<div class="empty-state">No upcoming tasks</div>';
            return;
        }
        
        container.innerHTML = upcomingTasks.map(task => `
            <div class="task-item">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                     onclick="app.toggleTaskCompletion(${task.id})">
                    ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <div class="task-info">
                    <div class="task-title">${task.title}</div>
                    <div class="task-due">
                        Due: ${this.formatDate(task.dueDate)}
                        <span class="task-priority priority-${task.priority}">
                            ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateRecentResources() {
        const container = document.getElementById('recentResources');
        const recentResources = this.resources.slice(0, 4); // Show 4 most recent
        
        container.innerHTML = recentResources.map(resource => `
            <div class="resource-card">
                <div class="resource-icon" style="background-color: ${resource.color}20; color: ${resource.color};">
                    <i class="${resource.icon}"></i>
                </div>
                <div class="resource-title">${resource.title}</div>
                <div class="resource-desc">${resource.description}</div>
                <a href="${resource.url}" target="_blank" class="resource-link">
                    Visit Resource <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `).join('');
    }

    updateTasksList() {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        this.filterTasks(activeFilter);
    }

    updateNotifications() {
        this.updateNotificationList();
        this.updateNotificationCount();
    }

    updateNotificationList() {
        const container = document.getElementById('notificationsContainer');
        const notificationList = document.getElementById('notificationList');
        const emptyState = document.getElementById('emptyNotificationsState');
        
        if (this.notifications.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        
        container.style.display = 'block';
        emptyState.style.display = 'none';
        
        // Sort by date (newest first)
        const sortedNotifications = [...this.notifications].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        // Update main notifications page
        container.innerHTML = sortedNotifications.map(notification => `
            <div class="notification-item ${notification.read ? '' : 'unread'}" 
                 onclick="app.markNotificationAsRead(${notification.id})">
                <div class="notification-icon" style="color: ${notification.color || '#007AFF'}">
                    <i class="${notification.icon || 'fas fa-info-circle'}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-desc">${notification.message}</div>
                    <div class="notification-time">${this.formatTime(notification.date)}</div>
                </div>
            </div>
        `).join('');
        
        // Update notification center
        const recentNotifications = sortedNotifications.slice(0, 5); // Show 5 most recent
        notificationList.innerHTML = recentNotifications.map(notification => `
            <div class="notification-item ${notification.read ? '' : 'unread'}" 
                 onclick="app.markNotificationAsRead(${notification.id})">
                <div class="notification-icon" style="color: ${notification.color || '#007AFF'}">
                    <i class="${notification.icon || 'fas fa-info-circle'}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-desc">${notification.message}</div>
                    <div class="notification-time">${this.formatTime(notification.date)}</div>
                </div>
            </div>
        `).join('');
    }

    updateNotificationCount() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const badge = document.getElementById('notificationCount');
        const dot = document.getElementById('notificationDot');
        
        badge.textContent = unreadCount;
        
        if (unreadCount > 0) {
            badge.style.display = 'block';
            dot.style.display = 'block';
        } else {
            badge.style.display = 'none';
            dot.style.display = 'none';
        }
    }

    addNotification(title, message, type = 'info') {
        const notification = {
            id: Date.now(),
            title,
            message,
            type,
            read: false,
            date: new Date().toISOString(),
            icon: this.getNotificationIcon(type),
            color: this.getNotificationColor(type)
        };
        
        this.notifications.unshift(notification); // Add to beginning
        this.saveToLocalStorage();
        
        this.updateNotifications();
        
        // Show desktop notification if supported
        if (this.settings.taskReminders && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/icons/icon-192.png'
            });
        }
        
        // Play notification sound if enabled
        if (this.settings.taskReminders) {
            this.playNotificationSound();
        }
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || 'fas fa-info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#34C759',
            error: '#FF3B30',
            warning: '#FF9500',
            info: '#007AFF'
        };
        return colors[type] || '#007AFF';
    }

    playNotificationSound() {
        // Create a simple notification sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    markNotificationAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveToLocalStorage();
            this.updateNotifications();
        }
    }

    markAllNotificationsAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        
        this.saveToLocalStorage();
        this.updateNotifications();
        
        this.showToast('All notifications marked as read', 'success');
    }

    toggleNotificationCenter() {
        const center = document.getElementById('notificationCenter');
        center.classList.toggle('active');
    }

    hideNotificationCenter() {
        document.getElementById('notificationCenter').classList.remove('active');
    }

    updateResources() {
        this.displayResources(this.resources);
    }

    displayResources(resources) {
        const container = document.getElementById('resourcesContainer');
        
        container.innerHTML = resources.map(resource => `
            <div class="resource-card">
                <div class="resource-icon" style="background-color: ${resource.color}20; color: ${resource.color};">
                    <i class="${resource.icon}"></i>
                </div>
                <div class="resource-title">${resource.title}</div>
                <div class="resource-desc">${resource.description}</div>
                <div class="resource-category">
                    <span class="task-priority">${resource.category}</span>
                </div>
                <a href="${resource.url}" target="_blank" class="resource-link">
                    Visit Resource <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `).join('');
    }

    filterResources(searchTerm) {
        const filtered = this.resources.filter(resource =>
            resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        this.displayResources(filtered);
    }

    filterResourcesByCategory(category) {
        // Update active category button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`.category-btn[data-category="${category}"]`).classList.add('active');
        
        let filtered = this.resources;
        
        if (category !== 'all') {
            filtered = this.resources.filter(resource => resource.category === category);
        }
        
        this.displayResources(filtered);
    }

    generateCalendar() {
        const now = new Date();
        this.currentMonth = now.getMonth();
        this.currentYear = now.getFullYear();
        
        this.renderCalendar();
    }

    renderCalendar() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        // Update month header
        document.getElementById('currentMonth').textContent = 
            `${monthNames[this.currentMonth]} ${this.currentYear}`;
        
        // Get first day of month
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Calculate starting day (0 = Sunday, 1 = Monday, etc.)
        let startDay = firstDay.getDay();
        
        // Create calendar grid
        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day-header';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startDay; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            calendarGrid.appendChild(dayElement);
        }
        
        // Add days of the month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            // Check if this is today
            if (day === today.getDate() && 
                this.currentMonth === today.getMonth() && 
                this.currentYear === today.getFullYear()) {
                dayElement.classList.add('today');
            }
            
            // Add day number
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            dayElement.appendChild(dayNumber);
            
            // Add events for this day
            const dateStr = `${this.currentYear}-${(this.currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dayEvents = this.getEventsForDate(dateStr);
            
            dayEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'calendar-event';
                eventElement.textContent = event.title;
                eventElement.title = event.title;
                dayElement.appendChild(eventElement);
            });
            
            calendarGrid.appendChild(dayElement);
        }
        
        // Update today's events
        this.updateTodayEvents();
    }

    getEventsForDate(dateStr) {
        // For now, use tasks as events. You can expand this with actual events
        return this.tasks
            .filter(task => task.dueDate === dateStr)
            .map(task => ({
                title: task.title,
                type: 'task'
            }));
    }

    updateTodayEvents() {
        const today = new Date().toISOString().split('T')[0];
        const todayEvents = this.getEventsForDate(today);
        const container = document.getElementById('todayEvents');
        
        if (todayEvents.length === 0) {
            container.innerHTML = '<div class="empty-state">No events for today</div>';
            return;
        }
        
        container.innerHTML = todayEvents.map(event => `
            <div class="event-item">
                <div class="event-time">All day</div>
                <div class="event-title">${event.title}</div>
            </div>
        `).join('');
    }

    navigateCalendar(direction) {
        this.currentMonth += direction;
        
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        
        this.renderCalendar();
    }

    handleSearch(searchTerm) {
        if (!searchTerm.trim()) {
            this.updateTasksList();
            return;
        }
        
        const filteredTasks = this.tasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        this.displayTasks(filteredTasks);
    }

    updateSetting(setting, value) {
        this.settings[setting] = value;
        this.saveSettings();
        
        this.showToast('Settings updated', 'success');
    }

    updateProfileName(newName) {
        if (this.currentUser && newName.trim()) {
            this.currentUser.name = newName.trim();
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            // Update UI
            document.getElementById('userName').textContent = this.currentUser.name;
            document.getElementById('userAvatar').textContent = this.getInitials(this.currentUser.name);
            
            this.showToast('Profile updated', 'success');
        }
    }

    exportData() {
        const data = {
            tasks: this.tasks,
            notifications: this.notifications,
            resources: this.resources,
            settings: this.settings,
            user: this.currentUser,
            exportedAt: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `unitask-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showToast('Data exported successfully', 'success');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    // Validate data structure
                    if (data.tasks && data.notifications && data.resources && data.settings) {
                        this.tasks = data.tasks;
                        this.notifications = data.notifications;
                        this.resources = data.resources;
                        this.settings = data.settings;
                        
                        if (data.user) {
                            this.currentUser = data.user;
                            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                        }
                        
                        this.saveToLocalStorage();
                        
                        this.updateDashboard();
                        this.updateTasksList();
                        this.updateNotifications();
                        this.updateResources();
                        
                        this.showToast('Data imported successfully', 'success');
                    } else {
                        this.showToast('Invalid data file', 'error');
                    }
                } catch (error) {
                    this.showToast('Error importing data', 'error');
                    console.error('Import error:', error);
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    clearData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            this.tasks = [];
            this.notifications = [];
            this.resources = this.getDefaultResources();
            this.settings = this.getDefaultSettings();
            
            this.saveToLocalStorage();
            
            this.updateDashboard();
            this.updateTasksList();
            this.updateNotifications();
            this.updateResources();
            
            this.showToast('All data cleared', 'success');
        }
    }

    checkForUpcomingTasks() {
        if (!this.settings.taskReminders) return;
        
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        
        // Check for overdue tasks
        const overdueTasks = this.tasks.filter(task => 
            !task.completed && task.dueDate < today
        );
        
        if (overdueTasks.length > 0 && !this.notifiedOverdue) {
            this.addNotification(
                'Overdue Tasks',
                `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`,
                'warning'
            );
            this.notifiedOverdue = true;
        }
        
        // Check for tasks due tomorrow
        const dueTomorrow = this.tasks.filter(task => 
            !task.completed && task.dueDate === tomorrowStr
        );
        
        if (dueTomorrow.length > 0 && !this.notifiedTomorrow) {
            this.addNotification(
                'Tasks Due Tomorrow',
                `You have ${dueTomorrow.length} task${dueTomorrow.length > 1 ? 's' : ''} due tomorrow`,
                'info'
            );
            this.notifiedTomorrow = true;
        }
        
        // Reset flags at midnight
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            this.notifiedOverdue = false;
            this.notifiedTomorrow = false;
        }
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            });
        }
    }

    formatTime(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) {
            return 'Just now';
        } else if (diffMins < 60) {
            return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getNotificationIcon(type);
        const color = this.getNotificationColor(type);
        
        toast.innerHTML = `
            <div class="toast-icon" style="color: ${color}">
                <i class="${icon}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
        `;
        
        container.appendChild(toast);
        
        // Remove toast after 5 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                container.removeChild(toast);
            }, 300);
        }, 5000);
    }

    showLoading() {
        // You can implement a loading overlay here
        document.body.style.cursor = 'wait';
    }

    hideLoading() {
        document.body.style.cursor = 'default';
    }

    saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
        localStorage.setItem('resources', JSON.stringify(this.resources));
    }

    saveSettings() {
        localStorage.setItem('settings', JSON.stringify(this.settings));
    }

    loadFromLocalStorage() {
        // Already loaded in constructor
    }

    setupServiceWorker() {
        // Service worker registration is already in the HTML
        // Additional service worker logic can be added here
    }
}

// Initialize the app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new StudentTodoApp();
});

// Make app globally available for inline event handlers
window.app = app;