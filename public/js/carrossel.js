const stepImages = document.querySelectorAll('.step-image');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentStep = 0;

function updateStep(stepIndex) {
    stepImages.forEach((image, index) => {
        image.classList.remove('active');
        if (index === stepIndex) {
            image.classList.add('active');
        }
    });

    // Atualizar título e descrição (exemplo básico)
    const titles = ["1. Escolha o item que deseja e a quantidade desejada:", "2. Clique no carrinho no canto superior direito:", "3. No carrinho, preencha os campos de endereço e forma de pagamento e, após isso, finalize o seu pedido:"];
    const descriptions = [
        "Navegue pela nossa seleção de produtos e escolha o item que melhor atende às suas necessidades. Após selecionar, use os botões de + e - para definir a quantidade desejada. Clique em Comprar ou Trocar para adicionar o item ao seu carrinho.",
        "Após adicionar os itens ao carrinho, localize o ícone do carrinho no canto superior direito da tela. Clique nele para abrir o resumo do seu pedido. Aqui, você pode revisar os itens selecionados e prosseguir para a finalização.",
        "No carrinho, preencha todos os campos obrigatórios, como endereço de entrega e forma de pagamento. Selecione o bairro, informe a rua, número e CEP. Escolha entre Cartão, PIX ou Dinheiro. Após preencher todos os dados, clique em Finalizar Pedido para concluir sua compra. Seu pedido será enviado diretamente para o nosso WhatsApp!"
    ];
    document.querySelector('.step-title').textContent = titles[stepIndex];
    document.querySelector('.step-description').textContent = descriptions[stepIndex];
}

prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        updateStep(currentStep);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentStep < stepImages.length - 1) {
        currentStep++;
        updateStep(currentStep);
    }
});

// Inicializar o primeiro passo
updateStep(0);