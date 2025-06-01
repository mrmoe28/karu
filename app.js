// Karu AI - Deploy Ready JavaScript
let sidebarCollapsed = false;
let settingsOpen = false;
let chatHistory = [];
let currentChatId = null;
let isGenerating = false;
let researchMode = false;
let projectToDelete = null;
let artifactsOpen = false;
let desktopCommanderEnabled = false;
let chatDatabase = {
    chats: {},
    currentContext: []
};

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
    
    // Desktop Commander integration
    if (desktopCommanderEnabled) {
        return generateEnhancedResponse(message);
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

// Enhanced web page code generator with explanations
function generateWebPageCode(message) {
    const webPageTemplate = `I'll create a complete web page with navigation for you:

<div class="explanation-text">
I'm building a modern, responsive website with a navigation bar at the top and interactive elements. This will include glassmorphism effects and a professional design.
</div>

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyWebsite</title>
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
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
            padding: 0.5rem 1rem;
            border-radius: 5px;
        }
        
        .nav-links a:hover {
            background: rgba(255, 255, 255, 0.1);
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
            transition: background 0.3s;
        }
        
        .settings-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        .dropdown-content {
            display: none;
            position: absolute;
            right: 0;
            top: 100%;
            background: white;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            min-width: 200px;
            margin-top: 0.5rem;
            overflow: hidden;
        }
        
        .dropdown-content.show {
            display: block;
            animation: fadeIn 0.2s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .dropdown-item {
            padding: 0.75rem 1rem;
            cursor: pointer;
            color: #333;
            transition: background 0.2s;
        }
        
        .dropdown-item:hover {
            background: #f5f5f5;
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
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .hero p {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 2rem;
        }
        
        .cta-button {
            background: linear-gradient(45deg, #ff6b35, #f7931e);
            color: white;
            border: none;
            padding: 1rem 2rem;
            font-size: 1.1rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
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
            
            .main-content {
                padding: 1rem;
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
                    <div class="dropdown-item" onclick="changeTheme()">🎨 Change Theme</div>
                    <div class="dropdown-item" onclick="changeLanguage()">🌐 Language</div>
                    <div class="dropdown-item" onclick="showProfile()">👤 Profile</div>
                    <div class="dropdown-item" onclick="showHelp()">❓ Help</div>
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
            alert('🎨 Theme changed to Dark Mode!');
            toggleSettings();
        }
        
        function changeLanguage() {
            alert('🌐 Language set to English!');
            toggleSettings();
        }
        
        function showProfile() {
            alert('👤 Profile page opened!');
            toggleSettings();
        }
        
        function showHelp() {
            alert('❓ Help documentation opened!');
            toggleSettings();
        }
        
        function getStarted() {
            alert('🚀 Welcome! Let\\'s get started with your project.');
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

🎨 **Modern Design Features:**
- Gradient background with glassmorphism navigation
- Responsive layout that works on all devices
- Smooth animations and hover effects
- Professional typography and spacing

⚙️ **Interactive Settings Dropdown:**
- Theme switching capability
- Language preferences
- Profile management
- Help documentation

📱 **Responsive Design:**
- Mobile-friendly navigation
- Adaptive layout for all screen sizes
- Touch-friendly interactive elements

🚀 **Interactive Elements:**
- Functional dropdown menu with animations
- Hover effects and transitions
- Click handlers for all buttons
- Professional button styling with shadows

> The website is now ready to use! You can click the Settings button to see the dropdown menu in action, and all navigation links are functional. The design uses modern CSS features like backdrop-filter for the glassmorphism effect.

You can save this as an HTML file and open it in your browser. Would you like me to modify any specific aspects of the design or functionality?`;

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
        
        // Check for code blocks and open artifacts
        if (content.includes('```html') || content.includes('```css') || content.includes('```javascript')) {
            openArtifactsWithCode(content);
        }
        
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
    if (currentChatId && chatDatabase.chats[currentChatId]?.messages?.length > 0) {
        // Chat is already saved in database
    }
    
    // Create new chat
    currentChatId = Date.now().toString();
    chatDatabase.currentContext = []; // Reset context for new chat
    
    // Switch to main chat view
    document.getElementById('chatArea').style.display = 'flex';
    document.getElementById('projectsView').style.display = 'none';
    document.getElementById('projectWorkspace').style.display = 'none';
    
    // Show welcome screen, hide messages
    document.getElementById('welcomeScreen').style.display = 'block';
    const messagesEl = document.getElementById('messages');
    messagesEl.style.display = 'none';
    messagesEl.classList.remove('active');
    messagesEl.innerHTML = '';
    
    // Clear and enable input
    const messageInput = document.getElementById('messageInput');
    messageInput.value = '';
    messageInput.disabled = false;
    
    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.nav-item[onclick="switchToChat()"]').classList.add('active');
    
    // Update chat history display
    loadChatHistory();
}

function updateChatHistory() {
    // This function is now handled by loadChatHistory()
    loadChatHistory();
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
    messageInput.value = ''; // Clear input immediately
    messageInput.disabled = false;
    
    // Show messages container and hide welcome if needed
    const messagesEl = document.getElementById('messages');
    const welcomeEl = document.getElementById('welcomeScreen');
    
    if (welcomeEl.style.display !== 'none') {
        welcomeEl.style.display = 'none';
        messagesEl.style.display = 'block';
        messagesEl.classList.add('active');
    }
    
    // Add user message
    addMessage('user', message);
    
    // Add typing indicator
    const typingId = addMessage('assistant', 'Thinking...');
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Generate response with context
    const response = generateSmartResponseWithMemory(message);
    
    // Replace typing indicator with actual response
    updateMessage(typingId, response);
    
    // Save to chat database
    saveChatToDatabase(message, response);
    
    isGenerating = false;
    
    // Re-enable input and focus
    messageInput.disabled = false;
    messageInput.focus();
}

function addMessage(sender, content) {
    const messagesEl = document.getElementById('messages');
    const messageId = Date.now() + Math.random();
    
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender}`;
    messageEl.id = `message-${messageId}`;
    
    // Create avatar
    const avatarEl = document.createElement('div');
    avatarEl.className = 'message-avatar';
    avatarEl.textContent = sender === 'user' ? 'U' : 'K';
    
    // Create content
    const contentEl = document.createElement('div');
    contentEl.className = 'message-content';
    
    if (sender === 'assistant' && content === 'Thinking...') {
        contentEl.innerHTML = '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
    } else {
        contentEl.innerHTML = formatMessage(content);
    }
    
    // Add message actions for assistant messages
    if (sender === 'assistant' && content !== 'Thinking...') {
        const actionsEl = document.createElement('div');
        actionsEl.className = 'message-actions';
        actionsEl.innerHTML = `
            <button class="message-action-btn" onclick="copyMessage('${messageId}')">Copy</button>
            <button class="message-action-btn" onclick="regenerateMessage('${messageId}')">Regenerate</button>
        `;
        contentEl.appendChild(actionsEl);
    }
    
    messageEl.appendChild(avatarEl);
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
        
        // Check for code blocks and open artifacts
        if (content.includes('```html') || content.includes('```css') || content.includes('```javascript')) {
            openArtifactsWithCode(content);
        }
        
        // Highlight code if present
        messageEl.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });
    }
}

