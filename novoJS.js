document.addEventListener("DOMContentLoaded", function () {
    const checkoutButton = document.getElementById("checkout-button");
    const cartItems = document.getElementById("cart-items");
    const neighborhoodSelect = document.getElementById("neighborhood");
    const streetInput = document.getElementById("street");
    const houseNumberInput = document.getElementById("house-number");
    const cepInput = document.getElementById("cep");
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const changeSection = document.getElementById("change-section");
    const changeForInput = document.getElementById("change-for");
    const noChangeCheckbox = document.getElementById("no-change");

    function showError(message) {
        alert(message); // Pode ser substituído por um modal mais estilizado se necessário
    }

    function validateOrder() {
        if (cartItems.children.length === 0) {
            showError("Seu carrinho está vazio. Adicione pelo menos um produto antes de finalizar o pedido.");
            return false;
        }

        if (!neighborhoodSelect.value) {
            showError("Por favor, selecione um bairro para entrega.");
            return false;
        }

        if (!streetInput.value.trim()) {
            showError("Por favor, preencha o campo 'Rua'.");
            return false;
        }

        if (!houseNumberInput.value.trim()) {
            showError("Por favor, preencha o campo 'Número da Casa'.");
            return false;
        }

        if (!cepInput.value.trim()) {
            showError("Por favor, preencha o campo 'CEP'.");
            return false;
        }

        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
        if (!selectedPaymentMethod) {
            showError("Por favor, selecione uma forma de pagamento.");
            return false;
        }

        if (selectedPaymentMethod.value === "Dinheiro" && !noChangeCheckbox.checked && !changeForInput.value.trim()) {
            showError("Por favor, informe para quanto deve ser dado o troco ou marque 'Não precisa de troco'.");
            return false;
        }

        return true;
    }

    checkoutButton.addEventListener("click", function () {
        if (validateOrder()) {
            alert("Pedido finalizado com sucesso!"); // Aqui seria a lógica para enviar para a API do WhatsApp
        }
    });

    // Exibir campo de troco se pagamento for em dinheiro
    paymentMethods.forEach((method) => {
        method.addEventListener("change", function () {
            if (this.value === "Dinheiro") {
                changeSection.style.display = "block";
            } else {
                changeSection.style.display = "none";
                changeForInput.value = "";
                noChangeCheckbox.checked = false;
            }
        });
    });

    // Controlar visibilidade do campo de troco baseado no checkbox
    noChangeCheckbox.addEventListener("change", function () {
        if (this.checked) {
            changeForInput.style.display = "none";
            changeForInput.value = "";
        } else {
            changeForInput.style.display = "block";
        }
    });
});
