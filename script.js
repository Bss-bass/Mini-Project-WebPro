$(document).ready(function () {
    // set variables
    let history_cart = [];
    let cart = [];
    let reviews = [{ name: 'Siwapat Samantrakulchai', rating: 5, comment: 'Great food, Good Drink And the best website in the world!' }];
    const cartDisplay = $('#cart-items');
    const reviewDisplay = $('#review-items');
    const scrollToTopBtn = $('#scroll-to-top');
    const submitCartBtn = $('#submit-cart');
    const star = "⭐";

    // get data from localstroage
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
    if (localStorage.getItem('reviews')) {
        reviews = JSON.parse(localStorage.getItem('reviews'));
    }
    if (localStorage.getItem('history_cart')){
        history_cart = JSON.parse(localStorage.getItem('history_cart'));
    }

    // Add event listeners for menu items
    $('.menu').click(function (event) {
        event.preventDefault();
        const title = $(this).find('.card-title').text();
        const price = $(this).find('.card-text').text();
        openModal(title, price);
    });

    // Open modal with item details
    const openModal = (title, price) => {
        $('#modal-title').text(title);
        $('#modal-price').text(price);
        $('#item-modal').css('display', 'block');
    };

    // Close modal
    $('#close-modal').click(() => {
        $('#item-modal').css('display', 'none');
    });

    // Add item to cart
    $('#add-to-cart').click(() => {
        const title = $('#modal-title').text();
        const price = $('#modal-price').text();

        const existingItem = cart.find(item => item.title === title);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ title, price, quantity: 1 });
        }

        updateCartDisplay();
        $('#item-modal').css('display', 'none');
    });

    // Update cart display
    const updateCartDisplay = () => {
        if (cart.length === 0) {
            cartDisplay.html(`<li>Your cart is empty.</li>
                <button class="btn btn-success" id="history-order-btn">History Order</button>
            `);
            submitCartBtn.css('display', 'none');
        } else {
            let total = 0;
            cart.forEach(item => total += item.price * item.quantity);
            cartDisplay.html(cart
                .map((item, index) => `
                     <li class="list-group-item d-flex justify-content-between align-items-center">
                        <span class="mx-2">${item.title} - ${item.price}</span>
                        <div>
                            <button class="btn btn-secondary btn-sm" onclick="decreaseQuantity(${index})">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-secondary btn-sm" onclick="increaseQuantity(${index})">+</button>
                        </div>
                        <span class="mx-2">${item.price * item.quantity} Baht.</span>
                        <button class="btn btn-danger btn-sm" onclick="deleteFromCart(${index})">Delete</button>
                    </li>
                `).join(''));
            cartDisplay.append(`<li class="list-group-item d-flex justify-content-between align-items-center">` +
                `<span>Total</span><span>${total} Baht.</span></li>`);
            submitCartBtn.css('display', 'block');
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    updateCartDisplay();

    // Decrease quantity of item
    window.decreaseQuantity = (index) => {
        cart[index].quantity -= 1;
        if (cart[index].quantity === 0) {
            deleteFromCart(index);
        }
        updateCartDisplay();
    };

    // Increase quantity of item
    window.increaseQuantity = (index) => {
        cart[index].quantity += 1;
        updateCartDisplay();
    };

    // Delete item from cart
    window.deleteFromCart = (index) => {
        cart.splice(index, 1);
        updateCartDisplay();
    };

    // Submit cart
    submitCartBtn.click(() => {
        let total = 0;
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        alert('Your order has been submitted:\n' +
            cart.map(item => {
                total += item.price * item.quantity;
                return `${item.title} - ${item.price} x ${item.quantity}`;
            }).join('\n') +
            `\nTotal: ${total} Baht.`);

        openBillModal();

        cart.length = 0;
        updateCartDisplay();
    });

    // Open bill modal
    const openBillModal = () => {
        $('#bill-modal').css('display', 'block');
        $('.all-sections').css('display', 'none');
        let orderNo = history_cart.length + 1;
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1;
        let dd = today.getDate();
        let orderDate = `${dd} ${mm}, ${yyyy}`;
        let total = 0;
        cart.forEach(item => total += item.price * item.quantity);
        $('.orderNo').text(`#${orderNo}`);
        $('.orderDate').text(`${orderDate}`);
        $('.orderList').html(cart.map((item, index) => `
            <tr>
                <th scope="row">${index+1}</th>
                <td>
                    <div>
                        <h5 class="text-truncate font-size-14 mb-1">${item.title}</h5>
                    </div>
                </td>
                <td>$ ${item.price}</td>
                <td>${item.quantity}</td>
                <td class="text-end">$ ${item.price * item.quantity}</td>
            </tr>
        `));
        $('.orderList').append(`
            <tr>
                <th scope="row" colspan="4" class="border-0 text-end">Total</th>
                <td class="border-0 text-end">
                    <h4 class="m-0 fw-semibold">$${total}</h4>
                </td>
            </tr>`
        );
        history_cart.push({orderNo, orderDate, cart});
        localStorage.setItem('history_cart', JSON.stringify(history_cart));
    };

    // Close bill modal
    $('#send-bill').click(() => {
        $('#bill-modal').css('display', 'none');
        $('.all-sections').css('display', 'block');
        alert('Thank you for your order.');
        window.location.reload();
    })

    // Open review modal
    $('#add-review').click(() => {
        $('#review-modal').css('display', 'block');
    });

    // Close review modal
    $('#close-review').click(() => {
        $('#review-modal').css('display', 'none');
    });

    // Submit review
    $('#submit-review').click(() => {
        const name = $('#review-name').val();
        const rating = $('#review-rating').val();
        const comment = $('#review-comment').val();

        if (!name || !rating || !comment) {
            alert('Please fill in all fields!');
            return;
        }

        $('#review-modal').css('display', 'none');
        reviews.push({ name, rating, comment });
        updateReviewDisplay();
        alert('Thank you for your review!');
        
        $('#review-name').val('');
        $('#review-rating').val(1);
        $('#review-comment').val('');
    });

    // Updte review display
    const updateReviewDisplay = () => {
        if (reviews.length === 0) {
            reviewDisplay.html('<li>No reviews yet.</li>');
        } else {
            reviewDisplay.html(reviews
                .map(review => `
                    <div class="col-md-4 w-100">
                        <div class="card">
                            <div class="card-body d-flex justify-content-between">
                                <div>
                                    <h5 class="card-title
                                    ">${review.name}</h5>
                                    <p class="card-text">"${review.comment}"</p>
                                </div>
                                <div>
                                    <h5>${star.repeat(review.rating)}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join(''));
        }
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }

    updateReviewDisplay();

    // Open history order
    $('#history-order-btn').click(() => {
        $('#history-section').css('display', 'block');
        $('.all-sections').css('display', 'none');
        let orders = [];
        let subtotal = 0;
        let alltotal = 0;
        $('#list-history').html(history_cart.map((item) => `
            ${orders = []}
            ${subtotal = 0}
            ${item.cart.forEach(element => {
                orders.push(element.title + " " + element.quantity);
                subtotal += element.price * element.quantity;
            })}
            ${alltotal += subtotal}
            <tr>
                <td>#${item.orderNo}</td>
                <td>${item.orderDate}</td>
                <td>${orders.join(', ')}</td>
                <td>$${subtotal}</td>
            </tr>
        `));
        $('#list-history').append(`
            <tr>
                <td class="text-center bg-dark text-white" colspan="4">Total All : ${alltotal}</td>
            </tr>
        `)
    })

    // Close history order
    $('#back').click(() => {
        $('#history-section').css('display', 'none');
        $('.all-sections').css('display', 'block');
    })

    // Scroll-to-top
    $(window).scroll(() => {
        scrollToTopBtn.css('display', window.scrollY > 100 ? 'block' : 'none');
    });

    scrollToTopBtn.click(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
