const apiKey = 'GFY7TCO682NLRQW0';
const symbols = ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA']; // Adicione os símbolos das ações que você deseja monitorar
const previousPrices = {}; // Objeto para armazenar os preços anteriores

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

    $('#stocks-table-body').empty(); // Limpa a tabela antes de atualizar

    let requestsCompleted = 0;

    symbols.forEach(symbol => {
        getStockPrice(symbol, function(symbol, price) {
            if (price) {
                let status = 'Estável';
                if (previousPrices[symbol] !== undefined) {
                    if (price > previousPrices[symbol] * 1.01) { // Exemplo: Vender se o preço subiu mais de 1%
                        status = 'Vender';
                        lowStocks.push(`${symbol} - ${price.toFixed(2)}`);
                    } else if (price < previousPrices[symbol] * 0.99) { // Exemplo: Comprar se o preço caiu mais de 1%
                        status = 'Comprar';
                        highStocks.push(`${symbol} - ${price.toFixed(2)}`);
                    }
                }
                previousPrices[symbol] = price;

                const row = `<tr><td>${symbol}</td><td>${price.toFixed(2)}</td><td class="highlight ${status === 'Comprar' ? 'buy' : status === 'Vender' ? 'sell' : ''}">${status}</td></tr>`;
                $('#stocks-table-body').append(row);
            }

            requestsCompleted++;
            if (requestsCompleted === symbols.length) {
                $('#highlight-container').text('Atualizado com sucesso');

                const highStocksList = $('#high-stocks-list');
                const lowStocksList = $('#low-stocks-list');
                highStocksList.empty();
                lowStocksList.empty();

                highStocks.forEach(stock => highStocksList.append(`<li>${stock}</li>`));
                lowStocks.forEach(stock => lowStocksList.append(`<li>${stock}</li>`));
            }
        });
    });
}

$(document).ready(function() {
    const widgetSettings = {
        "showChart": false,
        "locale": 'br',
        "width": "100%",
        "height": "400",
        "customer": "bovespa",
        "largeChartUrl": window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1),
        "tabs": [
            {"title":"Maiores altas", "symbols": [{"s":"BMFBOVESPA:IBOV", "d":"IBOV"}]},
            {"title":"Maiores baixas", "symbols": [{"s":"BMFBOVESPA:IBOV", "d":"IBOV"}]},
            {"title":"Mais negociadas", "symbols": [{"s":"BMFBOVESPA:IBOV", "d":"IBOV"}]}
        ]
    };

    const script = document.createElement('script');
    script.setAttribute('src', 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js');
    script.setAttribute('async', "");
    script.innerHTML = JSON.stringify(widgetSettings);
    document.getElementById("chart-container").appendChild(script);

    setInterval(updateStockData, 60000); // Atualiza a cada 60 segundos
    updateStockData(); // Atualiza ao carregar a página
});
