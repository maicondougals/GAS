document.addEventListener('DOMContentLoaded', function () {
    const cart = [];
    const cartIndicator = document.getElementById('cart-indicator');
    const cartCount = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const closeModal = document.getElementById('close-modal');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalValue = document.getElementById('cart-total-value');
    const checkoutButton = document.getElementById('checkout-button');
    const neighborhoodSelect = document.getElementById('neighborhood');
    const streetInput = document.getElementById('street');
    const houseNumberInput = document.getElementById('house-number');
    
    const observationTextarea = document.getElementById('observation');
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const changeSection = document.getElementById('change-section');
    const noChangeCheckbox = document.getElementById('no-change');
    const changeForInput = document.getElementById('change-for');

    // Função para formatar o valor como moeda brasileira (R$)
    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    // Função para calcular o total do pedido (produtos + taxa de entrega)
    function calculateTotal() {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const deliveryFee = parseFloat(neighborhoodSelect.options[neighborhoodSelect.selectedIndex].getAttribute('data-fee')) || 0;
        return subtotal + deliveryFee;
    }

    // Função para atualizar o ícone do carrinho
    function updateCartIndicator() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Função para adicionar item ao carrinho
    function addToCart(productName, productPrice, quantity = 1) {
        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ name: productName, price: productPrice, quantity });
        }
        updateCartIndicator();
        updateInitialPageCounter(productName); // Atualiza o contador na página inicial
    }

    // Função para remover item do carrinho
    function removeFromCart(productName, quantity = 1) {
        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity -= quantity;
            if (existingItem.quantity <= 0) {
                const itemIndex = cart.findIndex(item => item.name === productName);
                cart.splice(itemIndex, 1);
            }
        }
        updateCartIndicator();
        updateInitialPageCounter(productName); // Atualiza o contador na página inicial
    }

    // Função para atualizar o contador na página inicial
    function updateInitialPageCounter(productName) {
        const card = document.querySelector(`.option-card[data-product-name="${productName}"]`);
        if (card) {
            const quantityElement = card.querySelector('.quantity');
            const cartItem = cart.find(item => item.name === productName);
            quantityElement.textContent = cartItem ? cartItem.quantity : 0;

            // Oculta o botão "-" se a quantidade for 0
            const minusButton = card.querySelector('.minus');
            minusButton.style.display = cartItem && cartItem.quantity > 0 ? 'inline-block' : 'none';
        }
    }

    // Função para abrir o modal do carrinho
    function openCartModal() {
        cartModal.style.display = 'flex';
        renderCartItems();
    }

    // Função para fechar o modal do carrinho
    function closeCartModal() {
        cartModal.style.display = 'none';
    }

    // Função para renderizar os itens do carrinho no modal
    function renderCartItems() {
        cartItemsList.innerHTML = '';
        let subtotal = 0;
        cart.forEach(item => {
            const li = document.createElement('li');
            li.className = 'cart-item';

            // Nome e preço do item
            const itemInfo = document.createElement('div');
            itemInfo.className = 'item-info';
            itemInfo.innerHTML = `<span class="item-name">${item.name}</span> - <span class="item-price">R$ ${(item.price * item.quantity).toFixed(2)}</span>`;
            li.appendChild(itemInfo);

            // Controle de quantidade no carrinho
            const quantityControl = document.createElement('div');
            quantityControl.className = 'quantity-control';
            quantityControl.innerHTML = `
                <button class="quantity-button minus counter-button" data-product="${item.name}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-button plus counter-button" data-product="${item.name}">+</button>
            `;
            li.appendChild(quantityControl);

            // Botão para remover o item do carrinho (usando uma imagem)
            const removeButton = document.createElement('img');
            removeButton.src = 'assets/lixeira.webp'; // Caminho da imagem
            removeButton.className = 'remove-button'; // Classe para estilização
            removeButton.setAttribute('data-product', item.name); // Atributo para identificar o produto
            removeButton.alt = 'Remover'; // Texto alternativo para acessibilidade
            li.appendChild(removeButton);

            cartItemsList.appendChild(li);
            subtotal += item.price * item.quantity;
        });

        // Atualiza o total do pedido (subtotal + taxa de entrega)
        const total = calculateTotal();
        cartTotalValue.textContent = total.toFixed(2);

        // Reatribui os event listeners aos botões "+", "-" e "Remover"
        attachCartItemEventListeners();
    }

    // Função para reatribuir os event listeners aos botões do carrinho
    function attachCartItemEventListeners() {
        // Event listeners para os botões de quantidade no carrinho
        document.querySelectorAll('.quantity-button').forEach(button => {
            button.addEventListener('click', function () {
                const productName = this.getAttribute('data-product');
                if (this.classList.contains('plus')) {
                    addToCart(productName, cart.find(item => item.name === productName).price);
                } else if (this.classList.contains('minus')) {
                    removeFromCart(productName);
                }
                renderCartItems(); // Re-renderiza os itens do carrinho
            });
        });

        // Event listeners para os botões de remoção no carrinho
        document.querySelectorAll('.remove-button').forEach(button => {
            button.addEventListener('click', function () {
                const productName = this.getAttribute('data-product');
                removeFromCart(productName, Infinity); // Remove todas as unidades
                renderCartItems(); // Re-renderiza os itens do carrinho
            });
        });
    }

    // Event listeners para os botões de quantidade na tela inicial
    document.querySelectorAll('.counter-button').forEach(button => {
        button.addEventListener('click', function () {
            const card = this.closest('.option-card');
            const productName = card.getAttribute('data-product-name');
            const productPrice = parseFloat(card.getAttribute('data-product-price'));
            const quantityElement = card.querySelector('.quantity');
            let quantity = parseInt(quantityElement.textContent);

            if (this.classList.contains('plus')) {
                quantity++;
                addToCart(productName, productPrice);
            } else if (this.classList.contains('minus') && quantity > 0) {
                quantity--;
                removeFromCart(productName);
            }

            quantityElement.textContent = quantity;

            // Oculta o botão "-" se a quantidade for 0
            const minusButton = card.querySelector('.minus');
            minusButton.style.display = quantity > 0 ? 'inline-block' : 'none';
        });
    });

    // Event listener para abrir o modal do carrinho
    cartIndicator.addEventListener('click', openCartModal);

    // Event listener para fechar o modal do carrinho
    closeModal.addEventListener('click', closeCartModal);

    // Event listener para o botão de finalizar pedido
    checkoutButton.addEventListener('click', function () {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio. Adicione itens antes de finalizar o pedido.');
            return;
        }
        if (!validateAddressForm() || !validatePaymentMethod()) {
            return;
        }
        const orderSummary = generateOrderSummary();
        const whatsappUrl = `https://wa.me/61998497382?text=${encodeURIComponent(orderSummary)}`;
        window.open(whatsappUrl, '_blank');
    });

    // Função para validar o formulário de endereço
    function validateAddressForm() {
        if (!neighborhoodSelect.value || !streetInput.value || !houseNumberInput.value) {
            alert('Por favor, preencha todos os campos obrigatórios do endereço.');
            return false;
        }
        return true;
    }

    // Função para validar o método de pagamento
    function validatePaymentMethod() {
        const selectedPaymentMethod = Array.from(paymentMethods).find(method => method.checked);
        if (!selectedPaymentMethod) {
            alert('Por favor, selecione uma forma de pagamento.');
            return false;
        }
        if (selectedPaymentMethod.value === 'Dinheiro') {
            if (!noChangeCheckbox.checked && !changeForInput.value) {
                alert('Por favor, informe para quanto precisa de troco ou marque "Não precisa de troco".');
                return false;
            }
            if (!noChangeCheckbox.checked && parseFloat(changeForInput.value) < parseFloat(cartTotalValue.textContent)) {
                alert('O valor informado para o troco está abaixo do total do pedido.');
                return false;
            }
        }
        return true;
    }

    // Função para gerar o resumo do pedido
    function generateOrderSummary() {
        let summary = 'Pedido:\n';
        cart.forEach(item => {
            summary += `${item.name} - ${item.quantity}x - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
        });
        summary += `\nEndereço de Entrega:\n`;
        summary += `Bairro: ${neighborhoodSelect.options[neighborhoodSelect.selectedIndex].text}\n`;
        summary += `Rua: ${streetInput.value}\n`;
        summary += `Número: ${houseNumberInput.value}\n`;
        summary += `Observação: ${observationTextarea.value || 'Nenhuma'}\n`;
        summary += `\nForma de Pagamento: ${Array.from(paymentMethods).find(method => method.checked).value}\n`;
        if (Array.from(paymentMethods).find(method => method.checked).value === 'Dinheiro' && !noChangeCheckbox.checked) {
            summary += `Troco para: ${formatCurrency(parseFloat(changeForInput.value))}\n`;
        }
        summary += `\nTotal: R$ ${calculateTotal().toFixed(2)}`; // Atualiza o total com a taxa de entrega
        return summary;
    }

    // Event listener para mostrar/ocultar o campo de troco
    paymentMethods.forEach(method => {
        method.addEventListener('change', function () {
            if (this.value === 'Dinheiro') {
                changeSection.style.display = 'block';
                changeForInput.style.display = 'block'; // Mostra o input "Troco para quanto"
                noChangeCheckbox.checked = false; // Desmarca o checkbox "Não precisa de troco"
            } else {
                changeSection.style.display = 'none';
            }
        });
    });

    // Event listener para mostrar/ocultar o campo de troco para
    noChangeCheckbox.addEventListener('change', function () {
        if (this.checked) {
            changeForInput.style.display = 'none'; // Oculta o input "Troco para quanto"
        } else {
            changeForInput.style.display = 'block'; // Mostra o input "Troco para quanto"
        }
    });

    // Event listener para permitir apenas números no input "Troco para quanto"
    changeForInput.addEventListener('input', function () {
        // Remove todos os caracteres que não são números ou pontos
        this.value = this.value.replace(/[^0-9.]/g, '');

        // Garante que o valor seja um número válido
        const value = parseFloat(this.value);
        if (isNaN(value)) {
            this.value = '';
        }
    });

    // Event listener para atualizar o total do pedido ao selecionar um bairro
    neighborhoodSelect.addEventListener('change', function () {
        renderCartItems(); // Re-renderiza os itens do carrinho para atualizar o total
    });
});





function verificarStatusLoja() {
    const agora = new Date();
    const hora = agora.getHours();
    const minutos = agora.getMinutes();
    const statusElement = document.getElementById('status-text');

    // Definir horário de funcionamento (exemplo: 8h às 18h)
    const horaAbertura = 8;
    const horaFechamento = 18;

    if (hora >= horaAbertura && hora < horaFechamento) {
        statusElement.textContent = `Loja aberta! Horário atual: ${hora}:${minutos < 10 ? '0' + minutos : minutos}`;
        statusElement.classList.remove('fechada');
        statusElement.classList.add('aberta');
    } else {
        statusElement.textContent = `Loja fechada. Horário atual: ${hora}:${minutos < 10 ? '0' + minutos : minutos}`;
        statusElement.classList.remove('aberta');
        statusElement.classList.add('fechada');
    }
}

// Verificar o status da loja ao carregar a página
verificarStatusLoja();

// Atualizar o status a cada minuto
setInterval(verificarStatusLoja, 60000);