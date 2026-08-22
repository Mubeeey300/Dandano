/* =========================================================
   LIGHT / DARK MODE
========================================================= */

const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector("i");


/* Load saved theme */

const savedTheme = localStorage.getItem("theme");


if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeIcon.className = "bi bi-sun-fill";

}


/* Toggle theme */

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");


    const isDark =
        document.body.classList.contains("dark-mode");


    if (isDark) {

        themeIcon.className =
            "bi bi-sun-fill";

        localStorage.setItem(
            "theme",
            "dark"
        );

    } else {

        themeIcon.className =
            "bi bi-moon-fill";

        localStorage.setItem(
            "theme",
            "light"
        );

    }

});


/* =========================================================
   WHATSAPP NUMBERS
========================================================= */

/*
   Add the WhatsApp numbers of everyone
   who should receive customer orders.

   IMPORTANT:
   Use the international format without +
   or spaces.

   Example:
   Nigeria: 2347035850506
*/

const WHATSAPP_NUMBERS = [

    // "2347035850506",

    "2348032934663",

    "234XXXXXXXXXX",

    "234XXXXXXXXXX"

];


/* =========================================================
   ELEMENTS
========================================================= */

const addButtons =
    document.querySelectorAll(".add-product");

const orderDrawer =
    document.getElementById("orderDrawer");

const orderOverlay =
    document.getElementById("orderOverlay");

const openOrder =
    document.getElementById("openOrder");

const closeOrder =
    document.getElementById("closeOrder");

const orderItems =
    document.getElementById("orderItems");

const orderCount =
    document.getElementById("orderCount");

const orderTotal =
    document.getElementById("orderTotal");

const whatsappOrder =
    document.getElementById("whatsappOrder");

const menuToggle =
    document.getElementById("menuToggle");

const mainNav =
    document.getElementById("mainNav");


/* =========================================================
   ORDER DATA
========================================================= */

let cart = [];


/* =========================================================
   FORMAT MONEY
========================================================= */

function formatMoney(amount) {

    return "₦" + amount.toLocaleString("en-NG");

}


/* =========================================================
   ADD PRODUCT
========================================================= */

addButtons.forEach(button => {

    button.addEventListener("click", () => {

        const name =
            button.dataset.name;

        const price =
            Number(button.dataset.price);


        const existingProduct =
            cart.find(
                item => item.name === name
            );


        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({

                name: name,

                price: price,

                quantity: 1

            });

        }


        updateOrder();


        /* Automatically open order drawer */

        openOrderDrawer();

    });

});


/* =========================================================
   UPDATE ORDER
========================================================= */

function updateOrder() {

    renderOrderItems();

    updateOrderCount();

    updateTotal();

}


/* =========================================================
   RENDER ORDER ITEMS
========================================================= */

function renderOrderItems() {

    if (cart.length === 0) {

        orderItems.innerHTML = `

            <div class="empty-order">

                <i class="bi bi-basket2"></i>

                <h4>
                    Your order is empty
                </h4>

                <p>
                    Choose some fresh produce from our
                    products and they'll appear here.
                </p>

            </div>

        `;

        return;

    }


    orderItems.innerHTML = "";


    cart.forEach((item, index) => {

        const productCard =
            document.querySelector(
                `.product-card[data-name="${CSS.escape(item.name)}"]`
            );


        const image =
            productCard
                ? productCard.querySelector("img").src
                : "";


        const itemTotal =
            item.price * item.quantity;


        const itemElement =
            document.createElement("div");


        itemElement.className =
            "selected-item";


        itemElement.innerHTML = `

            <div class="selected-image">

                <img
                    src="${image}"
                    alt="${item.name}"
                >

            </div>


            <div class="selected-info">

                <h4>
                    ${item.name}
                </h4>

                <strong>
                    ${formatMoney(item.price)}
                </strong>


                <div class="quantity-box">

                    <button
                        type="button"
                        data-action="decrease"
                        data-index="${index}"
                    >

                        <i class="bi bi-dash"></i>

                    </button>


                    <span>
                        ${item.quantity}
                    </span>


                    <button
                        type="button"
                        data-action="increase"
                        data-index="${index}"
                    >

                        <i class="bi bi-plus"></i>

                    </button>

                </div>

            </div>


            <div class="selected-right">

                <strong>
                    ${formatMoney(itemTotal)}
                </strong>


                <button
                    class="remove-item"
                    type="button"
                    data-action="remove"
                    data-index="${index}"
                    aria-label="Remove ${item.name}"
                >

                    <i class="bi bi-trash3"></i>

                </button>

            </div>

        `;


        orderItems.appendChild(itemElement);

    });

}


