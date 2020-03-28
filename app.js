// to control budget
// this will be an immediately invoked function that will return object
//

// BUDGET CONTROLLER
var budgetController = (function() {
  // Constructor for EXPENSES
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  // to calculate the percentage
  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  // to return the percentage
  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  // Constructor for INCOME
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  calculateTotal = function(type) {
    var sum = 0;

    // Calculating the sum of type we have passed
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });

    // assigning the sum for the type we have calculated.
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },

    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1 // as we do not have any income and expenses
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      // this will give us the last element and +1 will be the ID for new item
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // creating new item based on inc or exp type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      // pushig it into your data structure
      data.allItems[type].push(newItem);

      // Returning the new element
      return newItem;
    },

    // deleteing an item from data structure
    deleteItem: function(type, id) {
      var ids, index;

      ids = data.allItems[type].map(function(current) {
        return current.id;
      });
      // map returns a brand new array
      // so we will amke an array of all ids
      // i.i ids = [1,5,6,9,10]... so on

      // now finding the index of id which we want
      index = ids.indexOf(id);
      //returns -1 if not found

      if (index !== -1) {
        // splice if use to create an element form an array
        data.allItems[type].splice(index, 1);
        // 1st-> index from where we want to delete
        // 2nd-> how many elements we want to delete
      }
    },

    // budget calculation method
    calculateBudget: function() {
      // 1. calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");

      // 2. Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // 3. Calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    // calculating the percentages of each exp items
    calculatePercentages: function() {
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });

      return allPerc;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: function() {
      console.log(data);
    }
  };
})();

// UI CONTROLLER
var UIController = (function() {
  // making a object so that we donot have tpo write class names
  // agagin and again and if we wih to change the class name
  // then we only have to change it here.

  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage"
  };

  return {
    //
    getInput: function() {
      return {
        //
        // reading add_type value (+ or -)
        type: document.querySelector(DOMstrings.inputType).value,

        // description of expense or income
        description: document.querySelector(DOMstrings.inputDescription).value,

        // value of expense or income
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;
      // 1. Create HTML string with placeholder text

      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // 2. Replace the placeholder text with some actual data

      newHtml = html.replace("%id%", obj.id);
      //  now we need to replace newHtml with description and value individually
      // the data which we receive from the obj
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      // 3. Insert the HTML into the DOM
      // the below line or insertAdjacent inserts newHtml as the last thing
      // as we have used 'beforeend'.
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    // deleting an item from UI
    // we will take whole id name e.g: inc-1 or exp-1 as selectorID
    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
      // selection the child of parentNode that we want to remove
      // and removeChild will remove it.
    },

    // to clear the input fields once added
    clearFields: function() {
      var fields, fieldsArr;
      // quertSelectorAll returns a list
      // the solution is to convert the list to an array
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      // as slice method is a prototype of Array and
      // it returns function so we will use call
      fieldsArr = Array.prototype.slice.call(fields);

      // now we can loop over this array to get the fields
      // and setting all the values to empty string
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });

      // once we added the value after entering this will focus on the Description part
      fieldsArr[0].focus();
    },

    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent =
        obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },

    // also returning DOMstrings so that everyone can use it
    // making it public
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

// the above two module are independent for each other
// they will never interact with each other, they work independently
// they do not know about eachother

// So we need something to connect them both

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
  //
  var setupEventListeners = function() {
    // getting DOMstrings
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    // --------------------------------------------
    // addEventListener is a global event this time
    // Enter Key Press Event instead on clicking tick button
    // keypress event
    // an event will be passed whenever we click any key
    document.addEventListener("keypress", function(event) {
      // 13 is the code for Enter key
      // some browser uses which instead of keyCode so adding that too
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    // Event Delegation
    // when we have to apply same event to many thing
    // we find the parent class in which all the things we get
    // we use that class for event delegation
    // and also if we have to apply Event Handler to something which is not
    // visible in our UI (e.g. in our case X is not visible)
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function() {
    // 1. Calculate the budget

    budgetCtrl.calculateBudget();

    // 2. Return the budget
    var budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function() {
    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();

    // 2. Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();

    // 3. Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  var ctrlAddItem = function() {
    var input, newItem;

    // 1. Get the filled input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear the fields
      UICtrl.clearFields();

      // 5. Calculate and update bidget
      updateBudget();

      // 6. Calculate and update percentages
      updatePercentages();
    }
  };

  // To delete Income or Expense element
  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type;

    // target.parentNode -> gives us the parent element of target element
    // and we can write parentNode 'n' times to go to the parentNode which we want
    // .id will give us the css id of that element

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    // we might click on many places
    // so if it generates itemID then
    // as our element is specific
    if (itemID) {
      // format:- inc-1 or exp-1
      splitID = itemID.split("-");
      // eg ['inc', '-']

      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. Delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);

      // 3. Update and show the new budget.
      updateBudget();

      // 4. Calculate and update percentages
      updatePercentages();
    }
  };

  return {
    // ctrlAddItem and event listeners are private and we have to
    // make it public, so for that we are making a function called init
    init: function() {
      console.log("Application has started.");
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };
})(budgetController, UIController);

// as everything is inside the module, nothing is gonna happen
// so this is the only line of code which will do everything

controller.init();
