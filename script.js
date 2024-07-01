function showLogin(userType) {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById(userType + '-login').style.display = 'block';
}

function showMainMenu() {
    hideAllSections();
    document.getElementById('main-menu').style.display = 'block';
}

function showAdminMenu() {
    hideAllSections();
    document.getElementById('admin-menu').style.display = 'block';
}

function showAgentMenu() {
    hideAllSections();
    document.getElementById('agent-menu').style.display = 'block';
}

function showAddProductForm() {
    hideAllSections();
    document.getElementById('add-product-form').style.display = 'block';
}

function showTransactionForm() {
    hideAllSections();
    document.getElementById('transaction-form').style.display = 'block';
}

function hideAllSections() {
    const sections = document.querySelectorAll('.login-form, .menu, .form, .details');
    sections.forEach(section => section.style.display = 'none');
}

function login(event, userType) {
    event.preventDefault();
    const username = document.getElementById(userType + '-username').value;
    const password = document.getElementById(userType + '-password').value;

    fetch('server.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', userType, username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (userType === 'admin') showAdminMenu();
            else showAgentMenu();
        } else {
            alert('Invalid credentials');
        }
    });
}

function logout() {
    showMainMenu();
}

function addProduct(event) {
    event.preventDefault();
    const productId = document.getElementById('product-id').value;
    const productName = document.getElementById('product-name').value;
    const minSellQuantity = document.getElementById('min-sell-quantity').value;
    const price = document.getElementById('price').value;

    fetch('server.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addProduct', productId, productName, minSellQuantity, price })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Product added successfully');
            showAdminMenu();
        } else {
            alert('Failed to add product');
        }
    });
}

function fetchInventory() {
    fetch('server.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fetchInventory' })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const tbody = document.getElementById('inventory-table').getElementsByTagName('tbody')[0];
            tbody.innerHTML = '';
            data.inventory.forEach(product => {
                const row = tbody.insertRow();
                row.insertCell(0).innerText = product.product_id;
                row.insertCell(1).innerText = product.product_name;
                row.insertCell(2).innerText = product.quantity;
                row.insertCell(3).innerText = product.price;
                row.insertCell(4).innerText = product.total_cost;
            });
            hideAllSections();
            document.getElementById('inventory-details').style.display = 'block';
        } else {
            alert('Failed to fetch inventory');
        }
    });
}

function handleTransaction(event) {
    event.preventDefault();
    const productId = document.getElementById('transaction-product-id').value;
    const transactionType = document.getElementById('transaction-type').value;
    const quantity = document.getElementById('transaction-quantity').value;

    fetch('server.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'handleTransaction', productId, transactionType, quantity })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Transaction successful');
            showAgentMenu();
        } else {
            alert('Failed to complete transaction');
        }
    });
}

function fetchHistory() {
    fetch('server.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fetchHistory' })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const tbody = document.getElementById('history-table').getElementsByTagName('tbody')[0];
            tbody.innerHTML = '';
            data.history.forEach(transaction => {
                const row = tbody.insertRow();
                row.insertCell(0).innerText = transaction.product_id;
                row.insertCell(1).innerText = transaction.product_name;
                row.insertCell(2).innerText = transaction.transaction_type;
                row.insertCell(3).innerText = transaction.quantity;
                row.insertCell(4).innerText = transaction.cost;
                row.insertCell(5).innerText = transaction.total_cost;
                row.insertCell(6).innerText = transaction.timestamp;
            });
            hideAllSections();
            document.getElementById('transaction-history').style.display = 'block';
        } else {
            alert('Failed to fetch history');
        }
    });
}

function exit() {
    window.close();
}
