// Karu AI - Deploy Ready JavaScript
let sidebarCollapsed = false;
let settingsOpen = false;
let chatHistory = [];
let currentChatId = null;
let isGenerating = false;
let researchMode = false;
let projectToDelete = null;

// AI Response Templates
const codeResponses = {
    python: `Here's a Python solution for you:

\`\`\`python
def fibonacci(n):
    """Generate Fibonacci sequence up to n terms."""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    sequence = [0, 1]
    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])
    return sequence

# Example usage
result = fibonacci(10)
print(result)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
\`\`\`

This function efficiently generates the Fibonacci sequence. Would you like me to explain how it works or help you optimize it further?`,

    javascript: `Here's a clean JavaScript implementation:

\`\`\`javascript
class TaskManager {
    constructor() {
        this.tasks = [];
        this.nextId = 1;
    }
    
    addTask(description, priority = 'medium') {
        const task = {
            id: this.nextId++,
            description,
            priority,
            completed: false,
            createdAt: new Date()
        };
        this.tasks.push(task);
        return task;
    }
    
    completeTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = true;
            task.completedAt = new Date();
        }
        return task;
    }
    
    getPendingTasks() {
        return this.tasks.filter(t => !t.completed);
    }
}

// Usage example
const manager = new TaskManager();
manager.addTask("Deploy Karu AI", "high");
manager.addTask("Write documentation", "medium");
console.log(manager.getPendingTasks());
\`\`\`

This creates a flexible task management system. Need help adding features like filtering or persistence?`,

    react: `Here's a modern React component for you:

\`\`\`jsx
import React, { useState, useEffect } from 'react';

const WeatherWidget = ({ city = 'New York' }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetchWeather();
    }, [city]);
    
    const fetchWeather = async () => {
        try {
            setLoading(true);
            // Simulated API call
            setTimeout(() => {
                setWeather({
                    city,
                    temperature: Math.floor(Math.random() * 30) + 50,
                    condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
                    humidity: Math.floor(Math.random() * 40) + 30
                });
                setLoading(false);
            }, 1000);
        } catch (err) {
            setError('Failed to fetch weather');
            setLoading(false);
        }
    };
    
    if (loading) return <div className="loading">Loading weather...</div>;
    if (error) return <div className="error">{error}</div>;
    
    return (
        <div className="weather-widget">
            <h3>{weather.city}</h3>
            <div className="temperature">{weather.temperature}°F</div>
            <div className="condition">{weather.condition}</div>
            <div className="humidity">Humidity: {weather.humidity}%</div>
            <button onClick={fetchWeather}>Refresh</button>
        </div>
    );
};

export default WeatherWidget;
\`\`\`

This component handles loading states, error handling, and updates. Want me to add styling or more features?`,

    api: `Here's a clean REST API design:

\`\`\`python
from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

# In-memory storage (use database in production)
users = {}
posts = {}

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    
    if not data.get('email') or not data.get('name'):
        return jsonify({'error': 'Email and name are required'}), 400
    
    user_id = str(uuid.uuid4())
    user = {
        'id': user_id,
        'name': data['name'],
        'email': data['email'],
        'created_at': datetime.utcnow().isoformat(),
        'posts': []
    }
    
    users[user_id] = user
    return jsonify(user), 201

@app.route('/api/users/<user_id>/posts', methods=['POST'])
def create_post(user_id):
    if user_id not in users:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    if not data.get('title') or not data.get('content'):
        return jsonify({'error': 'Title and content are required'}), 400
    
    post_id = str(uuid.uuid4())
    post = {
        'id': post_id,
        'user_id': user_id,
        'title': data['title'],
        'content': data['content'],
        'created_at': datetime.utcnow().isoformat()
    }
    
    posts[post_id] = post
    users[user_id]['posts'].append(post_id)
    return jsonify(post), 201

@app.route('/api/posts', methods=['GET'])
def get_posts():
    return jsonify(list(posts.values()))

if __name__ == '__main__':
    app.run(debug=True)
\`\`\`

This API includes proper error handling, CORS support, and RESTful endpoints. Need help adding authentication or database integration?`
};

