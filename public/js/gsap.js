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

// Animação para os títulos da seção dica
gsap.utils.toArray(".dica-div h2").forEach((title) => {
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

// Animação para as imagens da seção dica
gsap.utils.toArray(".dica-div img").forEach((img) => {
    gsap.from(img, {
        opacity: 0,
        x: -100, // Move a imagem para a esquerda
        duration: 1,
        scrollTrigger: {
            trigger: img, // Elemento que dispara a animação
            start: "top 50%", // Quando o topo da imagem chegar a 80% da tela
            toggleActions: "play none none none", // Dispara a animação uma vez
            markers:false
        },
    });
});



const dicaContainer = document.querySelector('.dica-container');

// Crie a animação com GSAP
gsap.to(dicaContainer, {
    borderRadius: 0, // Altera a borda para 0
    width:'100vw',
    y:-100,
  scrollTrigger: {
    trigger: dicaContainer, // Elemento que vai disparar a animação
    start: "top 60%", // Quando o topo do elemento chegar a 25% da tela
    end: "top top", // Quando o fundo do elemento chegar a 75% da tela
    scrub: 2, // Faz a animação ser suave e acompanhar o scroll
    markers: false // Opcional: mostra marcadores para debug (true para ver)
  }
});



gsap.to('.woman-container',{
    opacity:1,
    //duration:1,
    y:100,
    filter: 'blur(0)',
    scrollTrigger: {
        trigger: '.woman-container',
        start: 'top 30%',
        end:'top top',
    }
})
gsap.to('.woman-container h1',{
    opacity:1,
    duration:1,
    
    scrollTrigger: {
        trigger: '.woman-container',
        start: 'top 20%',
        

       
        
    }
})
gsap.to('.sobre-img',{
    boxShadow:'20px -20px 1px 10px var(--primary-color)',
    
    
    scrollTrigger: {
        trigger: '.sobre-container',
        start: 'top center',
        

       
        
    }
})




//
//
//
// BLUR
//
//
//

gsap.to('.text-container, .sobre-img',{
    filter:'blur(8px)',
    y:-100,
    
    scrollTrigger: {
        trigger: '.sobre-container',
        start: 'bottom 40%',
        //end:'bottom top',
        scrub:1

       
        
    }
})
gsap.to('.woman-container',{
    borderRadius:0,
    width:'100vw',
    
    scrollTrigger: {
        trigger: '.woman-container',
        start: 'bottom center',
        //end:'bottom top',
        scrub:1

       
        
    }
})

gsap.to('.phone-mockup',{
    scale:1,
    
    scrollTrigger: {
        trigger: '.carousel',
        start: 'top center',
        //end:'bottom top',
        scrub:1

       
        
    }
})