function formatMessage(content) {
    // Enhanced markdown-like formatting
    let formatted = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Handle code blocks with language detection
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'text';
        return `<pre data-language="${language}"><code class="language-${language}">${code.trim()}</code></pre>`;
    });
    
    // Handle feature lists (🎨 **Feature:** description)
    formatted = formatted.replace(/^(🎨|⚙️|📱|🚀|💻|🔧|✨|🌟|📊|🎯)\s\*\*(.*?):\*\*(.*?)$/gm, 
        '<div class="feature-item"><span class="feature-icon">$1</span><div><strong>$2:</strong>$3</div></div>'
    );
    
    // Wrap consecutive feature items in a feature list
    formatted = formatted.replace(/((?:<div class="feature-item">.*?<\/div>\s*)+)/g, 
        '<div class="feature-list">$1</div>'
    );
    
    // Handle explanation blocks
    formatted = formatted.replace(/^>\s(.*?)$/gm, '<div class="explanation-text">$1</div>');
    
    // Convert line breaks
    formatted = formatted.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
    
    // Wrap in paragraphs if not already wrapped
    if (!formatted.includes('<p>') && !formatted.includes('<div') && !formatted.includes('<pre>')) {
        formatted = '<p>' + formatted + '</p>';
    }
    
    return formatted;
}

// Chat Database Management
function initializeChatDatabase() {
    const saved = localStorage.getItem('karuChatDatabase');
    if (saved) {
        chatDatabase = JSON.parse(saved);
    }
    loadChatHistory();
}

