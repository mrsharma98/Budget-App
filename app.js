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
  };

  // Constructor for INCOME
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },

    total: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      // this will give us the last element and +1 will be the ID for new item
      if (data.allItems[type].length > 0) {
        console.log("Hey");

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
    expensesContainer: ".expenses__list"
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
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;
      // 1. Create HTML string with placeholder text

      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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
  };

  var ctrlAddItem = function() {
    var input, newItem;

    // 1. Get the filled input data
    input = UICtrl.getInput();
    console.log(input);

    // 2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. add the item to the UI
    UICtrl.addListItem(newItem, input.type);

    // 4. Calculate the budget
    // 5. Display the budget on the UI
  };

  return {
    // ctrlAddItem and event listeners are private and we have to
    // make it public, so for that we are making a function called init
    init: function() {
      console.log("Application has started.");

      setupEventListeners();
    }
  };
})(budgetController, UIController);

// as everything is inside the module, nothing is gonna happen
// so this is the only line of code which will do everything
controller.init();
