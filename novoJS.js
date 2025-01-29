
// =============================================================================
// VARIÁVEIS GLOBAIS E CONSTANTES
// =============================================================================

let cartCount = 0; // Contador global de itens no carrinho
const cart = []; // Array para armazenar os itens do carrinho

// Constantes para os elementos do DOM que são frequentemente acessados
const cartIndicator = document.getElementById('cart-count');
const cartIcon = document.getElementById('cart-indicator');
const pluralS = document.getElementById('plural-s');
const cartModal = document.getElementById('cart-modal');
const closeModalButton = document.getElementById('close-modal');
const cartItemsList = document.getElementById('cart-items');
const cartTotalValue = document.getElementById('cart-total-value');
const checkoutButton = document.getElementById('checkout-button');
const neighborhoodSelect = document.getElementById('neighborhood');
const streetInput = document.getElementById('street');
const houseNumberInput = document.getElementById('house-number');
const cepInput = document.getElementById('cep');
const observationInput = document.getElementById('observation');

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

// Atualiza o indicador de quantidade de itens no carrinho
function updateCartIndicator() {
    cartIndicator.textContent = cartCount;
    pluralS.textContent = cartCount === 1 ? '' : 'ns';
    validateForm(); // Aproveita para validar o formulário sempre que o carrinho é atualizado
}

// Atualiza o conteúdo do modal do carrinho
function updateCartModal() {
    cartItemsList.innerHTML = ''; // Limpa a lista de itens do modal

    let total = 0;

    // Itera sobre cada item no carrinho
    cart.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('cart-item');

        const itemName = document.createElement('span');
        itemName.classList.add('cart-item-name');
        itemName.textContent = item.name;

        const itemQuantity = document.createElement('span');
        itemQuantity.classList.add('cart-item-quantity');
        itemQuantity.textContent = `x${item.quantity}`;

        const itemPrice = document.createElement('span');
        itemPrice.classList.add('cart-item-price');
        itemPrice.textContent = `R$ ${(item.price * item.quantity).toFixed(2)}`;

        // Botão para remover o item do carrinho
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-item');
        removeButton.textContent = 'Remover';
        removeButton.addEventListener('click', () => {
            removeFromCart(item.id); // Remove o item pelo ID

            // Atualiza o botão correspondente na página principal
            const buttonWrapper = document.getElementById(item.id);
            updateButtonState(item.id, 0); // Reseta o estado do botão
        });

        li.appendChild(itemName);
        li.appendChild(itemQuantity);
        li.appendChild(itemPrice);
        li.appendChild(removeButton);
        cartItemsList.appendChild(li);

        total += item.price * item.quantity;
    });

    // Adiciona a taxa de entrega ao total, se houver
    const selectedNeighborhood = neighborhoodSelect.options[neighborhoodSelect.selectedIndex];
    const deliveryFee = selectedNeighborhood ? parseFloat(selectedNeighborhood.dataset.fee) : 0;
    total += deliveryFee;

    cartTotalValue.textContent = total.toFixed(2); // Atualiza o valor total
}

// Adiciona um item ao carrinho
function addToCart(productName, productId, productPrice) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++; // Incrementa a quantidade se o item já existir
    } else {
        cart.push({ id: productId, name: productName, quantity: 1, price: productPrice }); // Adiciona o novo item
    }
    cartCount = cart.reduce((total, item) => total + item.quantity, 0); // Recalcula a contagem total
    updateCartIndicator();
    saveCartToLocalStorage();
}

// Remove um item do carrinho
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cartCount -= cart[itemIndex].quantity; // Deduz a quantidade do item removido
        cart.splice(itemIndex, 1); // Remove o item do carrinho
        updateCartIndicator();
        updateCartModal();
        saveCartToLocalStorage();
    }
}

// Atualiza o estado do botão na página principal
function updateButtonState(buttonId, quantity) {
    const buttonWrapper = document.getElementById(buttonId);
    const button = buttonWrapper.querySelector('.option-button');
    const counter = buttonWrapper.querySelector('.counter');
    const quantitySpan = counter.querySelector('.quantity');

    buttonWrapper.quantity = quantity;
    quantitySpan.textContent = quantity;

    if (quantity === 0) {
        counter.style.display = 'none';
        button.style.display = 'block';
    } else {
        counter.style.display = 'flex';
        button.style.display = 'none';
    }
    saveButtonStateToLocalStorage(buttonId, quantity);
}

// =============================================================================
// EVENT LISTENERS
// =============================================================================

// Abre o modal do carrinho ao clicar no ícone do carrinho
cartIcon.addEventListener('click', () => {
    updateCartModal();
    cartModal.style.display = 'flex';
    setTimeout(() => cartModal.style.opacity = 1, 10);
});

// Fecha o modal do carrinho ao clicar no botão de fechar
closeModalButton.addEventListener('click', () => {
    cartModal.style.opacity = 0;
    setTimeout(() => cartModal.style.display = 'none', 500);
});

// Fecha o modal ao clicar fora do conteúdo
window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.opacity = 0;
        setTimeout(() => cartModal.style.display = 'none', 500);
    }
});

