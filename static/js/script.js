document.addEventListener('DOMContentLoaded', function() {
    const linkButtons = document.querySelectorAll('.link-button');

    linkButtons.forEach(button => {
        button.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            window.open(url, '_blank');
        });
    });
});
