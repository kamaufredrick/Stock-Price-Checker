'use strict';
const https = require('https');

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get((req, res) => {
      const stock = req.query.stock;
      const like = req.query.like === 'true';
      const ip = req.ip;

      if (Array.isArray(stock)) {
        // If two stocks are provided, compare them
        getStockData(stock[0], like, ip, (err1, stock1Data) => {
          getStockData(stock[1], like, ip, (err2, stock2Data) => {
            if (err1 || err2) {
              return res.status(500).json({ error: 'Failed to fetch stock data' });
            }
            const relLikes = stock1Data.likes - stock2Data.likes;
            res.json({
              stockData: [
                { stock: stock1Data.stock, price: stock1Data.price, rel_likes: relLikes },
                { stock: stock2Data.stock, price: stock2Data.price, rel_likes: -relLikes }
              ]
            });
          });
        });
      } else {
        // Single stock request
        getStockData(stock, like, ip, (err, stockData) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to fetch stock data' });
          }
          res.json({ stockData });
        });
      }
    });

  function getStockData(stock, like, ip, callback) {
    const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`;

    https.get(url, (resp) => {
      let data = '';

      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received.
      resp.on('end', () => {
        const stockInfo = JSON.parse(data);
        const stockPrice = stockInfo.latestPrice;

        let likes = 0; // In reality, fetch likes from a database

        if (like) {
          // Add like logic here based on IP
          likes += 1;
        }

        callback(null, { stock: stock.toUpperCase(), price: stockPrice, likes });
      });

    }).on('error', (err) => {
      callback(err, null);
    });
  }
};