// Configuração dos botões de adicionar e remover itens
function setupButton(buttonId) {
    const buttonWrapper = document.getElementById(buttonId);
    buttonWrapper.quantity = 0;
    const button = buttonWrapper.querySelector('.option-button');
    const counter = buttonWrapper.querySelector('.counter');
    const quantitySpan = counter.querySelector('.quantity');
    const plusButton = counter.querySelector('.plus');
    const minusButton = counter.querySelector('.minus');
    const productPrice = parseFloat(buttonWrapper.closest('.option-card').dataset.productPrice);
    const productName = buttonWrapper.closest('.option-card').dataset.productName;
    const productId = buttonId;

    // Carrega o estado do botão do localStorage, se existir
    const savedQuantity = loadButtonStateFromLocalStorage(productId);
    updateButtonState(productId, savedQuantity);

    // Botão "Comprar"
    button.addEventListener('click', function () {
        addToCart(productName, productId, productPrice);
        updateButtonState(productId, 1);
    });

    // Botão "+"
    plusButton.addEventListener('click', function () {
        addToCart(productName, productId, productPrice);
        updateButtonState(productId, buttonWrapper.quantity + 1);
    });

    // Botão "-"
    minusButton.addEventListener('click', function () {
        const itemToRemove = cart.find(item => item.id === productId);

        if (itemToRemove) {
            if (itemToRemove.quantity > 1) {
                itemToRemove.quantity--;
                cartCount--;
                updateCartIndicator();
                updateCartModal();
                saveCartToLocalStorage();
            } else {
                removeFromCart(productId);
            }
        }

        let newQuantity = buttonWrapper.quantity - 1;
        if (newQuantity < 0) newQuantity = 0;

        updateButtonState(productId, newQuantity);
    });
}

// Configura os botões de cada produto
setupButton('buy-full-gas');
setupButton('exchange-gas');
setupButton('buy-full-water');
setupButton('exchange-water');

// Validação do formulário de endereço
function validateForm() {
    const neighborhood = neighborhoodSelect.value;
    const street = streetInput.value;
    const houseNumber = houseNumberInput.value;
    const cep = cepInput.value;

    checkoutButton.disabled = !(cart.length > 0 && neighborhood && street && houseNumber && cep);
}

// Adiciona event listeners para validar o formulário
neighborhoodSelect.addEventListener('change', validateForm);
streetInput.addEventListener('input', validateForm);
houseNumberInput.addEventListener('input', validateForm);
cepInput.addEventListener('input', validateForm);

// Atualiza o total quando o bairro é selecionado
neighborhoodSelect.addEventListener('change', () => {
    updateCartModal();
    validateForm();
});

// Gera a mensagem do WhatsApp e abre a API
function generateWhatsAppMessage() {
    const neighborhood = neighborhoodSelect.value;
    const street = streetInput.value;
    const houseNumber = houseNumberInput.value;
    const cep = cepInput.value;
    const observation = observationInput.value;

    let message = `Olá, gostaria de fazer um pedido:\n\n`;

    cart.forEach(item => {
        message += `${item.name} x ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    const selectedNeighborhood = neighborhoodSelect.options[neighborhoodSelect.selectedIndex];
    const deliveryFee = selectedNeighborhood ? parseFloat(selectedNeighborhood.dataset.fee) : 0;

    message += `\nTaxa de Entrega: R$ ${deliveryFee.toFixed(2)}`;
    message += `\nTotal: R$ ${cartTotalValue.textContent}\n`;
    message += `\nEndereço de Entrega:\nBairro: ${neighborhood}\nRua: ${street}\nNúmero: ${houseNumber}\nCEP: ${cep}\n`;

    if (observation) {
        message += `\nObservação: ${observation}\n`;
    }

    const whatsappNumber = '556198497382'; // Substitua pelo seu número
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
}

// Event listener para o botão de finalizar pedido
checkoutButton.addEventListener('click', () => {
    generateWhatsAppMessage();
    saveAddressToLocalStorage();
    //saveCartToLocalStorage();
    // Reseta o estado dos botões para a quantidade inicial (0)
    //for (let i = 0; i < cart.length; i++) {
      //  updateButtonState(cart[i].id, 0);
    //}

    // Limpa o carrinho
    cart = [];
    cartCount = 0;

    // Atualiza o modal e o indicador do carrinho
    updateCartIndicator();
    updateCartModal();
});

// =============================================================================
// FUNÇÕES DE LOCALSTORAGE
// =============================================================================

// Salva o carrinho no localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cartCount.toString());
}

// Carrega o carrinho do localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    const savedCartCount = localStorage.getItem('cartCount');

    if (savedCart) {
        cart = JSON.parse(savedCart);
        cartCount = parseInt(savedCartCount) || 0;
        updateCartIndicator();
    }
}

// Salva o endereço no localStorage
function saveAddressToLocalStorage() {
    const address = {
        neighborhood: neighborhoodSelect.value,
        street: streetInput.value,
        houseNumber: houseNumberInput.value,
        cep: cepInput.value,
        observation: observationInput.value
    };
    localStorage.setItem('address', JSON.stringify(address));
}

// Carrega o endereço do localStorage
function loadAddressFromLocalStorage() {
    const savedAddress = localStorage.getItem('address');
    if (savedAddress) {
        const address = JSON.parse(savedAddress);
        neighborhoodSelect.value = address.neighborhood;
        streetInput.value = address.street;
        houseNumberInput.value = address.houseNumber;
        cepInput.value = address.cep;
        observationInput.value = address.observation;
    }
}

// Salva o estado do botão no localStorage
function saveButtonStateToLocalStorage(buttonId, quantity) {
    localStorage.setItem(`buttonState_${buttonId}`, quantity.toString());
}

// Carrega o estado do botão do localStorage
function loadButtonStateFromLocalStorage(buttonId) {
    const savedQuantity = localStorage.getItem(`buttonState_${buttonId}`);
    return savedQuantity ? parseInt(savedQuantity) : 0;
}

// =============================================================================
// INICIALIZAÇÃO
// =============================================================================

// Carrega o carrinho, o endereço e os estados dos botões do localStorage ao carregar a página
window.addEventListener('load', () => {
    loadCartFromLocalStorage();
    loadAddressFromLocalStorage();
    setupButton('buy-full-gas');
    setupButton('exchange-gas');
    setupButton('buy-full-water');
    setupButton('exchange-water');
    validateForm();
});





