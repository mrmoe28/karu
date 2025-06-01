// Karu AI - Deploy Ready JavaScript
let sidebarCollapsed = false;
let settingsOpen = false;
let chatHistory = [];
let currentChatId = null;
let isGenerating = false;

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
    currentChatId = Date.now().toString();
    document.getElementById('welcomeScreen').style.display = 'block';
    document.getElementById('messages').style.display = 'none';
    document.getElementById('messages').innerHTML = '';
    document.getElementById('messageInput').value = '';
    
    // Update chat history
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
    }
    
    chat.messages.push({ role: 'user', content: userMessage });
    chat.messages.push({ role: 'assistant', content: assistantMessage });
    
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
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-profile')) {
            settingsOpen = false;
            document.getElementById('settingsDropdown').classList.remove('show');
        }
        
        // Close modals when clicking overlay
        if (e.target.classList.contains('modal-overlay')) {
            e.target.style.display = 'none';
        }
    });
    
    // Project form submission
    document.getElementById('projectForm').addEventListener('submit', handleProjectCreation);
    
    // Start with a new chat
    startNewChat();
});

// Navigation functions
function switchToChat() {
    document.getElementById('chatArea').style.display = 'flex';
    document.getElementById('projectsView').style.display = 'none';
    
    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.nav-item[onclick="switchToChat()"]').classList.add('active');
}

function switchToProjects() {
    document.getElementById('chatArea').style.display = 'none';
    document.getElementById('projectsView').style.display = 'block';
    
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
    newCard.innerHTML = `
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
    
    // Show success message
    setTimeout(() => {
        alert(`Project "${name}" created successfully!`);
    }, 100);
}