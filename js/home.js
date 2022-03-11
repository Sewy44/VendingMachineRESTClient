$(document).ready(function () {
    initialMoneyIn();
    loadItems();
    selectItem();
    makePurchase();
});

function initialMoneyIn() {
    let total = 0;
    let quarters = 0;
    let dimes = 0;
    let nickels = 0;
    let pennies = 0;
    calculateMoneyIn(total, quarters, dimes, nickels, pennies);
    changeReturn(quarters, nickels, dimes, pennies);
}

function selectItem(id) {
    let item = $('#itemDisplayField');
    let messages = $('#messages');
    item.val(id);
    messages.val(null);
}

function clearItemTable() {
    $('#itemRows').empty();
}

function calculateMoneyIn(total, quarters, dimes, nickels, pennies) {
    let output = total.toFixed(2);
    $('#moneyInserted').val(output);

    $('#addDollarButton').click(function (event) {
        if (firstClickAfterPurchase() == true) {
            quarters = 0;
            dimes = 0;
            nickels = 0;
            pennies = 0;
            changeReturn(quarters, dimes, nickels, pennies);
            $('#messages').val('');
            $('#itemDisplayField').val('');
            $('#changeDue').val('');
            initialMoneyIn();
        }
        else {
            total += 1;
            quarters += 4;
            displayMoneyIn(total);
            changeReturn(quarters, dimes, nickels, pennies);
        }
    })
    $('#addQuarterButton').click(function (event) {
        if (firstClickAfterPurchase() == true) {
            quarters = 0;
            dimes = 0;
            nickels = 0;
            pennies = 0;
            changeReturn(quarters, dimes, nickels, pennies);
            $('#messages').val('');
            $('#itemDisplayField').val('');
            $('#changeDue').val('');
            initialMoneyIn();
        }
        else {
            total += 0.25;
            quarters += 1;
            displayMoneyIn(total);
            changeReturn(quarters, dimes, nickels, pennies);
        }
    })
    $('#addDimeButton').click(function (event) {
        if (firstClickAfterPurchase() == true) {
            quarters = 0;
            dimes = 0;
            nickels = 0;
            pennies = 0;
            changeReturn(quarters, dimes, nickels, pennies);
            $('#messages').val('');
            $('#itemDisplayField').val('');
            $('#changeDue').val('');
            initialMoneyIn();
        }
        else {
            total += 0.1;
            dimes += 1;
            displayMoneyIn(total);
            changeReturn(quarters, dimes, nickels, pennies);
        }
    })
    $('#addNickelButton').click(function (event) {
        if (firstClickAfterPurchase() == true) {
            $('#messages').val('');
            quarters = 0;
            dimes = 0;
            nickels = 0;
            pennies = 0;
            changeReturn(quarters, dimes, nickels, pennies);
            $('#itemDisplayField').val('');
            $('#changeDue').val('');
            initialMoneyIn();
        }
        else {
            total += .05;
            nickels += 1;
            displayMoneyIn(total);
            changeReturn(quarters, dimes, nickels, pennies);
        }
    })
}

function displayMoneyIn(total) {
    let output = total.toFixed(2);
    $('#moneyInserted').val(output);
}

function loadItems() {
    clearItemTable();
    let itemRows = $('#itemRows');

    $.ajax({
        type: 'GET',
        url: 'http://vending.us-east-1.elasticbeanstalk.com/items',
        success: function (itemArray) {
            $.each(itemArray, function (index, item) {
                let id = item.id;
                let name = item.name;
                let price = item.price;
                let quantity = item.quantity;

                let buttonContent = '<button class="content" onclick="selectItem(' + id + ')">'
                buttonContent += '<div class="itemContainer">';
                buttonContent += '<p class="itemIndex">' + index + '</p>';
                buttonContent += '<p class="itemName">' + name + '</p>';
                buttonContent += '<p class="itemPrice">$' + price.toFixed(2) + '</p>';
                buttonContent += '<p class="itemQuantity">Quantity Left: ' + quantity + '</p>';
                buttonContent += '</div></button>';

                itemRows.append(buttonContent);
            })
        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
        }
    });
}

function makePurchase() {
    $('#makePurchaseButton').click(function (event) {
        if (firstClickAfterPurchase() == true) {
            initialMoneyIn();
            $('#messages').val('');
            $('#itemDisplayField').val('');
            $('#changeDue').val('');
        }
        else {
            let id = $('#itemDisplayField').val();
            let amount = $('#moneyInserted').val();
            $('#changeDue').val('');

            $.ajax({
                type: 'POST',
                url: 'http://vending.us-east-1.elasticbeanstalk.com/money/' + amount + '/item/' + id,
                success: function (data) {

                    let quarters = data.quarters;
                    let dimes = data.dimes;
                    let nickels = data.nickels;
                    let pennies = data.pennies;

                    displayChange(quarters, dimes, nickels, pennies);
                    loadItems();
                    initialMoneyIn();
                    $('#messages').val('Thank You!!');
                },
                error: function (xhr) {
                    let error = JSON.parse(xhr.responseText)
                    $('#messages').val(error.message);
                }
            })
        }
    })
}

function changeReturn(quarters, dimes, nickels, pennies) {
    $('#changeReturn').click(function (event) {
        if (firstClickAfterPurchase() == true) {
            initialMoneyIn();
            $('#messages').val('');
            $('#itemDisplayField').val('');
            $('#changeDue').val('');
        }
        else {
            displayChange(quarters, dimes, nickels, pennies);
            $('#messages').val('');
            initialMoneyIn();
        }
    })
}

function firstClickAfterPurchase() {
    if ($('#messages').val() == 'Thank You!!') {
        return true;
    }
}

function firstClickAfterChangeReturn() {
    if ($('#changeDue').val() != null) {
        return true;
    }
}

function displayChange(quarters, dimes, nickels, pennies) {
    let output = '';
    if (quarters > 0) {
        if (quarters == 1) {
            output += quarters + ' Quarter ';
        }
        else {
            output += quarters + ' Quarters ';
        }
    }
    if (dimes > 0) {
        if (dimes == 1) {
            output += dimes + ' Dime '
        }
        else {
            output += dimes + ' Dimes ';
        }
    }
    if (nickels > 0) {
        if (nickels == 1) {
            output += nickels + ' Nickel '
        }
        else {
            output += nickels + ' Nickels ';
        }
    }
    if (pennies > 0) {
        if (pennies == 1) {
            output += pennies + ' Penny '
        }
        else {
            output += pennies + ' Pennies';
        }
    }
    $('#changeDue').val(output);
}

