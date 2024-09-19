document.addEventListener('DOMContentLoaded', function() {
    const linkButtons = document.querySelectorAll('.link-button');
    const timeDisplay = document.querySelector('.time');
    const window = document.querySelector('.window');
    const titleBar = document.querySelector('.title-bar');
    const linkContainer = document.getElementById('linkContainer');
    const minimizeButton = document.querySelector('button[aria-label="Minimize"]');
    const maximizeButton = document.querySelector('button[aria-label="Maximize"]');
    const closeButton = document.querySelector('button[aria-label="Close"]');

    // Sound effects
    const clickSound = new Audio('/static/sounds/click.wav');
    const startupSound = new Audio('/static/sounds/startup.wav');
    const errorSound = new Audio('/static/sounds/error.wav');

    // Play startup sound
    startupSound.play();

    // Link buttons functionality
    linkButtons.forEach(button => {
        button.addEventListener('click', function() {
            clickSound.play();
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
    updateClock(); // Initial call to display time immediately

    // Make window draggable
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    titleBar.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === titleBar) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, window);
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;

        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    // Minimize, Maximize, and Close functionality
    let isMinimized = false;
    let isMaximized = false;

    minimizeButton.addEventListener('click', () => {
        clickSound.play();
        if (!isMinimized) {
            window.classList.add('minimized');
            isMinimized = true;
        } else {
            window.classList.remove('minimized');
            isMinimized = false;
        }
    });

    maximizeButton.addEventListener('click', () => {
        clickSound.play();
        if (!isMaximized) {
            window.style.top = '0';
            window.style.left = '0';
            window.style.width = '100%';
            window.style.height = '100%';
            window.style.transform = 'none';
            isMaximized = true;
        } else {
            window.style.top = '50%';
            window.style.left = '50%';
            window.style.width = '400px';
            window.style.height = 'auto';
            window.style.transform = 'translate(-50%, -50%)';
            isMaximized = false;
        }
    });

    closeButton.addEventListener('click', () => {
        errorSound.play();
        setTimeout(() => {
            window.style.display = 'none';
        }, 500);
    });

    // Drag and drop functionality for link reordering
    let draggedItem = null;

    linkContainer.addEventListener('dragstart', (e) => {
        draggedItem = e.target.closest('.link-item');
        setTimeout(() => {
            draggedItem.style.display = 'none';
        }, 0);
    });

    linkContainer.addEventListener('dragend', () => {
        setTimeout(() => {
            draggedItem.style.display = '';
            draggedItem = null;
        }, 0);
    });

    linkContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(linkContainer, e.clientY);
        const currentItem = draggedItem;
        if (afterElement == null) {
            linkContainer.appendChild(draggedItem);
        } else {
            linkContainer.insertBefore(draggedItem, afterElement);
        }
    });

    linkContainer.addEventListener('dragenter', (e) => {
        e.preventDefault();
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.link-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Save the new order to the server
    function saveNewOrder() {
        clickSound.play();
        const linkItems = document.querySelectorAll('.link-item');
        const newOrder = Array.from(linkItems).map(item => item.dataset.id);

        fetch('/update_order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order: newOrder }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Order updated successfully:', data);
        })
        .catch((error) => {
            console.error('Error updating order:', error);
            errorSound.play();
        });
    }

    linkContainer.addEventListener('dragend', saveNewOrder);
});
