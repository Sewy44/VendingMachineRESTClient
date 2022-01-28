$(document).ready(function () {
    initialMoneyIn();
    loadItems();
    selectItem();
    makePurchase();
});

function initialMoneyIn() {
    var total = 0;
    var quarters = 0;
    var dimes = 0;
    var nickels = 0;
    var pennies = 0;
    calculateMoneyIn(total, quarters, dimes, nickels, pennies);
    changeReturn(quarters, nickels, dimes, pennies);
}

function selectItem(id) {
    var item = $('#itemDisplayField');
    var messages = $('#messages');
    item.val(id);
    messages.val(null);
}

function clearItemTable() {
    $('#itemRows').empty();
}

function calculateMoneyIn(total, quarters, dimes, nickels, pennies) {
    var output = total.toFixed(2);
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
    var output = total.toFixed(2);
    $('#moneyInserted').val(output);
}

function loadItems() {
    clearItemTable();
    var itemRows = $('#itemRows');

    $.ajax({
        type: 'GET',
        url: 'http://vending.us-east-1.elasticbeanstalk.com/items',
        success: function (itemArray) {
            $.each(itemArray, function (index, item) {
                var id = item.id;
                var name = item.name;
                var price = item.price;
                var quantity = item.quantity;

                var buttonContent = '<button class="content" onclick="selectItem(' + id + ')">'
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
            var id = $('#itemDisplayField').val();
            var amount = $('#moneyInserted').val();
            $('#changeDue').val('');

            $.ajax({
                type: 'POST',
                url: 'http://vending.us-east-1.elasticbeanstalk.com/money/' + amount + '/item/' + id,
                success: function (data) {

                    var quarters = data.quarters;
                    var dimes = data.dimes;
                    var nickels = data.nickels;
                    var pennies = data.pennies;

                    displayChange(quarters, dimes, nickels, pennies);
                    loadItems();
                    initialMoneyIn();
                    $('#messages').val('Thank You!!');
                },
                error: function (xhr) {
                    var error = JSON.parse(xhr.responseText)
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
    var output = '';
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

