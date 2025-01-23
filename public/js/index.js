// Carrinho
let cartCount = 0;
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

let cart = [];

function updateCartIndicator() {
    cartIndicator.textContent = cartCount;
    pluralS.textContent = cartCount === 1 ? '' : 'ns';
    validateForm();
}

function updateCartModal() {
    cartItemsList.innerHTML = ''; // Limpa a lista atual

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
            // Remove todas as unidades do item
            const itemToRemove = cart.find(cartItem => cartItem.id === item.id);
            if (itemToRemove) {
                cartCount -= itemToRemove.quantity;
                cart = cart.filter(cartItem => cartItem.id !== item.id);
            }

            // Atualiza o botão correspondente na página principal
            const buttonWrapper = document.getElementById(item.id);
            const button = buttonWrapper.querySelector('.option-button');
            const counter = buttonWrapper.querySelector('.counter');
            const quantitySpan = counter.querySelector('.quantity');

            // Reseta a variável quantity do botão
            buttonWrapper.quantity = 0;

            // Reseta o contador do item removido
            quantitySpan.textContent = '0';
            counter.style.display = 'none';
            button.style.display = 'block';

            // Atualiza o modal e o indicador do carrinho
            updateCartIndicator();
            updateCartModal();
            saveCartToLocalStorage(); // Salva o carrinho atualizado
            saveButtonStateToLocalStorage(item.id, 0); // Salva o estado do botão zerado
        });

        li.appendChild(itemName);
        li.appendChild(itemQuantity);
        li.appendChild(itemPrice);
        li.appendChild(removeButton);
        cartItemsList.appendChild(li);

        total += item.price * item.quantity;
    });

    // Adiciona a taxa de entrega ao total
    const selectedNeighborhood = neighborhoodSelect.options[neighborhoodSelect.selectedIndex];
    const deliveryFee = selectedNeighborhood ? parseFloat(selectedNeighborhood.dataset.fee) : 0;
    total += deliveryFee;

    cartTotalValue.textContent = total.toFixed(2);
}

function addToCart(productName, productId, productPrice) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: productId, name: productName, quantity: 1, price: productPrice });
    }
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    updateCartIndicator();
    saveCartToLocalStorage()
}

// Abre o modal do carrinho
cartIcon.addEventListener('click', () => {
    loadCartFromLocalStorage()
    updateCartModal();
    cartModal.style.display = 'flex';
    setTimeout(() => {
        cartModal.style.opacity = 1; // Adiciona a transição de opacidade
    }, 10);
});

// Fecha o modal do carrinho
closeModalButton.addEventListener('click', () => {
    cartModal.style.opacity = 0;// Adiciona a transição de opacidade
    setTimeout(() => {
        cartModal.style.display = 'none';
    }, 500); // Tempo da transição
});

// Fecha o modal se clicar fora do conteúdo
window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.opacity = 0;
        setTimeout(() => {
            cartModal.style.display = 'none';
        }, 500); // Tempo da transição
    }
});

