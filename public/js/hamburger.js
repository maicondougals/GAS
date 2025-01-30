
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    // Função para alternar o menu hambúrguer
    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('active'); // Adiciona/remove a classe 'active' nos links
    });

    // Fechar o menu ao clicar em um link (opcional)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function () {
            navLinks.classList.remove('active'); // Fecha o menu após clicar em um link
        });
    });
});