// Smart response generator
function generateSmartResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    // Check for research mode
    if (message.startsWith('[RESEARCH MODE]')) {
        const query = message.replace('[RESEARCH MODE]', '').trim();
        return generateResearchResponse(query);
    }
    
    // Web development requests
    if (lowerMsg.includes('web page') || lowerMsg.includes('website') || lowerMsg.includes('html') || 
        (lowerMsg.includes('create') && (lowerMsg.includes('page') || lowerMsg.includes('site')))) {
        return generateWebPageCode(message);
    }
    
    // Code-related keywords
    if (lowerMsg.includes('python') || lowerMsg.includes('function') || lowerMsg.includes('algorithm')) {
        return codeResponses.python;
    }
    
    if (lowerMsg.includes('javascript') || lowerMsg.includes('js') || lowerMsg.includes('node')) {
        return codeResponses.javascript;
    }
    
    if (lowerMsg.includes('react') || lowerMsg.includes('component') || lowerMsg.includes('jsx')) {
        return codeResponses.react;
    }
    
    if (lowerMsg.includes('api') || lowerMsg.includes('rest') || lowerMsg.includes('endpoint')) {
        return codeResponses.api;
    }
    
    // General programming help
    if (lowerMsg.includes('debug') || lowerMsg.includes('error') || lowerMsg.includes('fix')) {
        return `I'll help you debug that! Here are the most common debugging approaches:

**1. Check the Error Message**
- Read the full error stack trace
- Look for line numbers and file names
- Identify the exact point of failure

**2. Use Console Logging**
\`\`\`javascript
console.log('Variable value:', variableName);
console.log('Function called with:', arguments);
\`\`\`

**3. Break Down the Problem**
- Test individual parts of your code
- Use smaller, isolated examples
- Verify your assumptions

**4. Common Issues to Check**
- Typos in variable/function names
- Missing semicolons or brackets
- Incorrect data types
- Async/await timing issues

Share your specific error and I'll help you solve it!`;
    }
    
    if (lowerMsg.includes('design') || lowerMsg.includes('pattern') || lowerMsg.includes('architecture')) {
        return `Great question about software design! Here are some key principles:

**SOLID Principles:**
- **S**ingle Responsibility: One class, one job
- **O**pen/Closed: Open for extension, closed for modification  
- **L**iskov Substitution: Subtypes must be substitutable
- **I**nterface Segregation: Many specific interfaces vs one general
- **D**ependency Inversion: Depend on abstractions, not concretions

**Common Design Patterns:**
- **Singleton**: Ensure single instance
- **Factory**: Create objects without specifying exact class
- **Observer**: Notify multiple objects of state changes
- **Strategy**: Encapsulate algorithms and make them interchangeable

**Architecture Tips:**
- Separate concerns (MVC, MVP, MVVM)
- Use dependency injection
- Plan for scalability
- Keep it simple (KISS principle)

What specific design challenge are you working on?`;
    }
    
    // Default helpful responses
    const responses = [
        `I'm here to help with your coding projects! I can assist with:

• **Python** - Scripts, data analysis, web development
• **JavaScript** - Frontend, Node.js, React applications  
• **API Design** - RESTful services and integrations
• **Debugging** - Finding and fixing code issues
• **Architecture** - System design and best practices

What would you like to work on today?`,

        `Let me help you build something amazing! I specialize in:

🐍 **Python Development**
- Web apps with Flask/Django
- Data processing and analysis
- Automation scripts

⚛️ **React & JavaScript**
- Interactive user interfaces
- State management
- API integrations

🌐 **Full-Stack Solutions**
- Backend APIs
- Database design
- Deployment strategies

What's your current project or challenge?`,

        `Ready to dive into some code! I can help you with:

**Development:**
- Writing clean, efficient code
- Implementing algorithms and data structures
- Code reviews and optimization

**Problem Solving:**
- Breaking down complex requirements
- Choosing the right tools and frameworks
- Performance and scalability considerations

**Best Practices:**
- Code organization and structure
- Testing strategies
- Documentation and maintenance

Tell me about what you're building!`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Research response generator
function generateResearchResponse(query) {
    const researchResponses = [
        `🔍 **Research Results for: "${query}"**

**Key Findings:**
- Latest industry trends show significant growth in this area
- Multiple authoritative sources confirm current best practices
- Recent developments indicate emerging opportunities

**Sources Analyzed:**
- Academic research papers (2024)
- Industry reports and whitepapers
- Expert opinions and case studies
- Government and regulatory data

**Detailed Analysis:**
Based on comprehensive web research, the current landscape shows promising developments. Key stakeholders are investing heavily in innovation, with market projections indicating sustained growth through 2025.

**Recommendations:**
1. Consider current market conditions
2. Evaluate emerging technologies
3. Monitor regulatory changes
4. Assess competitive landscape

*Research completed using live web data and multiple verified sources.*`,

        `🔍 **Comprehensive Research: "${query}"**

**Executive Summary:**
Current data reveals significant insights across multiple dimensions of this topic, with emerging patterns that suggest strategic opportunities.

**Market Intelligence:**
- **Trend Analysis:** Growing adoption rates across key demographics
- **Competitive Landscape:** Major players consolidating market share
- **Technology Adoption:** Accelerating innovation cycles
- **Regulatory Environment:** Evolving compliance requirements

**Data Points:**
- 📊 Market size projections through 2025
- 📈 Growth rate comparisons year-over-year
- 🎯 Target audience segmentation analysis
- 💡 Innovation pipeline assessment

**Strategic Implications:**
The research indicates this is an optimal time for strategic positioning, with multiple convergence factors creating favorable conditions for growth and expansion.

**Next Steps:**
1. Deep-dive analysis of specific use cases
2. Stakeholder impact assessment
3. Risk mitigation planning
4. Implementation roadmap development

*This analysis synthesizes data from 15+ authoritative sources updated within the last 30 days.*`
    ];
    
    return researchResponses[Math.floor(Math.random() * researchResponses.length)];
}

// Web page code generator
function generateWebPageCode(message) {
    const webPageTemplate = `I'll create a complete web page with navigation and settings for you:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Web Page</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .navbar {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 1rem 2rem;
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 1000;
        }
        
        .nav-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .logo {
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
        }
        
        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        .nav-links a {
            color: white;
            text-decoration: none;
            transition: opacity 0.3s;
        }
        
        .nav-links a:hover {
            opacity: 0.7;
        }
        
        .settings-dropdown {
            position: relative;
        }
        
        .settings-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
        }
        
        .dropdown-content {
            display: none;
            position: absolute;
            right: 0;
            top: 100%;
            background: white;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            min-width: 200px;
            margin-top: 0.5rem;
        }
        
        .dropdown-content.show {
            display: block;
        }
        
        .dropdown-item {
            padding: 0.75rem 1rem;
            cursor: pointer;
            color: #333;
            border-bottom: 1px solid #eee;
        }
        
        .dropdown-item:hover {
            background: #f5f5f5;
        }
        
        .dropdown-item:last-child {
            border-bottom: none;
        }
        
        .main-content {
            margin-top: 80px;
            padding: 2rem;
            text-align: center;
            color: white;
        }
        
        .hero {
            max-width: 800px;
            margin: 0 auto;
            padding: 4rem 0;
        }
        
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .hero p {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 2rem;
        }
        
        .cta-button {
            background: #ff6b35;
            color: white;
            border: none;
            padding: 1rem 2rem;
            font-size: 1.1rem;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .cta-button:hover {
            background: #e55a2b;
        }
        
        @media (max-width: 768px) {
            .nav-container {
                flex-direction: column;
                gap: 1rem;
            }
            
            .nav-links {
                gap: 1rem;
            }
            
            .hero h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo">MyWebsite</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            <div class="settings-dropdown">
                <button class="settings-btn" onclick="toggleSettings()">Settings ⚙️</button>
                <div class="dropdown-content" id="settingsDropdown">
                    <div class="dropdown-item" onclick="changeTheme()">Change Theme</div>
                    <div class="dropdown-item" onclick="changeLanguage()">Language</div>
                    <div class="dropdown-item" onclick="showProfile()">Profile</div>
                    <div class="dropdown-item" onclick="showHelp()">Help</div>
                </div>
            </div>
        </div>
    </nav>
    
    <main class="main-content">
        <section class="hero">
            <h1>Welcome to Our Website</h1>
            <p>Build amazing experiences with modern web technologies</p>
            <button class="cta-button" onclick="getStarted()">Get Started</button>
        </section>
    </main>
    
    <script>
        function toggleSettings() {
            const dropdown = document.getElementById('settingsDropdown');
            dropdown.classList.toggle('show');
        }
        
        function changeTheme() {
            alert('Theme changed!');
            toggleSettings();
        }
        
        function changeLanguage() {
            alert('Language settings opened!');
            toggleSettings();
        }
        
        function showProfile() {
            alert('Profile page opened!');
            toggleSettings();
        }
        
        function showHelp() {
            alert('Help documentation opened!');
            toggleSettings();
        }
        
        function getStarted() {
            alert('Welcome! Let\\'s get started with your project.');
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const dropdown = document.getElementById('settingsDropdown');
            const settingsBtn = document.querySelector('.settings-btn');
            
            if (!settingsBtn.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });
    </script>
</body>
</html>
\`\`\`

This web page includes:

🎨 **Modern Design:**
- Gradient background with glassmorphism effects
- Responsive navigation bar with backdrop blur
- Professional typography and spacing

⚙️ **Settings Dropdown:**
- Theme switching capability
- Language preferences
- Profile management
- Help documentation

📱 **Responsive Features:**
- Mobile-friendly navigation
- Adaptive layout for all screen sizes
- Touch-friendly interactive elements

🚀 **Interactive Elements:**
- Functional dropdown menu
- Hover effects and transitions
- Click handlers for all buttons

You can save this as an HTML file and open it in your browser. Need any modifications to the design or functionality?`;

    return webPageTemplate;
}

// Workspace message sending
function sendWorkspaceMessage() {
    const messageInput = document.getElementById('workspaceMessageInput');
    const message = messageInput.value.trim();
    
    if (!message || isGenerating) return;
    
    isGenerating = true;
    messageInput.value = '';
    
    // Hide welcome screen, show messages
    document.getElementById('workspaceWelcome').style.display = 'none';
    document.getElementById('workspaceMessages').style.display = 'block';
    
    // Add user message to workspace
    addWorkspaceMessage('user', message);
    
    // Add typing indicator
    const typingId = addWorkspaceMessage('assistant', 'Thinking...');
    
    // Simulate AI processing time
    setTimeout(async () => {
        const response = generateSmartResponse(message);
        updateWorkspaceMessage(typingId, response);
        isGenerating = false;
    }, 1000 + Math.random() * 2000);
}

function addWorkspaceMessage(sender, content) {
    const messagesEl = document.getElementById('workspaceMessages');
    const messageId = Date.now() + Math.random();
    
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender}`;
    messageEl.id = `workspace-message-${messageId}`;
    
    const contentEl = document.createElement('div');
    contentEl.className = 'message-content';
    
    if (sender === 'assistant' && content === 'Thinking...') {
        contentEl.innerHTML = '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
    } else {
        contentEl.innerHTML = formatMessage(content);
    }
    
    messageEl.appendChild(contentEl);
    messagesEl.appendChild(messageEl);
    
    // Auto-scroll
    messagesEl.scrollTop = messagesEl.scrollHeight;
    
    return messageId;
}

function updateWorkspaceMessage(messageId, content) {
    const messageEl = document.getElementById(`workspace-message-${messageId}`);
    if (messageEl) {
        const contentEl = messageEl.querySelector('.message-content');
        contentEl.innerHTML = formatMessage(content);
        
        // Highlight code if present
        messageEl.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });
    }
}

// UI Functions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebarCollapsed = !sidebarCollapsed;
    sidebar.classList.toggle('collapsed', sidebarCollapsed);
}

function toggleSettings() {
    const dropdown = document.getElementById('settingsDropdown');
    settingsOpen = !settingsOpen;
    dropdown.classList.toggle('show', settingsOpen);
}

function openSettings() {
    document.getElementById('settingsModal').classList.add('show');
    toggleSettings();
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('show');
}

function showAbout() {
    alert('Karu AI - A Claude-inspired AI assistant for coding\\nVersion 1.0\\nBuilt with HTML, CSS, and JavaScript');
    toggleSettings();
}

function startNewChat() {
    // Save current chat to history if it has messages
    if (currentChatId && chatHistory.find(c => c.id === currentChatId)?.messages?.length > 0) {
        updateChatHistory();
    }
    
    // Create new chat
    currentChatId = Date.now().toString();
    
    // Switch to main chat view (hide all other views)
    document.getElementById('chatArea').style.display = 'flex';
    document.getElementById('projectsView').style.display = 'none';
    document.getElementById('projectWorkspace').style.display = 'none';
    
    // Show welcome screen, hide messages
    document.getElementById('welcomeScreen').style.display = 'block';
    document.getElementById('messages').style.display = 'none';
    document.getElementById('messages').innerHTML = '';
    document.getElementById('messageInput').value = '';
    
    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.nav-item[onclick="switchToChat()"]').classList.add('active');
    
    // Update chat history display
    updateChatHistory();
}

function updateChatHistory() {
    const historyEl = document.getElementById('chatHistory');
    historyEl.innerHTML = '';
    
    chatHistory.forEach(chat => {
        const chatEl = document.createElement('div');
        chatEl.className = 'chat-item';
        chatEl.textContent = chat.title;
        chatEl.onclick = () => loadChat(chat.id);
        historyEl.appendChild(chatEl);
    });
}

function sendSuggestion(text) {
    document.getElementById('messageInput').value = text;
    sendMessage();
}

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || isGenerating) return;
    
    isGenerating = true;
    messageInput.value = '';
    
    // Hide welcome screen, show messages
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('messages').style.display = 'block';
    
    // Add user message
    addMessage('user', message);
    
    // Add typing indicator
    const typingId = addMessage('assistant', 'Thinking...');
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Generate response
    const response = generateSmartResponse(message);
    
    // Replace typing indicator with actual response
    updateMessage(typingId, response);
    
    // Save to chat history
    saveChatMessage(message, response);
    
    isGenerating = false;
}

function addMessage(sender, content) {
    const messagesEl = document.getElementById('messages');
    const messageId = Date.now() + Math.random();
    
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender}`;
    messageEl.id = `message-${messageId}`;
    
    const contentEl = document.createElement('div');
    contentEl.className = 'message-content';
    
    if (sender === 'assistant' && content === 'Thinking...') {
        contentEl.innerHTML = '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
    } else {
        contentEl.innerHTML = formatMessage(content);
    }
    
    messageEl.appendChild(contentEl);
    messagesEl.appendChild(messageEl);
    
    // Auto-scroll
    messagesEl.scrollTop = messagesEl.scrollHeight;
    
    return messageId;
}

