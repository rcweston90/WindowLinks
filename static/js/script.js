// Apply theme immediately
const savedTheme = localStorage.getItem('selectedTheme');
if (savedTheme) {
    document.body.className = savedTheme;
    console.log('Theme applied:', savedTheme);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    const linkButtons = document.querySelectorAll('.link-button');
    const timeDisplay = document.querySelector('.time');
    const windowElement = document.querySelector('.window');
    const titleBar = document.querySelector('.title-bar');
    const linkContainer = document.getElementById('linkContainer');
    const minimizeButton = document.querySelector('button[aria-label="Minimize"]');
    const maximizeButton = document.querySelector('button[aria-label="Maximize"]');
    const closeButton = document.querySelector('button[aria-label="Close"]');
    const taskbarIcons = document.querySelector('.taskbar-icons');
    const themeSelector = document.getElementById('themeSelector');
    const desktopIcons = document.querySelectorAll('.desktop-icons .icon');
    const startButton = document.querySelector('.start-button');

    const clickSound = new Audio('/static/sounds/click.wav');
    const startupSound = new Audio('/static/sounds/startup.wav');
    const errorSound = new Audio('/static/sounds/error.wav');

    clickSound.volume = 0.7;
    startupSound.volume = 0.7;
    errorSound.volume = 0.7;

    // Play startup sound when the page is fully loaded
    startupSound.play().then(() => {
        console.log('Startup sound played successfully');
    }).catch((error) => {
        console.error('Error playing startup sound:', error);
    });

    // Theme switching functionality
    function applyTheme(theme) {
        document.body.className = theme;
        localStorage.setItem('selectedTheme', theme);
        console.log('Theme changed to:', theme);

        // Update desktop icons
        desktopIcons.forEach(icon => {
            const svg = icon.querySelector('svg');
            const action = icon.getAttribute('data-action');
            updateSVGColors(svg, theme, action);
        });

        // Update start button
        const startButtonSVG = startButton.querySelector('svg');
        updateSVGColors(startButtonSVG, theme, 'start-button');

        // Update window controls
        const controlButtons = document.querySelectorAll('.title-bar-controls button');
        controlButtons.forEach(button => {
            const action = button.getAttribute('aria-label').toLowerCase();
            updateButtonStyle(button, theme, action);
        });
    }

    function updateSVGColors(svg, theme, type) {
        const colors = getThemeColors(theme);
        if (type === 'open-computer') {
            svg.querySelector('rect:nth-child(1)').setAttribute('fill', colors.iconBorder);
            svg.querySelector('rect:nth-child(2)').setAttribute('fill', colors.iconBackground);
            svg.querySelector('rect:nth-child(3)').setAttribute('fill', colors.iconForeground);
        } else if (type === 'open-documents') {
            svg.querySelector('path:nth-child(1)').setAttribute('fill', colors.iconBorder);
            svg.querySelector('path:nth-child(2)').setAttribute('fill', colors.iconForeground);
        } else if (type === 'start-button') {
            svg.querySelector('rect:nth-child(1)').setAttribute('fill', colors.startButtonBackground);
            svg.querySelectorAll('rect:not(:first-child)').forEach(rect => {
                rect.setAttribute('fill', colors.startButtonForeground);
            });
        }
    }

    function updateButtonStyle(button, theme, action) {
        const colors = getThemeColors(theme);
        button.style.backgroundColor = colors.windowControlBackground;
        button.style.borderColor = colors.windowControlBorder;
    }

    function getThemeColors(theme) {
        switch (theme) {
            case 'win95':
                return {
                    iconBorder: '#c0c0c0',
                    iconBackground: '#000080',
                    iconForeground: '#ffffff',
                    startButtonBackground: '#c0c0c0',
                    startButtonForeground: '#000000',
                    windowControlBackground: '#c0c0c0',
                    windowControlBorder: '#000000'
                };
            case 'win98':
                return {
                    iconBorder: '#c3c7cb',
                    iconBackground: '#000080',
                    iconForeground: '#ffffff',
                    startButtonBackground: '#008080',
                    startButtonForeground: '#ffffff',
                    windowControlBackground: '#c0c0c0',
                    windowControlBorder: '#000000'
                };
            case 'winxp':
                return {
                    iconBorder: '#9db5ce',
                    iconBackground: '#3a6ea5',
                    iconForeground: '#ffffff',
                    startButtonBackground: '#4aaa04',
                    startButtonForeground: '#ffffff',
                    windowControlBackground: 'transparent',
                    windowControlBorder: '#ffffff'
                };
            default:
                return getThemeColors('win98');
        }
    }

    themeSelector.addEventListener('change', function() {
        applyTheme(this.value);
    });

    if (savedTheme) {
        themeSelector.value = savedTheme;
        applyTheme(savedTheme);
    }

    // Desktop icon functionality
    desktopIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            clickSound.play().then(() => {
                console.log('Click sound played successfully');
                const action = this.getAttribute('data-action');
                switch(action) {
                    case 'open-computer':
                        alert('Opening My Computer');
                        break;
                    case 'open-documents':
                        alert('Opening My Documents');
                        break;
                    default:
                        console.log('Unknown action:', action);
                }
            }).catch((error) => {
                console.error('Error playing click sound:', error);
            });
        });
    });

    // Link buttons functionality
    linkButtons.forEach(button => {
        button.addEventListener('click', function() {
            clickSound.play().then(() => {
                console.log('Click sound played successfully');
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
            }).catch((error) => {
                console.error('Error playing click sound:', error);
            });
            const url = this.getAttribute('data-url');
            window.open(url, '_blank');
        });
    });

    // Update clock
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeDisplay.textContent = `${hours}:${minutes}`;
    }

    setInterval(updateClock, 1000);
    updateClock();

    // Window controls functionality
    let isMinimized = false;
    let isMaximized = false;
    let originalStyles = {
        width: windowElement.style.width,
        height: windowElement.style.height,
        top: windowElement.style.top,
        left: windowElement.style.left,
        transform: windowElement.style.transform
    };

    minimizeButton.addEventListener('click', () => {
        clickSound.play().catch(console.error);
        windowElement.style.display = 'none';
        isMinimized = true;
        createTaskbarIcon();
    });

    maximizeButton.addEventListener('click', () => {
        clickSound.play().catch(console.error);
        if (!isMaximized) {
            originalStyles = {
                width: windowElement.style.width,
                height: windowElement.style.height,
                top: windowElement.style.top,
                left: windowElement.style.left,
                transform: windowElement.style.transform
            };
            windowElement.style.width = '100%';
            windowElement.style.height = 'calc(100% - 28px)';
            windowElement.style.top = '0';
            windowElement.style.left = '0';
            windowElement.style.transform = 'none';
            isMaximized = true;
        } else {
            Object.assign(windowElement.style, originalStyles);
            isMaximized = false;
        }
    });

    closeButton.addEventListener('click', () => {
        errorSound.play().catch(console.error);
        windowElement.style.display = 'none';
        createTaskbarIcon();
    });

    function createTaskbarIcon() {
        const icon = document.createElement('div');
        icon.classList.add('taskbar-icon');
        icon.innerHTML = '<img src="/static/images/window_icon.svg" alt="Window Icon"> My Links';
        icon.addEventListener('click', restoreWindow);
        taskbarIcons.appendChild(icon);
    }

    function restoreWindow() {
        windowElement.style.display = 'block';
        if (isMinimized) {
            isMinimized = false;
        }
        this.remove();
    }

    // Apply the initial theme
    applyTheme(themeSelector.value);
});

console.log('script.js loaded');