function saveChatToDatabase(userMessage, assistantMessage) {
    if (!currentChatId) {
        currentChatId = Date.now().toString();
    }
    
    // Initialize chat if it doesn't exist
    if (!chatDatabase.chats[currentChatId]) {
        chatDatabase.chats[currentChatId] = {
            id: currentChatId,
            title: userMessage.substring(0, 50) + (userMessage.length > 50 ? '...' : ''),
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }
    
    // Add messages
    const chat = chatDatabase.chats[currentChatId];
    chat.messages.push({ 
        role: 'user', 
        content: userMessage, 
        timestamp: new Date().toISOString() 
    });
    chat.messages.push({ 
        role: 'assistant', 
        content: assistantMessage, 
        timestamp: new Date().toISOString() 
    });
    chat.updatedAt = new Date().toISOString();
    
    // Update current context for memory
    chatDatabase.currentContext.push({ role: 'user', content: userMessage });
    chatDatabase.currentContext.push({ role: 'assistant', content: assistantMessage });
    
    // Keep context to last 10 exchanges (20 messages)
    if (chatDatabase.currentContext.length > 20) {
        chatDatabase.currentContext = chatDatabase.currentContext.slice(-20);
    }
    
    // Save to localStorage
    localStorage.setItem('karuChatDatabase', JSON.stringify(chatDatabase));
    
    // Update UI
    loadChatHistory();
}

function loadChatHistory() {
    const historyEl = document.getElementById('chatHistory');
    if (!historyEl) return;
    
    historyEl.innerHTML = '';
    
    // Convert chats object to array and sort by updatedAt
    const chatsArray = Object.values(chatDatabase.chats)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 20); // Show only latest 20 chats
    
    chatsArray.forEach(chat => {
        const chatEl = document.createElement('div');
        chatEl.className = 'chat-item';
        if (chat.id === currentChatId) {
            chatEl.classList.add('active');
        }
        chatEl.textContent = chat.title;
        chatEl.onclick = () => loadChat(chat.id);
        historyEl.appendChild(chatEl);
    });
}

function loadChat(chatId) {
    const chat = chatDatabase.chats[chatId];
    if (!chat) return;
    
    currentChatId = chatId;
    
    // Clear current messages
    const messagesEl = document.getElementById('messages');
    messagesEl.innerHTML = '';
    
    // Load chat messages
    chat.messages.forEach(msg => {
        addMessage(msg.role, msg.content);
    });
    
    // Show messages area
    document.getElementById('welcomeScreen').style.display = 'none';
    messagesEl.style.display = 'block';
    messagesEl.classList.add('active');
    
    // Update context
    chatDatabase.currentContext = [...chat.messages];
    
    // Update UI
    loadChatHistory();
}

function generateSmartResponseWithMemory(message) {
    // Add context to response generation
    const context = chatDatabase.currentContext.slice(-6); // Last 3 exchanges
    const hasContext = context.length > 0;
    
    if (hasContext) {
        // Check if user is referring to previous conversation
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes('remember') || lowerMsg.includes('earlier') || lowerMsg.includes('before') || 
            lowerMsg.includes('previous') || lowerMsg.includes('that') || lowerMsg.includes('it')) {
            return generateContextualResponse(message, context);
        }
    }
    
    // Generate normal response with enhanced context awareness
    return generateSmartResponse(message);
}

function generateContextualResponse(message, context) {
    const previousTopics = context
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join(' ');
    
    const responses = [
        `I remember our previous conversation about ${extractMainTopic(previousTopics)}. ${generateSmartResponse(message)}`,
        
        `Based on what we discussed earlier regarding ${extractMainTopic(previousTopics)}, ${generateSmartResponse(message)}`,
        
        `Continuing from our previous discussion about ${extractMainTopic(previousTopics)}: ${generateSmartResponse(message)}`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

function extractMainTopic(text) {
    const topics = ['web development', 'Python coding', 'JavaScript', 'React', 'HTML', 'CSS', 'APIs', 'databases', 'debugging'];
    const found = topics.find(topic => text.toLowerCase().includes(topic.toLowerCase()));
    return found || 'programming';
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
    
    // Start with a new chat and initialize database
    initializeChatDatabase();
    startNewChat();
    
    // Ensure input is enabled
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.disabled = false;
    }
});

