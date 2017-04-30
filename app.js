//Module Pattern.  Data Encapsulation - w/Closures and 
//Having Modules, is using Separation of Concerns -isolating code
// Immediate Invoked Function Expression, that will return an object.  

//Must use return, var budgetController holds the object returned from the anonymous function
var budgetController = (function() {
    // Function constructors
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    //this will calculate the percentage
    Expense.prototype.calcPercentage = function(totalIncome) {
        //totalIncome is the argument that we receive as an input
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    // will return the calculation function
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
            //need to go through the array with numbers stored and loop over to add values
            var sum = 0;
            data.allItems[type].forEach(function(cur) {
                sum += cur.value;
            });
            //store this value in our global var
            data.totals[type] = sum;
        }

        //want to store all data in an object.  Arrays inside the object
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
        percentage: -1
    };


    // Creating a new object from the data that gets input, based on type inc or exp
    // all items are stored in the data object above
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            //unique ID for each entry, looks in array at last number + 1 for next ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }


            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            //Push it into data structure
            data.allItems[type].push(newItem);

            //Return the new element
            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;
            //what is the index position of the id that we want to remove?  First we look inside the array 
            //and location that index position, with a loop.  Map is a method that has a callback function
            //that has access to the current array.  map actually returns a new array
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            //indexOf returns the index number of the element of the array of the id we input
            index = ids.indexOf(id);
            //index is -1 if it does not exists.  Splice is used to remove array elements
            if (index !== -1) {
                //first argument is the position of where we want to start deleting. 2nd argument is number of elements we want to delet
                data.allItems[type].splice(index, 1);

            }

        },


        calculateBudget: function() {

            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expense.  Will store this in budget
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of icome that we spent, needs to be greater than 0
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                // -1 means non-existance
                data.percentage = -1;
            }

        },


        calculatePercentages: function() {
            //calculating the percentage is expense / income.  This must calculate on each expense in the exp array

            data.allItems.exp.forEach(function(cur) {
                //each element will get the percentage calculation
                cur.calcPercentage(data.totals.inc);
            });

        },
        // now we need to return the percentage .map returns

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            // has the new array w/percentages
            return allPerc;
        },



        //need to return an object with the numbers
        getBudget: function() {

            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function() {
            console.log(data);

        }
    };
})();








//UI Module
var UIController = (function() {
    //We want to have all of the query html strings together, it's cleaner
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPercLabel: ".item__percentage",
        dateLabel: '.budget__title--month'
    };


    //format numbers correctly
    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;

        // What we need to do:  + or - before number, 2 decimal points, and add comma in thousands

        //Math.abs removes the sign of the number.
        num = Math.abs(num);
        num = num.toFixed(2);
        //makes an array with 2 elements, int and dec
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            // substring allows us to take part of a string. 0 is start of position, length -3 moves left 3
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        // Turnery Operator statement.  If the type is exp Then use - If it's not, then use +
        // code in parenthasis runs first
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };


    //looping through the node list, then call callback function
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };



    //used in app controller
    return {
        getInput: function() {
            //need to return all this data, so put it in an object
            return {
                //first we select it from html, then do something with it.
                //selector is pull down + -, either inc or exp 
                type: document.querySelector(DOMstrings.inputType).value,
                //from html input
                description: document.querySelector(DOMstrings.inputDescription).value,
                //the amount gets entered as a string, so parseFloat converts is to number w/decimals
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        deleteListItem: function(selectorID) {
            //First we reomove the child using parentNode
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);


        },


        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            // since fields is a string, we convert to an array
            fieldsArr = Array.prototype.slice.call(fields);
            // need to loop over array to clear fields
            fieldsArr.forEach(function(current, index, array) {
                current.value = '';
            });
            //sets the focus (curser) back to description input after entering.  In the array 0 is position of description 
            fieldsArr[0].focus();

        },

        displayBudget: function(obj) {
            var type;
            //Ternary instead of if statement, if obj.budget is greater than zero then type is inc else is going to be exp
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '----';
            }
        },

        //the argument percentages is an array
        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            //above returns a node list.  All elements in the DOM tree are nodes.


            //callback function
            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }

            });

        },


        addListItem: function(obj, type) {
            var html, newHtml, element;


            // create html string w/placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace placeholder with actual data.  
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // insert html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        //Get current date by using Date Object Constructor

        displayMonth: function() {
            var now, month, months, year;
            // must use new with constructor

            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'
            ];

            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function() {
            //from the CSS classes.  When you change from + to - (exp) it turns red
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });
            //changes the round button
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

        },


        //We want to share this in other controllers, so must return a method w/ an object
        getDOMstrings: function() {
            return DOMstrings;
        }
    };


})();







// GLOBAL App Controller Module, where we tell other modules what to do
// We pass the other controllers as arguments/parameters, so this controller can connect them
var controller = (function(budgetCtrl, UICtrl) {

    //Function for all eventListeners, cleans up code
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        //crtlAddItem is a callback function, the eventListener will call it for us (no() needed)
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // add event listener to global document, make button press also work w/hitting return
        document.addEventListener('keypress', function(event) {
            //only want return key.  Use key code(from object of hitting the key, or look up)
            //which is for older browsers
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        //using DOM because of the var DOM above.  The function ctrlDeleteItem will fire each time someone 
        //clicks in the DOM container
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        //change the color of the input box when changed to exp -
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function() {
        // 1) calculate budget 
        budgetCtrl.calculateBudget();

        //2) return budget
        var budget = budgetCtrl.getBudget();

        //3) display budget to UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {

        //calculate percentages
        budgetCtrl.calculatePercentages();

        //read percentages from budget controller
        var percentages = budgetCtrl.getPercentages();

        // update the UI with new percentages

        UICtrl.displayPercentages(percentages);

    };


    var ctrlAddItem = function() {
        var input, newItem;
        // get input data 
        input = UICtrl.getInput();
        console.log(input);

        //make sure there is something in the inputs
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            //2) add item to budget controller 
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3) add item to 

            UICtrl.addListItem(newItem, input.type);

            // 4) Clear fields
            UICtrl.clearFields();

            //Calculate and update budget
            updateBudget();

            // calculate and update percentages

            updatePercentages();

        }

    };
    //the target being clicked is the delete X, but we want to delete everything up the DOM, all the divs above,
    //(parentNode) so we can get rid of everthing.  Called DOM Traversing, we are hard coding the DOM structure
    //passing event so we know where it was first fired (clicked).  parentNode moves you up in the html
    //we use id because we want the id of the div 
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        //itemID is boolean, true until not true
        if (itemID) {
            // need to split out, separate the type from the number.  Use the slip method.
            //returns an array of items inbetween the - dash.  Break up string into parts for array, inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            //need ID to convert from string to number
            ID = parseInt(splitID[1]);

            //1. delete item from data structure

            budgetCtrl.deleteItem(type, ID);

            //2. delete item from UI

            UICtrl.deleteListItem(itemID);

            //. update and show the new budget
            updateBudget();

            // calculate and update percentages

            updatePercentages();
        }
    };



    // We want a place to put all the code needed at beg of app start
    return {
        init: function() {
            console.log("started");
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                //resets values to 0
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });

            setupEventListeners();
        }
    };


})(budgetController, UIController);

//must call init outside of module to start things
controller.init();





