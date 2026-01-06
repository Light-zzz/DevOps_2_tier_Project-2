document.querySelectorAll("input").forEach(input => {
    input.addEventListener("focus", () => {
        input.style.border = "2px solid #667eea";
    });
    input.addEventListener("blur", () => {
        input.style.border = "1px solid #ccc";
    });
});
