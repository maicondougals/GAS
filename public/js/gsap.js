// Animação para o Hero Section ao carregar a página
gsap.from(".hero-content h1", {
    opacity: 0,
    y: -50, // Move o título para cima
    duration: 1,
    delay: 0.5, // Atraso para começar a animação
    ease: "power2.out", // Efeito de easing suave
});

gsap.from(".hero-content h2", {
    opacity: 0,
    y: -50, // Move o subtítulo para cima
    duration: 1,
    delay: 0.8, // Atraso maior para animação em sequência
    ease: "power2.out",
});

gsap.from(".hero-content p", {
    opacity: 0,
    y: 50, // Move os parágrafos para baixo
    duration: 1,
    delay: 1.1, // Atraso maior para animação em sequência
    ease: "power2.out",
});

gsap.from(".buttons", {
    opacity: 0,
    y: 50, // Move os botões para baixo
    duration: 1,
    delay: 1.4, // Atraso maior para animação em sequência
    ease: "power2.out",
});

gsap.from(".hero-image img", {
    opacity: 0,
    x: 100, // Move a imagem para a direita
    duration: 1.5,
    delay: 0.5, // Atraso para começar a animação
    ease: "power2.out",
});

// Inicializa o plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Animação para os títulos da seção tutorial
gsap.utils.toArray(".tutorial-div h3").forEach((title) => {
    gsap.from(title, {
        opacity: 0,
        y: 50, // Move o título para baixo
        duration: 1,
        scrollTrigger: {
            trigger: title, // Elemento que dispara a animação
            start: "top 80%", // Quando o topo do título chegar a 80% da tela
            toggleActions: "play none none none", // Dispara a animação uma vez
        },
    });
});

// Animação para as imagens da seção tutorial
gsap.utils.toArray(".tutorial-div img").forEach((img) => {
    gsap.from(img, {
        opacity: 0,
        x: -100, // Move a imagem para a esquerda
        duration: 1,
        scrollTrigger: {
            trigger: img, // Elemento que dispara a animação
            start: "top 10%", // Quando o topo da imagem chegar a 80% da tela
            toggleActions: "play none none none", // Dispara a animação uma vez
        },
    });
});