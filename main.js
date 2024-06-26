document.addEventListener('DOMContentLoaded', () => {
    // Simular dados de ações
    const highStocks = [
        { name: 'AAPL', price: 150.34, status: 'Comprar' },
        { name: 'AMZN', price: 3478.05, status: 'Comprar' }
    ];

    const lowStocks = [
        { name: 'GOOGL', price: 2734.87, status: 'Vender' }
    ];

    // Função para criar lista de ações
    const createStockList = (stocks, containerId) => {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Limpar conteúdo existente

        stocks.forEach(stock => {
            const li = document.createElement('li');
            li.textContent = `${stock.name}: ${stock.price} - ${stock.status}`;
            container.appendChild(li);
        });
    };

    // Preencher listas de ações
    createStockList(highStocks, 'high-stocks-list');
    createStockList(lowStocks, 'low-stocks-list');

    // Atualizar contêiner de destaques
    const highlightContainer = document.getElementById('highlight-container');
    highlightContainer.innerHTML = `
        <div class="highlight buy">AAPL: ${highStocks[0].price} - ${highStocks[0].status}</div>
        <div class="highlight buy">AMZN: ${highStocks[1].price} - ${highStocks[1].status}</div>
        <div class="highlight sell">GOOGL: ${lowStocks[0].price} - ${lowStocks[0].status}</div>
    `;
});