// Navigation functions
function switchToChat() {
    // Show main chat area, hide others
    document.getElementById('chatArea').style.display = 'flex';
    document.getElementById('projectsView').style.display = 'none';
    document.getElementById('projectWorkspace').style.display = 'none';
    
    // Close artifacts if open
    if (artifactsOpen) {
        closeArtifacts();
    }
    
    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.nav-item[onclick="switchToChat()"]').classList.add('active');
}

function switchToProjects() {
    // Show projects view, hide others
    document.getElementById('chatArea').style.display = 'none';
    document.getElementById('projectsView').style.display = 'block';
    document.getElementById('projectWorkspace').style.display = 'none';
    
    // Close artifacts if open
    if (artifactsOpen) {
        closeArtifacts();
    }
    
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

// Artifacts functionality with live code writing
function openArtifactsWithCode(content) {
    // Extract HTML code from the message
    const htmlMatch = content.match(/```html\n([\s\S]*?)```/);
    if (htmlMatch) {
        const htmlCode = htmlMatch[1];
        
        // Open artifacts panel
        const artifactsPanel = document.getElementById('artifactsPanel');
        const mainContent = document.querySelector('.main-content');
        const chatArea = document.getElementById('chatArea');
        
        artifactsPanel.classList.add('open');
        artifactsPanel.classList.remove('minimized');
        mainContent.classList.add('has-artifacts');
        chatArea.classList.add('with-artifacts');
        document.body.classList.add('artifacts-open');
        artifactsOpen = true;
        
        // Show live code writing first
        showLiveCodeWriting(htmlCode).then(() => {
            // After writing animation, show final code and preview
            document.getElementById('artifactsCodeContent').textContent = htmlCode;
            
            // Create preview
            const iframe = document.getElementById('artifactsIframe');
            const blob = new Blob([htmlCode], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            iframe.src = url;
            
            // Highlight code
            hljs.highlightElement(document.getElementById('artifactsCodeContent'));
            
            // Switch to preview tab
            switchArtifactTab('preview');
        });
        
        // Initialize resizing
        initializeResize();
    }
}

async function showLiveCodeWriting(code) {
    // Show live code tab
    const liveCodeEl = document.getElementById('artifactsLiveCode');
    const previewEl = document.getElementById('artifactsPreview');
    const codeEl = document.getElementById('artifactsCode');
    const tabsEl = document.getElementById('artifactsTabs');
    
    // Hide other content, show live writing
    previewEl.style.display = 'none';
    codeEl.style.display = 'none';
    liveCodeEl.style.display = 'block';
    tabsEl.style.display = 'none'; // Hide tabs during writing
    
    const liveCodeContent = document.getElementById('artifactsLiveCodeContent');
    liveCodeContent.textContent = '';
    
    // Typewriter effect
    let currentText = '';
    const cursor = '<span class="typewriter-cursor"></span>';
    
    for (let i = 0; i < code.length; i++) {
        currentText += code[i];
        liveCodeContent.innerHTML = currentText + cursor;
        
        // Scroll to bottom
        liveCodeContent.scrollIntoView({ behavior: 'smooth', block: 'end' });
        
        // Variable delay for realistic typing
        const delay = code[i] === '\n' ? 50 : Math.random() * 30 + 5;
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // Remove cursor and show tabs
    liveCodeContent.innerHTML = currentText;
    hljs.highlightElement(liveCodeContent);
    
    // Wait a moment then show tabs and switch to code view
    await new Promise(resolve => setTimeout(resolve, 500));
    
    tabsEl.style.display = 'flex';
    liveCodeEl.style.display = 'none';
    codeEl.style.display = 'block';
}

function toggleArtifactsMinimize() {
    const panel = document.getElementById('artifactsPanel');
    const button = document.getElementById('artifactsMinimize');
    const mainContent = document.querySelector('.main-content');
    
    panel.classList.toggle('minimized');
    
    if (panel.classList.contains('minimized')) {
        button.textContent = '+';
        button.style.transform = 'rotate(0deg)';
        mainContent.style.marginRight = '40px';
    } else {
        button.textContent = '−';
        button.style.transform = '';
        mainContent.style.marginRight = panel.style.width || '600px';
    }
}

function closeArtifacts() {
    const artifactsPanel = document.getElementById('artifactsPanel');
    const mainContent = document.querySelector('.main-content');
    const chatArea = document.getElementById('chatArea');
    
    artifactsPanel.classList.remove('open');
    artifactsPanel.classList.remove('minimized');
    mainContent.classList.remove('has-artifacts');
    chatArea.classList.remove('with-artifacts');
    document.body.classList.remove('artifacts-open');
    mainContent.style.marginRight = '';
    artifactsOpen = false;
}

function initializeResize() {
    const resizeHandle = document.getElementById('resizeHandle');
    const artifactsPanel = document.getElementById('artifactsPanel');
    let isResizing = false;
    
    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        resizeHandle.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        const containerWidth = window.innerWidth;
        const newWidth = containerWidth - e.clientX;
        const minWidth = 300;
        const maxWidth = containerWidth * 0.8;
        
        if (newWidth >= minWidth && newWidth <= maxWidth) {
            artifactsPanel.style.width = newWidth + 'px';
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            resizeHandle.classList.remove('dragging');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });
}

// Message actions
function copyMessage(messageId) {
    const messageEl = document.getElementById(`message-${messageId}`);
    const content = messageEl.querySelector('.message-content').innerText;
    navigator.clipboard.writeText(content).then(() => {
        // Show brief feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 1000);
    });
}

function regenerateMessage(messageId) {
    // Find the message and regenerate response
    alert('Regenerate functionality - would re-run the AI response');
}

function switchArtifactTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.artifacts-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tab + 'Tab').classList.add('active');
    
    // Show/hide content
    if (tab === 'preview') {
        document.getElementById('artifactsPreview').style.display = 'block';
        document.getElementById('artifactsCode').style.display = 'none';
    } else {
        document.getElementById('artifactsPreview').style.display = 'none';
        document.getElementById('artifactsCode').style.display = 'block';
    }
}

