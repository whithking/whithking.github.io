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
function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (message) {
        // 添加用户消息
        addMessage(message, 'user');
        
        // 清空输入框
        input.value = '';
        
        // 模拟AI回复
        setTimeout(() => {
            const response = "这是一个模拟的AI回复。在实际应用中，你需要连接到真实的AI服务。";
            addMessage(response, 'ai');
        }, 1000);
    }
}

function addMessage(text, type) {
    const messagesDiv = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
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