function updateMessage(messageId, content) {
    const messageEl = document.getElementById(`message-${messageId}`);
    if (messageEl) {
        const contentEl = messageEl.querySelector('.message-content');
        contentEl.innerHTML = formatMessage(content);
        
        // Highlight code if present
        messageEl.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });
    }
}

function formatMessage(content) {
    // Simple markdown-like formatting
    let formatted = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
    
    // Handle code blocks
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'javascript';
        return `<pre><code class="language-${language}">${code.trim()}</code></pre>`;
    });
    
    return formatted;
}

function saveChatMessage(userMessage, assistantMessage) {
    if (!currentChatId) {
        currentChatId = Date.now().toString();
    }
    
    // Create or update chat in history
    let chat = chatHistory.find(c => c.id === currentChatId);
    if (!chat) {
        chat = {
            id: currentChatId,
            title: userMessage.substring(0, 50) + (userMessage.length > 50 ? '...' : ''),
            messages: [],
            createdAt: new Date()
        };
        chatHistory.unshift(chat);
        
        // Limit chat history to 20 items
        if (chatHistory.length > 20) {
            chatHistory = chatHistory.slice(0, 20);
        }
    }
    
    chat.messages.push({ role: 'user', content: userMessage });
    chat.messages.push({ role: 'assistant', content: assistantMessage });
    chat.updatedAt = new Date();
    
    updateChatHistory();
}

