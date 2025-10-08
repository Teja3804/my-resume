// Portfolio JavaScript - Clean Version
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initDataStructureAnimations();
    initTypingEffect();
    
    // Initialize working chatbot
    setTimeout(() => {
        workingChatbot();
    }, 2000);
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width;
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Data structure animations
function initDataStructureAnimations() {
    const binaryTree = document.querySelector('.binary-tree');
    if (binaryTree) {
        setInterval(() => {
            const nodes = binaryTree.querySelectorAll('.node');
            nodes.forEach(node => {
                if (Math.random() > 0.7) {
                    node.classList.add('pulse');
                    setTimeout(() => node.classList.remove('pulse'), 1000);
                }
            });
        }, 2000);
    }
}

// Typing effect
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const texts = ['Software Developer', 'Problem Solver', 'Tech Enthusiast'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        setTimeout(typeText, typeSpeed);
    }

    typeText();
}

// WORKING CHATBOT - GUARANTEED TO WORK
function workingChatbot() {
    console.log('WORKING CHATBOT: Starting...');
    
    const input = document.getElementById('assistant-input');
    const sendBtn = document.getElementById('assistant-send');
    const messages = document.getElementById('assistant-messages');
    
    if (!input || !sendBtn || !messages) {
        console.log('WORKING CHATBOT: Elements not found, retrying...');
        setTimeout(workingChatbot, 1000);
        return;
    }
    
    console.log('WORKING CHATBOT: All elements found!');
    
    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'message user-message';
        userMsg.innerHTML = '<div class="message-content">' + text + '</div>';
        messages.appendChild(userMsg);
        
        // Clear input
        input.value = '';
        
        // Add bot response
        setTimeout(() => {
            let response = "Sorry, I can only help with headache, sleep, and general health topics.";
            
            if (text.toLowerCase().includes('headache')) {
                response = "Headaches can be caused by stress, dehydration, or lack of sleep. Try drinking water, resting in a dark room, or gentle neck stretches.";
            } else if (text.toLowerCase().includes('sleep')) {
                response = "For better sleep: maintain a regular schedule, avoid screens before bed, keep room cool and dark, avoid caffeine after 2 PM.";
            } else if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
                response = "Hello! I can help with headache, sleep, and general health questions. What would you like to know?";
            }
            
            const botMsg = document.createElement('div');
            botMsg.className = 'message bot-message';
            botMsg.innerHTML = '<div class="message-content">' + response + '</div>';
            messages.appendChild(botMsg);
            
            messages.scrollTop = messages.scrollHeight;
        }, 500);
    }
    
    // Set up events
    sendBtn.onclick = sendMessage;
    input.onkeypress = function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };
    
    console.log('WORKING CHATBOT: Ready!');
}