// Função genérica para os botões
function setupButton(buttonId) {
    const buttonWrapper = document.getElementById(buttonId);
    buttonWrapper.quantity = 0; // Inicializa a variável quantity do botão
    const button = buttonWrapper.querySelector('.option-button');
    const counter = buttonWrapper.querySelector('.counter');
    const quantitySpan = counter.querySelector('.quantity');
    const plusButton = counter.querySelector('.plus');
    const minusButton = counter.querySelector('.minus');
    const productPrice = parseFloat(buttonWrapper.closest('.option-card').dataset.productPrice);

    // Obtém o nome do produto do atributo data-product-name
    const productName = buttonWrapper.closest('.option-card').dataset.productName;
    // Gera um ID único para cada tipo de produto
    const productId = buttonId;

    // Carrega o estado do botão do localStorage, se existir
    const savedQuantity = loadButtonStateFromLocalStorage(productId);
    if (savedQuantity > 0) {
        buttonWrapper.quantity = savedQuantity;
        quantitySpan.textContent = savedQuantity;
        counter.style.display = 'flex';
        button.style.display = 'none';
    }

    button.addEventListener('click', function () {
        buttonWrapper.quantity++;
        quantitySpan.textContent = buttonWrapper.quantity;
        counter.style.display = 'flex';
        button.style.display = 'none';

        addToCart(productName, productId, productPrice);
        saveButtonStateToLocalStorage(productId, buttonWrapper.quantity);
    });

    plusButton.addEventListener('click', function () {
        buttonWrapper.quantity++;
        quantitySpan.textContent = buttonWrapper.quantity;
        addToCart(productName, productId, productPrice);
        saveButtonStateToLocalStorage(productId, buttonWrapper.quantity);
    });

    minusButton.addEventListener('click', function () {
        buttonWrapper.quantity--;
        if (buttonWrapper.quantity < 0) buttonWrapper.quantity = 0;

        // Atualiza o carrinho e o localStorage se a quantidade for maior que zero
        const itemToRemove = cart.find(item => item.id === productId);
        if (itemToRemove) {
            if (itemToRemove.quantity > 1) {
                itemToRemove.quantity--;
            } else {
                // Remove o item do carrinho
                cartCount -= itemToRemove.quantity;
                cart = cart.filter(item => item.id !== productId);
            }
            updateCartIndicator();
            updateCartModal();
            saveCartToLocalStorage();
        }

        quantitySpan.textContent = buttonWrapper.quantity;
        if (buttonWrapper.quantity === 0) {
            counter.style.display = 'none';
            button.style.display = 'block';
        }

        saveButtonStateToLocalStorage(productId, buttonWrapper.quantity);
    });
}

// Configura os botões
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

    if (cart.length > 0 && neighborhood && street && houseNumber && cep) {
        checkoutButton.disabled = false;
    } else {
        checkoutButton.disabled = true;
    }
}

// Adiciona event listeners para validar o formulário
neighborhoodSelect.addEventListener('change', validateForm);
streetInput.addEventListener('input', validateForm);
houseNumberInput.addEventListener('input', validateForm);
cepInput.addEventListener('input', validateForm);

// Atualiza o total quando o bairro é selecionado
neighborhoodSelect.addEventListener('change', () => {
    updateCartModal();
    validateForm(); // Valida o formulário quando o bairro é selecionado
});

// Função para gerar a mensagem do WhatsApp e abrir a API
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

    message += `\nEndereço de Entrega:\n`;
    message += `Bairro: ${neighborhood}\n`;
    message += `Rua: ${street}\n`;
    message += `Número: ${houseNumber}\n`;
    message += `CEP: ${cep}\n`;

    if (observation) {
        message += `\nObservação: ${observation}\n`;
    }

    // Substitua o número abaixo pelo seu número de WhatsApp
    const whatsappNumber = '556198497382'; // Exemplo de número
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
}

// Event listener para o botão de finalizar pedido
checkoutButton.addEventListener('click', () => {
    generateWhatsAppMessage();
    saveAddressToLocalStorage()
});

// Função para salvar o carrinho no localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cartCount.toString());
}

// Função para carregar o carrinho do localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    const savedCartCount = localStorage.getItem('cartCount');

    if (savedCart) {
        cart = JSON.parse(savedCart);
        cartCount = parseInt(savedCartCount) || 0; // Garante que cartCount seja um número
        updateCartIndicator();
        updateCartModal();
    }
}

// Função para salvar o endereço no localStorage
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

// Função para carregar o endereço do localStorage
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

// Função para salvar o estado do botão no localStorage
function saveButtonStateToLocalStorage(buttonId, quantity) {
    localStorage.setItem(`buttonState_${buttonId}`, quantity.toString());
}

// Função para carregar o estado do botão do localStorage
function loadButtonStateFromLocalStorage(buttonId) {
    const savedQuantity = localStorage.getItem(`buttonState_${buttonId}`);
    return savedQuantity ? parseInt(savedQuantity) : 0;
}

// Carrega o carrinho e o endereço do localStorage ao carregar a página
window.addEventListener('load', () => {
    loadCartFromLocalStorage();
    loadAddressFromLocalStorage();
    validateForm(); // Valida o formulário ao carregar a página
});