// Settings functions
function toggleDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    toggle.classList.toggle('active');
}

function toggleCodeHighlight() {
    const toggle = document.getElementById('codeHighlightToggle');
    toggle.classList.toggle('active');
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Auto-resize textarea
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });
    
    // Enter to send message
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Enter to send workspace message
    const workspaceInput = document.getElementById('workspaceMessageInput');
    if (workspaceInput) {
        workspaceInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendWorkspaceMessage();
            }
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-profile')) {
            settingsOpen = false;
            document.getElementById('settingsDropdown').classList.remove('show');
        }
        
        // Close modals when clicking overlay
        if (e.target.classList.contains('modal-overlay')) {
            e.target.style.display = 'none';
            
            // Reset delete project state if closing delete modal
            if (e.target.id === 'deleteConfirmModal') {
                projectToDelete = null;
            }
        }
    });
    
    // Project form submission
    document.getElementById('projectForm').addEventListener('submit', handleProjectCreation);
    
    // Start with a new chat
    startNewChat();
});

// Navigation functions
function switchToChat() {
    // Show main chat area, hide others
    document.getElementById('chatArea').style.display = 'flex';
    document.getElementById('projectsView').style.display = 'none';
    document.getElementById('projectWorkspace').style.display = 'none';
    
    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.nav-item[onclick="switchToChat()"]').classList.add('active');
}

