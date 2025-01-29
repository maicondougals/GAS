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
const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
const changeSection = document.getElementById("change-section");
const changeForInput = document.getElementById("change-for");
const noChangeCheckbox = document.getElementById("no-change");

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

// Exibe mensagem de erro
function showError(message) {
    alert(message);
}

// Valida o pedido antes de finalizar
function validateOrder() {
    if (cart.length === 0) {
        showError("Seu carrinho está vazio. Adicione pelo menos um produto antes de finalizar o pedido.");
        return false;
    }

    // Validação dos campos de endereço
    if (!neighborhoodSelect.value) {
        showError("Por favor, selecione um bairro para entrega.");
        cartModal.style.display = 'flex';
        setTimeout(() => cartModal.style.opacity = 1, 10);
        return false;
    }

    if (!streetInput.value.trim()) {
        showError("Por favor, preencha o campo 'Rua'.");
        cartModal.style.display = 'flex';
        setTimeout(() => cartModal.style.opacity = 1, 10);
        return false;
    }

    if (!houseNumberInput.value.trim()) {
        showError("Por favor, preencha o campo 'Número da Casa'.");
        cartModal.style.display = 'flex';
        setTimeout(() => cartModal.style.opacity = 1, 10);
        return false;
    }

    if (!cepInput.value.trim()) {
        showError("Por favor, preencha o campo 'CEP'.");
        cartModal.style.display = 'flex';
        setTimeout(() => cartModal.style.opacity = 1, 10);
        return false;
    }

    const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
    if (!selectedPaymentMethod) {
        showError("Por favor, selecione uma forma de pagamento.");
        cartModal.style.display = 'flex';
        setTimeout(() => cartModal.style.opacity = 1, 10);
        return false;
    }

    if (selectedPaymentMethod.value === "Dinheiro" && !noChangeCheckbox.checked && !changeForInput.value.trim()) {
        showError("Por favor, informe para quanto deve ser dado o troco ou marque 'Não precisa de troco'.");
        cartModal.style.display = 'flex';
        setTimeout(() => cartModal.style.opacity = 1, 10);
        return false;
    }

    return true;
}

// Atualiza o indicador de quantidade de itens no carrinho
function updateCartIndicator() {
    cartIndicator.textContent = cartCount;
    pluralS.textContent = cartCount === 1 ? '' : 'ns';
    validateForm();
}

// Atualiza o conteúdo do modal do carrinho
function updateCartModal() {
    cartItemsList.innerHTML = '';
    let total = 0;

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

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-item');
        removeButton.textContent = 'Remover';
        removeButton.addEventListener('click', () => {
            removeFromCart(item.id);
            updateButtonState(item.id, 0); // Atualiza o estado do botão para 0
        });

        li.appendChild(itemName);
        li.appendChild(itemQuantity);
        li.appendChild(itemPrice);
        li.appendChild(removeButton);
        cartItemsList.appendChild(li);

        total += item.price * item.quantity;
    });

    const selectedNeighborhood = neighborhoodSelect.options[neighborhoodSelect.selectedIndex];
    const deliveryFee = selectedNeighborhood ? parseFloat(selectedNeighborhood.dataset.fee) : 0;
    total += deliveryFee;

    cartTotalValue.textContent = total.toFixed(2);
}

// Adiciona um item ao carrinho (sempre um por vez)
function addToCart(productName, productId, productPrice) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1; // Incrementa a quantidade em 1
    } else {
        cart.push({ id: productId, name: productName, quantity: 1, price: productPrice });
    }
    cartCount++;
    updateCartIndicator();
    updateCartModal();
    saveCartToLocalStorage();
}

// Remove um item do carrinho
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cartCount -= cart[itemIndex].quantity; // Remove a quantidade total do item
        cart.splice(itemIndex, 1);
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

// Configuração dos botões de pagamento
paymentMethods.forEach((method) => {
    method.addEventListener("change", function () {
        if (this.value === "Dinheiro") {
            changeSection.style.display = "block";
            changeForInput.style.display = "block";
            if (!noChangeCheckbox.checked) {
                changeForInput.focus();
            }
        } else {
            changeSection.style.display = "none";
            changeForInput.value = "";
            noChangeCheckbox.checked = false;
        }
    });
});

// Controle do checkbox de troco
noChangeCheckbox.addEventListener("change", function () {
    if (this.checked) {
        changeForInput.style.display = "none";
        changeForInput.value = "";
    } else {
        changeForInput.style.display = "block";
        changeForInput.focus();
    }
});

cartIcon.addEventListener('click', () => {
    updateCartModal();
    cartModal.style.display = 'flex';
    setTimeout(() => cartModal.style.opacity = 1, 10);
});

closeModalButton.addEventListener('click', () => {
    cartModal.style.opacity = 0;
    setTimeout(() => cartModal.style.display = 'none', 500);
});

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

    const savedQuantity = loadButtonStateFromLocalStorage(productId);
    updateButtonState(productId, savedQuantity);

    button.addEventListener('click', function () {
        addToCart(productName, productId, productPrice);
        updateButtonState(productId, buttonWrapper.quantity + 1);
    });

    plusButton.addEventListener('click', function () {
        addToCart(productName, productId, productPrice);
        updateButtonState(productId, buttonWrapper.quantity + 1);
    });

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

neighborhoodSelect.addEventListener('change', validateForm);
streetInput.addEventListener('input', validateForm);
houseNumberInput.addEventListener('input', validateForm);
cepInput.addEventListener('input', validateForm);

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
    const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
    const changeInfo = selectedPaymentMethod && selectedPaymentMethod.value === "Dinheiro" ? 
        (noChangeCheckbox.checked ? "Não precisa de troco" : `Troco para: R$ ${changeForInput.value}`) : "";

    let message = `Olá, gostaria de fazer um pedido:\n\n`;

    cart.forEach(item => {
        message += `${item.name} x ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    const selectedNeighborhood = neighborhoodSelect.options[neighborhoodSelect.selectedIndex];
    const deliveryFee = selectedNeighborhood ? parseFloat(selectedNeighborhood.dataset.fee) : 0;

    message += `\nTaxa de Entrega: R$ ${deliveryFee.toFixed(2)}`;
    message += `\nTotal: R$ ${cartTotalValue.textContent}\n`;
    message += `\nEndereço de Entrega:\nBairro: ${neighborhood}\nRua: ${street}\nNúmero: ${houseNumber}\nCEP: ${cep}\n`;
    message += `\nForma de Pagamento: ${selectedPaymentMethod.value}`;
    
    if (changeInfo) {
        message += `\n${changeInfo}`;
    }

    if (observation) {
        message += `\nObservação: ${observation}\n`;
    }

    const whatsappNumber = '556198497382';
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
}

// Event listener para o botão de finalizar pedido
checkoutButton.addEventListener('click', () => {
    if (validateOrder()) {
        generateWhatsAppMessage();
        saveAddressToLocalStorage();
    }
});

// =============================================================================
// FUNÇÕES DE LOCALSTORAGE
// =============================================================================

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cartCount.toString());
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    const savedCartCount = localStorage.getItem('cartCount');

    if (savedCart) {
        cart.push(...JSON.parse(savedCart));
        cartCount = parseInt(savedCartCount) || 0;
        updateCartIndicator();
    }
}

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

function saveButtonStateToLocalStorage(buttonId, quantity) {
    localStorage.setItem(`buttonState_${buttonId}`, quantity.toString());
}

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