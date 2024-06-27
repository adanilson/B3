const apiKey = 'GFY7TCO682NLRQW0';
const symbols = ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA'];

let previousPrices = {};

function getStockPrice(symbol, callback) {
    $.getJSON(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`, function(data) {
        const timeSeries = data['Time Series (1min)'];
        const latestTime = Object.keys(timeSeries)[0];
        const latestPrice = parseFloat(timeSeries[latestTime]['1. open']);
        callback(symbol, latestPrice);
    }).fail(function() {
        callback(symbol, null);
    });
}

function updateStockData() {
    const highStocks = [];
    const lowStocks = [];

    $('#stocks-table-body').empty();

    symbols.forEach(symbol => {
        getStockPrice(symbol, function(symbol, price) {
            if (price) {
                let status = 'Estável';
                if (previousPrices[symbol] !== undefined) {
                    if (price > previousPrices[symbol]) {
                        status = 'Comprar';
                    } else if (price < previousPrices[symbol]) {
                        status = 'Vender';
                    }
                }
                previousPrices[symbol] = price;
                const row = `<tr><td>${symbol}</td><td>${price.toFixed(2)}</td><td class="highlight ${status === 'Comprar' ? 'buy' : status === 'Vender' ? 'sell' : 'stable'}">${status}</td></tr>`;
                $('#stocks-table-body').append(row);

                if (status === 'Comprar') {
                    highStocks.push(`${symbol} - ${price.toFixed(2)}`);
                } else if (status === 'Vender') {
                    lowStocks.push(`${symbol} - ${price.toFixed(2)}`);
                }
            }
        });
    });

    setTimeout(() => {
        $('#highlight-container').text('Atualizado com sucesso');

        const highStocksList = $('#high-stocks-list');
        const lowStocksList = $('#low-stocks-list');
        highStocksList.empty();
        lowStocksList.empty();

        highStocks.forEach(stock => highStocksList.append(`<li>${stock}</li>`));
        lowStocks.forEach(stock => lowStocksList.append(`<li>${stock}</li>`));
    }, 5000);
}

$(document).ready(function() {
    setInterval(updateStockData, 60000);
    updateStockData();
});
