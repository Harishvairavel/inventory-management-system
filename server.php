<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "inventory_system";


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$request = json_decode(file_get_contents('php://input'), true);

switch ($request['action']) {
    case 'login':
        validateLogin($request['userType'], $request['username'], $request['password']);
        break;
    case 'addProduct':
        addProduct($request['productId'], $request['productName'], $request['minSellQuantity'], $request['price']);
        break;
    case 'fetchInventory':
        fetchInventory();
        break;
    case 'handleTransaction':
        handleTransaction($request['productId'], $request['transactionType'], $request['quantity']);
        break;
    case 'fetchHistory':
        fetchHistory();
        break;
}

function validateLogin($userType, $username, $password)
{
    global $conn;
    $table = $userType === 'admin' ? 'admin' : 'agent';
    $sql = "SELECT * FROM $table WHERE username='$username' AND password='$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
}

function addProduct($productId, $productName, $minSellQuantity, $price)
{
    global $conn;
    $sql = "INSERT INTO products (product_id, product_name, min_sell_quantity, price) VALUES ('$productId', '$productName', $minSellQuantity, $price)";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
}

function fetchInventory()
{
    global $conn;
    $sql = "SELECT * FROM inventory";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $inventory = [];
        while ($row = $result->fetch_assoc()) {
            $inventory[] = $row;
        }
        echo json_encode(['success' => true, 'inventory' => $inventory]);
    } else {
        echo json_encode(['success' => false]);
    }
}

function handleTransaction($productId, $transactionType, $quantity)
{
    global $conn;
    $sql = "SELECT * FROM products WHERE product_id='$productId'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $product = $result->fetch_assoc();
        if ($transactionType === 'sell' && $quantity < $product['min_sell_quantity']) {
            echo json_encode(['success' => false, 'error' => 'Minimum sell quantity not met']);
            return;
        }

        $cost = $product['price'] * $quantity;
        $sql = "INSERT INTO transactions (agent_id, product_id, transaction_type, quantity, cost) VALUES (1, '$productId', '$transactionType', $quantity, $cost)";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $conn->error]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Product not found']);
    }
}

function fetchHistory()
{
    global $conn;
    $sql = "SELECT * FROM transactions ORDER BY timestamp DESC";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $history = [];
        while ($row = $result->fetch_assoc()) {
            $history[] = $row;
        }
        echo json_encode(['success' => true, 'history' => $history]);
    } else {
        echo json_encode(['success' => false]);
    }
}

$conn->close();
?>