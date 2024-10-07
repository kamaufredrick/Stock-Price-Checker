document.getElementById('singleStockForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const stock = e.target[0].value;
  const like = e.target[1].checked;
  
  fetch(`/api/stock-prices?stock=${stock}&like=${like}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('jsonResult').textContent = JSON.stringify(data, null, 2);
    });
});

document.getElementById('compareStockForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const stock1 = e.target[0].value;
  const stock2 = e.target[1].value;
  const like = e.target[2].checked;
  
  fetch(`/api/stock-prices?stock=${stock1}&stock=${stock2}&like=${like}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('jsonResult').textContent = JSON.stringify(data, null, 2);
    });
});