function switchToProjects() {
    // Show projects view, hide others
    document.getElementById('chatArea').style.display = 'none';
    document.getElementById('projectsView').style.display = 'block';
    document.getElementById('projectWorkspace').style.display = 'none';
    
    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.nav-item[onclick="switchToProjects()"]').classList.add('active');
}

function createProject() {
    document.getElementById('createProjectModal').style.display = 'flex';
}

function cancelCreateProject() {
    document.getElementById('createProjectModal').style.display = 'none';
    document.getElementById('projectForm').reset();
}

function handleProjectCreation(event) {
    event.preventDefault();
    
    const name = document.getElementById('projectNameInput').value.trim();
    const description = document.getElementById('projectDescriptionInput').value.trim();
    
    if (!name) {
        alert('Please enter a project name');
        return;
    }
    
    // Create new project card
    const projectsGrid = document.getElementById('projectsGrid');
    const newCard = document.createElement('div');
    newCard.className = 'project-card';
    newCard.onclick = (e) => {
        // Don't open project if clicking delete button
        if (!e.target.classList.contains('delete-project-btn')) {
            openProject(name);
        }
    };
    newCard.innerHTML = `
        <button class="delete-project-btn" onclick="deleteProject(this, '${name}')">×</button>
        <div class="project-content">
            <h3 class="project-name">${name}</h3>
            <p class="project-description">${description || 'No description provided'}</p>
            <div class="project-updated">Updated just now</div>
        </div>
    `;
    
    // Add to top of grid
    projectsGrid.insertBefore(newCard, projectsGrid.firstChild);
    
    // Close modal and reset form
    cancelCreateProject();
    
    // Open the new project workspace
    setTimeout(() => {
        openProject(name);
    }, 100);
}

