// 初始化Swiper轮播图
const swiper = new Swiper('.swiper', {
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

// 处理移动端菜单
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// 滚动时导航栏效果
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// AI助手聊天功能
async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (message) {
        // 添加用户消息
        addMessage(message, 'user');
        
        // 清空输入框
        input.value = '';
        
        // 显示加载状态
        const loadingMessage = addMessage('正在思考...', 'ai');
        
        try {
            // 调用通义千问API
            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.DASHSCOPE_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'qwen-max',
                    messages: [{
                        role: 'system',
                        content: '你是一个专业、友好的AI助手，会用简洁清晰的语言回答问题。'
                    }, {
                        role: 'user',
                        content: message
                    }],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });
            
            const data = await response.json();
            
            // 移除加载消息
            loadingMessage.remove();
            
            if (data.choices && data.choices[0]) {
                // 添加AI回复
                addMessage(data.choices[0].message.content, 'ai');
            } else {
                throw new Error('Invalid response from API');
            }
        } catch (error) {
            // 移除加载消息
            loadingMessage.remove();
            // 显示错误消息
            addMessage('抱歉，我遇到了一些问题。请稍后再试。', 'ai');
            console.error('Error:', error);
        }
    }
}

function addMessage(text, type) {
    const messagesDiv = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return messageDiv; // 返回消息元素，用于可能的后续移除
}

function toggleChat() {
    const chatContainer = document.getElementById('chat-container');
    const chatButton = document.querySelector('.chat-toggle-btn');
    chatContainer.style.display = chatContainer.style.display === 'none' ? 'flex' : 'none';
    chatButton.style.display = chatContainer.style.display === 'flex' ? 'none' : 'block';
}

// 添加回车发送功能
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// 初始化时隐藏聊天窗口
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('chat-container').style.display = 'none';
}); 