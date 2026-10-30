// ========================================
// MDAL® STREETWEAR — CARRINHO DE COMPRAS
// ========================================

// Produtos adicionados à sacola
const CART = [];

// Formatação dos preços em reais
const fmt = n =>
    n.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });


// ========================================
// ADICIONAR PRODUTO
// ========================================

function addProduct(btn) {

    const card = btn.closest(".product");

    const name = card.dataset.name;
    const price = Number(card.dataset.price);

    const color = card.querySelector(".color").value;
    const size = card.querySelector(".size").value;

    const material =
        card.querySelector(".material")?.value || "";

    CART.push({
        name,
        price,
        color,
        size,
        material
    });

    renderCart();

    btn.textContent = "Adicionado ✓";

    setTimeout(() => {
        btn.textContent = "Adicionar à sacola +";
    }, 1200);
}


// ========================================
// ATUALIZAR CARRINHO
// ========================================

function renderCart() {

    document.querySelector("#cartCount").textContent =
        CART.length;

    const holder = document.querySelector("#cartItems");

    holder.innerHTML = "";

    // Mensagem quando a sacola estiver vazia
    if (!CART.length) {

        holder.innerHTML = `
            <p class="empty">
                Sua sacola está vazia.
                Escolha sua próxima peça MDAL.
            </p>
        `;
    }

    // Exibir produtos adicionados
    CART.forEach((item, i) => {

        const div = document.createElement("div");

        div.className = "cart-item";

        const desc = [
            item.color,
            item.size,
            item.material
        ].filter(Boolean).join(" · ");

        div.innerHTML = `
            <div>
                <strong>${item.name}</strong>

                <small>${desc}</small>

                <small>${fmt(item.price)}</small>
            </div>

            <button
                class="remove"
                onclick="removeItem(${i})"
            >
                Remover
            </button>
        `;

        holder.appendChild(div);
    });

    // Calcular subtotal
    const subtotal = CART.reduce(
        (s, x) => s + x.price,
        0
    );

    // Desconto de 5% sobre a peça de menor valor
    const discount = CART.length >= 2
        ? Math.min(...CART.map(x => x.price)) * 0.05
        : 0;

    // Atualizar valores exibidos
    document.querySelector("#subtotal").textContent =
        fmt(subtotal);

    document.querySelector("#discount").textContent =
        "− " + fmt(discount);

    document.querySelector("#total").textContent =
        fmt(subtotal - discount);

    // Atualizar mensagem do desconto
    document.querySelector("#discountHint").textContent =
        CART.length >= 2
            ? "Desconto de 5% aplicado à peça de menor valor."
            : "Adicione uma segunda peça e ganhe 5% de desconto nela.";
}


// ========================================
// REMOVER PRODUTO
// ========================================

function removeItem(i) {

    CART.splice(i, 1);

    renderCart();
}


// ========================================
// ABRIR CARRINHO
// ========================================

function openCart() {

    document.querySelector("#drawer")
        .classList.add("open");

    document.querySelector("#overlay")
        .classList.add("open");

    document.body.style.overflow = "hidden";
}


// ========================================
// FECHAR CARRINHO
// ========================================

function closeCart() {

    document.querySelector("#drawer")
        .classList.remove("open");

    document.querySelector("#overlay")
        .classList.remove("open");

    document.body.style.overflow = "";
}


// ========================================
// FINALIZAR PEDIDO PELO WHATSAPP
// ========================================

function checkout() {

    // Impedir pedido sem produtos
    if (!CART.length) {

        alert("Sua sacola está vazia.");

        return;
    }

    // Calcular valores
    const subtotal = CART.reduce(
        (s, x) => s + x.price,
        0
    );

    const discount = CART.length >= 2
        ? Math.min(...CART.map(x => x.price)) * 0.05
        : 0;

    // Criar mensagem do pedido
    let msg =
        "Olá, MDAL! Quero finalizar este pedido:%0A%0A";

    CART.forEach((x, i) => {

        msg +=
            (i + 1) + ". " +
            x.name + " — " +
            x.color + ", tamanho " +
            x.size +
            (x.material ? ", malha " + x.material : "") +
            " — " + fmt(x.price) +
            "%0A";
    });

    // Resumo financeiro
    msg +=
        "%0ASubtotal: " + fmt(subtotal) +
        "%0ADesconto 5%: -" + fmt(discount) +
        "%0ATotal estimado: " + fmt(subtotal - discount) +
        "%0A%0APodem confirmar disponibilidade, frete e formas de pagamento?";

    // Abrir conversa com a MDAL
    window.open(
        "https://wa.me/5534998829396?text=" + msg,
        "_blank",
        "noopener"
    );
}


// ========================================
// ANO AUTOMÁTICO NO RODAPÉ
// ========================================

document.querySelector("#year").textContent =
    new Date().getFullYear();


// ========================================
// INICIALIZAR CARRINHO
// ========================================

renderCart();