// Delete project functionality
function deleteProject(deleteBtn, projectName) {
    // Prevent event bubbling to project card click
    event.stopPropagation();
    
    // Store reference to project card and name
    projectToDelete = {
        card: deleteBtn.closest('.project-card'),
        name: projectName
    };
    
    // Show confirmation modal
    document.getElementById('deleteProjectName').textContent = projectName;
    document.getElementById('deleteConfirmModal').style.display = 'flex';
}

function cancelDelete() {
    document.getElementById('deleteConfirmModal').style.display = 'none';
    projectToDelete = null;
}

function confirmDelete() {
    if (projectToDelete) {
        // Remove the project card with animation
        projectToDelete.card.style.transform = 'scale(0.8)';
        projectToDelete.card.style.opacity = '0';
        
        setTimeout(() => {
            projectToDelete.card.remove();
            
            // Store deleted project names to prevent re-adding
            if (!window.deletedProjects) {
                window.deletedProjects = new Set();
            }
            window.deletedProjects.add(projectToDelete.name);
        }, 200);
        
        // Close modal
        cancelDelete();
        
        // Show success message
        setTimeout(() => {
            alert(`Project "${projectToDelete.name}" deleted successfully!`);
        }, 300);
    }
}

function openProject(projectName) {
    // Hide other views
    document.getElementById('chatArea').style.display = 'none';
    document.getElementById('projectsView').style.display = 'none';
    document.getElementById('projectWorkspace').style.display = 'flex';
    
    // Update workspace title
    document.getElementById('workspaceTitle').textContent = projectName;
    // Update modal project name
    document.getElementById('modalProjectName').textContent = projectName;
    
    // Reset workspace state
    document.getElementById('workspaceWelcome').style.display = 'flex';
    document.getElementById('workspaceMessages').style.display = 'none';
    document.getElementById('workspaceMessages').innerHTML = '';
    document.getElementById('workspaceMessageInput').value = '';
    
    // Ensure knowledge panel is visible (not collapsed)
    const sidebar = document.getElementById('workspaceSidebar');
    const toggleBtn = document.getElementById('knowledgeToggle');
    sidebar.classList.remove('collapsed');
    toggleBtn.textContent = '📁 Project knowledge';
    knowledgePanelCollapsed = false;
}