/* =========================================================
   ORDER ACTIONS
========================================================= */

orderItems.addEventListener("click", event => {

    const button =
        event.target.closest("button");


    if (!button) {

        return;

    }


    const action =
        button.dataset.action;


    const index =
        Number(button.dataset.index);


    if (action === "increase") {

        cart[index].quantity++;

    }


    if (action === "decrease") {

        cart[index].quantity--;


        if (cart[index].quantity <= 0) {

            cart.splice(index, 1);

        }

    }


    if (action === "remove") {

        cart.splice(index, 1);

    }


    updateOrder();

});


/* =========================================================
   UPDATE COUNT
========================================================= */

function updateOrderCount() {

    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    orderCount.textContent =
        totalQuantity;


    if (totalQuantity > 0) {

        orderCount.style.display =
            "flex";

    } else {

        orderCount.style.display =
            "none";

    }

}


/* =========================================================
   UPDATE TOTAL
========================================================= */

function updateTotal() {

    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );


    orderTotal.textContent =
        formatMoney(total);


    whatsappOrder.disabled =
        cart.length === 0;

}


/* =========================================================
   OPEN ORDER
========================================================= */

function openOrderDrawer() {

    orderDrawer.classList.add("active");

    orderOverlay.classList.add("active");

    document.body.classList.add("order-open");

}


/* =========================================================
   CLOSE ORDER
========================================================= */

function closeOrderDrawer() {

    orderDrawer.classList.remove("active");

    orderOverlay.classList.remove("active");

    document.body.classList.remove("order-open");

}


openOrder.addEventListener(
    "click",
    openOrderDrawer
);


closeOrder.addEventListener(
    "click",
    closeOrderDrawer
);


orderOverlay.addEventListener(
    "click",
    closeOrderDrawer
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeOrderDrawer();

    }

});


/* =========================================================
   WHATSAPP ORDER
========================================================= */

whatsappOrder.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            return;

        }


        /* ================================================
           CREATE ORDER MESSAGE
        ================================================ */

        let message =
            "Assalamu Alaikum! \n\n";


        message +=
            "Ina son zan sayi wadannan kayan:\n\n";


        cart.forEach(item => {

            const itemTotal =
                item.price * item.quantity;


            message +=
                `• ${item.name} × ${item.quantity} = ${formatMoney(itemTotal)}\n`;

        });


        /* ================================================
           CALCULATE TOTAL
        ================================================ */

        const total =
            cart.reduce(
                (sum, item) =>
                    sum + item.price * item.quantity,
                0
            );


        message +=
            `\n*Total: ${formatMoney(total)}*\n\n`;


        message +=
            "A duba mun idan akwai su sannan zuwa yaushe za'a kawo mun su?. Nagode!";


        /* ================================================
           ENCODE MESSAGE
        ================================================ */

        const encodedMessage =
            encodeURIComponent(message);


        /* ================================================
           SEND TO ALL WHATSAPP NUMBERS
        ================================================ */

        WHATSAPP_NUMBERS.forEach(
            (number, index) => {

                const whatsappURL =
                    `https://wa.me/${number}?text=${encodedMessage}`;


                /*
                   Small delay between each tab
                   to reduce browser popup blocking.
                */

                setTimeout(() => {

                    window.open(
                        whatsappURL,
                        "_blank"
                    );

                }, index * 700);

            }
        );

    }
);


/* =========================================================
   MOBILE MENU
========================================================= */

menuToggle.addEventListener(
    "click",
    () => {

        mainNav.classList.toggle("open");


        const icon =
            menuToggle.querySelector("i");


        if (mainNav.classList.contains("open")) {

            icon.className =
                "bi bi-x-lg";

        } else {

            icon.className =
                "bi bi-list";

        }

    }
);


/* =========================================================
   CLOSE MOBILE MENU AFTER CLICKING LINK
========================================================= */

document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

        mainNav.classList.remove("open");


        const icon =
            menuToggle.querySelector("i");


        icon.className =
            "bi bi-list";

    });

});


/* =========================================================
   NAVIGATION ACTIVE STATE
========================================================= */

const sections =
    document.querySelectorAll("section[id]");


window.addEventListener("scroll", () => {

    let currentSection = "";


    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;


        const sectionHeight =
            section.offsetHeight;


        if (
            window.scrollY >= sectionTop &&
            window.scrollY <
            sectionTop + sectionHeight
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    document.querySelectorAll(".nav-link")
        .forEach(link => {

            link.classList.remove("active");


            if (
                link.getAttribute("href") ===
                `#${currentSection}`
            ) {

                link.classList.add("active");

            }

        });

});
