document.addEventListener('DOMContentLoaded', function() {
    const linkList = document.getElementById('linkList');
    let draggedItem = null;

    linkList.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        setTimeout(() => {
            e.target.style.opacity = '0.5';
        }, 0);
    });

    linkList.addEventListener('dragend', (e) => {
        setTimeout(() => {
            e.target.style.opacity = '1';
            draggedItem = null;
        }, 0);
    });

    linkList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(linkList, e.clientY);
        const currentItem = draggedItem;
        if (afterElement == null) {
            linkList.appendChild(draggedItem);
        } else {
            linkList.insertBefore(draggedItem, afterElement);
        }
    });

    linkList.addEventListener('dragenter', (e) => {
        e.preventDefault();
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

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

    function saveNewOrder() {
        const linkItems = document.querySelectorAll('#linkList li');
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
        });
    }

    linkList.addEventListener('dragend', saveNewOrder);
});
