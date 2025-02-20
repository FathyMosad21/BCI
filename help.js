document.querySelectorAll('.question').forEach(item => {
    item.addEventListener('click', () => {
        let answer = item.nextElementSibling;
        let arrow = item.querySelector('.arrow');
        answer.style.display = (answer.style.display === "block") ? "none" : "block";
        arrow.classList.toggle("rotate");
    });
});