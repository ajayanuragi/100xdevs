/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  transactions is an array where each
  Transaction - an object like 
        {
		id: 1,
		timestamp: 1656076800000,
		price: 10,
		category: 'Food',
		itemName: 'Pizza',
	}
  Output - [{ category: 'Food', totalSpent: 10 }] // Can have multiple categories, only one example is mentioned here
*/

function calculateTotalSpentByCategory(transactions) {
  let answer = {};


  for (let i = 0; i < transactions.length; i++) { 
      const transaction = transactions[i];
      const category = transaction.category;
      const price = transaction.price;

      
      if (!answer[category]) { 
          answer[category] = 0; 
      answer[category] += price; 
  }

  
  const result = [];
  for (const category in answer) {
      result.push({
          category: category,
          totalSpent: answer[category], 
      });
  }

  return result;

}

module.exports = calculateTotalSpentByCategory;