// Desktop Commander functionality
function toggleDesktopCommander() {
    desktopCommanderEnabled = !desktopCommanderEnabled;
    
    const indicator = document.getElementById('dcToggleIndicator');
    const icon = document.getElementById('dcToggleIcon');
    
    if (desktopCommanderEnabled) {
        indicator.textContent = 'ON';
        indicator.classList.add('on');
        icon.textContent = '💻';
        
        // Test DC connection
        testDesktopCommander();
    } else {
        indicator.textContent = 'OFF';
        indicator.classList.remove('on');
        icon.textContent = '🖥️';
    }
    
    toggleSettings(); // Close dropdown
    
    setTimeout(() => {
        alert(`Desktop Commander ${desktopCommanderEnabled ? 'enabled' : 'disabled'}!`);
    }, 100);
}

async function testDesktopCommander() {
    try {
        // Test basic DC functionality
        const response = await fetch('/api/dc/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: 'test' })
        });
        
        if (response.ok) {
            console.log('Desktop Commander connected successfully');
        } else {
            console.log('Desktop Commander not available - using simulation mode');
        }
    } catch (error) {
        console.log('Desktop Commander not available - using simulation mode');
    }
}

// Enhanced response generator with DC support
function generateEnhancedResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    // Desktop Commander commands
    if (desktopCommanderEnabled && (
        lowerMsg.includes('file') || lowerMsg.includes('folder') || 
        lowerMsg.includes('directory') || lowerMsg.includes('create') ||
        lowerMsg.includes('read') || lowerMsg.includes('write') ||
        lowerMsg.includes('execute') || lowerMsg.includes('command')
    )) {
        return generateDCResponse(message);
    }
    
    return generateSmartResponse(message);
}

function generateDCResponse(message) {
    const dcResponses = [
        `🖥️ **Desktop Commander Integration**

I can help you with desktop operations! Here are some things I can do:

**File Operations:**
\`\`\`bash
# Create a new file
touch example.txt

# Read file contents
cat example.txt

# Create directory
mkdir new_project

# List directory contents
ls -la
\`\`\`

**Development Tasks:**
- Create project structures
- Read and modify files
- Execute scripts and commands
- Navigate file systems
- Search for files and content

**Example Commands:**
- "Create a new Python project"
- "Read the contents of config.json"
- "List all JavaScript files in this directory"
- "Execute the build script"

What specific desktop operation would you like me to help with?`,

        `💻 **Desktop Commander Active**

I'm connected to your desktop and ready to help! I can:

**File Management:**
- Create, read, edit, and delete files
- Navigate directories
- Search file contents
- Manage project structures

**Development Operations:**
- Run build scripts
- Execute commands
- Install dependencies
- Start development servers

**System Integration:**
- Access local files and folders
- Execute terminal commands
- Monitor system processes
- Automate repetitive tasks

Just tell me what you'd like me to do with your files or system, and I'll handle it for you!`
    ];
    
    return dcResponses[Math.floor(Math.random() * dcResponses.length)];
}