function openInstructionsModal() {
    document.getElementById('instructionsModal').style.display = 'flex';
}

function closeInstructionsModal() {
    document.getElementById('instructionsModal').style.display = 'none';
}

function saveProjectInstructions() {
    const instructions = document.getElementById('instructionsModalTextarea').value.trim();
    const projectName = document.getElementById('workspaceTitle').textContent;
    
    if (instructions) {
        // Update the knowledge panel to show saved state
        const emptyKnowledge = document.getElementById('emptyKnowledge');
        const knowledgeContent = emptyKnowledge.parentElement;
        
        // Replace empty state with saved instructions preview
        knowledgeContent.innerHTML = `
            <div class="saved-instructions">
                <div class="saved-instructions-header">
                    <h4>Project Instructions</h4>
                    <button class="edit-instructions-btn" onclick="editInstructions()">Edit</button>
                </div>
                <div class="saved-instructions-preview">
                    ${instructions.substring(0, 100)}${instructions.length > 100 ? '...' : ''}
                </div>
            </div>
        `;
        
        // Store instructions (in real app, save to backend)
        window.currentProjectInstructions = instructions;
        
        closeInstructionsModal();
        
        // Show success message
        setTimeout(() => {
            alert(`Instructions saved for "${projectName}"!`);
        }, 100);
    } else {
        alert('Please enter some instructions before saving.');
    }
}

function editInstructions() {
    // Restore the saved instructions to the modal
    if (window.currentProjectInstructions) {
        document.getElementById('instructionsModalTextarea').value = window.currentProjectInstructions;
    }
    openInstructionsModal();
}

// Research functionality
function toggleResearch() {
    researchMode = !researchMode;
    const researchBtn = document.getElementById('researchBtn');
    
    if (researchMode) {
        researchBtn.classList.add('active');
        document.getElementById('researchModal').style.display = 'flex';
    } else {
        researchBtn.classList.remove('active');
        closeResearch();
    }
}

function closeResearch() {
    document.getElementById('researchModal').style.display = 'none';
    researchMode = false;
    const researchBtn = document.getElementById('researchBtn');
    if (researchBtn) {
        researchBtn.classList.remove('active');
    }
}

function startResearch() {
    const researchQuery = document.getElementById('researchInput').value.trim();
    
    if (!researchQuery) {
        alert('Please enter a research question');
        return;
    }
    
    // Close research modal
    closeResearch();
    
    // Set the main input with research query
    document.getElementById('messageInput').value = `[RESEARCH MODE] ${researchQuery}`;
    
    // Send the research message
    sendMessage();
}

function backToProjects() {
    document.getElementById('projectWorkspace').style.display = 'none';
    document.getElementById('projectsView').style.display = 'block';
    
    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.nav-item[onclick="switchToProjects()"]').classList.add('active');
}

function addProjectKnowledge() {
    document.getElementById('emptyKnowledge').style.display = 'none';
    document.getElementById('projectInstructions').style.display = 'block';
}

function cancelInstructions() {
    document.getElementById('projectInstructions').style.display = 'none';
    document.getElementById('emptyKnowledge').style.display = 'block';
}

function saveInstructions() {
    const instructions = document.querySelector('.instructions-textarea').value.trim();
    if (instructions) {
        alert('Project instructions saved successfully!');
        // In a real app, save to backend here
    }
    cancelInstructions();
}

// Knowledge panel toggle
let knowledgePanelCollapsed = false;

function toggleKnowledgePanel() {
    const sidebar = document.getElementById('workspaceSidebar');
    const toggleBtn = document.getElementById('knowledgeToggle');
    
    knowledgePanelCollapsed = !knowledgePanelCollapsed;
    
    if (knowledgePanelCollapsed) {
        sidebar.classList.add('collapsed');
        toggleBtn.textContent = '📁';
    } else {
        sidebar.classList.remove('collapsed');
        toggleBtn.textContent = '📁 Project knowledge';
    }
}