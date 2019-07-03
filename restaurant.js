let food = [
  {
    name: "pepsi",
    type: "drinks",
    price: 45
  },
  {
    name: "sandwich",
    type: "snacks",
    price: 120
  },
  {
    name: "pasta",
    type: "main",
    price: 299
  }
];

//tables object
let obj =
  [{
    name: "Table 1",
    details:
      [

      ],
    total: 0
  },
  {
    name: "Table 2",
    details:
      [

      ],
    total: 0
  },
  {
    name: "Table 3",
    details:
      [

      ],
    total: 0
  }
  ];

//menu display
food.forEach(itm => {
  var menuDiv = document.getElementById("menu");
  var i = "<li class = 'itemBackground' draggable='true' ondragstart='dragStarted(event)' ondragover='draggingOver(event)'>" + itm.name + "<br>" + itm.price + "<br>" + itm.type + "</li>" + "<hr>";
  menuDiv.innerHTML += i;
});

//table display
var tOne = document.getElementById("tableOne");
var tableOneName = "Table 1"
tOne.innerHTML = tableOneName;
var tTwo = document.getElementById("tableTwo");
var tableTwoName = "Table 2"
tTwo.innerHTML = tableTwoName;
var tThree = document.getElementById("tableThree");
var tableThreeName = "Table 3"
tThree.innerHTML = tableThreeName;

//table local storage
var tbls = localStorage.getItem("tables");
var arr = JSON.parse(tbls);
if (arr.length == 0) {
  obj.forEach(o => {
    arr.push(o);
  })
  localStorage.setItem("tables", JSON.stringify(arr));
}

//search menu
function search() {
  let input = document.getElementById('searchbar').value
  input = input.toLowerCase();
  let x = document.getElementsByClassName('itemBackground');

  for (i = 0; i < x.length; i++) {
    if (!x[i].innerHTML.toLowerCase().includes(input)) {
      x[i].style.display = "none";
    }
    else {
      x[i].style.display = "list-item";
    }
  }
}
//search menu
function searchTables() {
  let input = document.getElementById('searchTable').value;
  input = input.toLowerCase();
  let x = document.getElementById('table');
  let y = x.getElementsByTagName("div");
  console.log(y);
  for (i = 0; i < y.length; i++) {
    
    if (!y[i].innerText.toLowerCase().includes(input)) {
      y[i].style.display = "none";
    }
    else {
      y[i].style.display = "block";
    }
  }
}



let source;

function dragStarted(e) {
  source = e.target;
  e.dataTransfer.setData("text/plain", e.target.innerHTML);
  e.dataTransfer.effectAllowed = "move";
}

function draggingOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function dropped(e) {
  e.preventDefault();
  e.stopPropagation();
  var source = e.dataTransfer.getData("text/plain");
  var index = 0;
  var itemName = "";
  while (source[index] != "<") {
    itemName += source[index];
    index++;
  }
  index = source.indexOf(">");
  index += 1;
  var price = "";
  while (source[index] != "<") {
    price += source[index];
    index++;
  }
  var targetTable = e.target.innerHTML;
  //on dropping the item on table it will save the required changes
  saveChanges(targetTable, price, itemName);
}

//updates the price or add the new item
function saveChanges(targetTable, price, itemName) {  //drag nd drop
  var tbl = localStorage.getItem("tables");
  var arr = JSON.parse(tbl);
  var flag = 0;
  arr.forEach((element, index) => {
    if (element.name == targetTable) {
      (arr[index].details).forEach((asd, i) => {
        if (arr[index].details[i].item == itemName) {
          flag = 1;
          price = Number(price);
          var oldPrice = arr[index].details[i].price;
          oldPrice = Number(oldPrice);
          var newPrice = oldPrice + price;
          arr[index].details[i].price = newPrice;
          arr[index].details[i].servings += 1;
        }

      });
    }
  });
  localStorage.setItem("tables", JSON.stringify(arr));
  if (flag != 1) {
    addNewItem(targetTable, price, itemName);//add new item 
  }
  totalPrice(targetTable);
  window.location.reload();
}

//adds new item
function addNewItem(tablName, price, iName) {
  var tables = localStorage.getItem("tables");
  var arr = JSON.parse(tables);
  arr.forEach((element, i) => {
    if (element.name == tablName) {
      len = arr[i].details.length;
      //sno len+1, 
      let objs = {
        Sno: len + 1,
        item: iName,
        price: price,
        servings: 1
      }
      arr[i].details.push(objs);
    }
  }
  );
  localStorage.setItem("tables", JSON.stringify(arr));
  window.location.reload();
}

//table popup
function displayTableDetails(tName) {
  var tableName = document.getElementById("popup");
  tableName.innerHTML = tName;
  var tbl = localStorage.getItem("tables");
  var arr = JSON.parse(tbl);
  var tRow = document.getElementById("tRow");
  arr.forEach((element, index) => {
    if (element.name == tName) {
      (arr[index].details).forEach((asd, i) => {
        let tr = document.createElement('tr');
        for (key in arr[index].details[i]) {
          if (key != "servings" && key != "price") {
            let td = document.createElement('td');
            td.innerHTML = arr[index].details[i][key];
            tr.appendChild(td);
          }
        }
        var p = `<td>${arr[index].details[i].price}</td>`
        tr.innerHTML += p;
        var text = `<td> <input type = 'number' min = '1' onfocus = 'inputFocus(this)' onfocusout = 'update(this, ${arr[index].details[i].price}, "${arr[index].name}", "${arr[index].details[i].item}")' value = "${arr[index].details[i].servings}"></td>`
        tr.innerHTML += text;

        tddel = document.createElement('td');
        tddel.innerHTML = "DEL";
        tddel.setAttribute('onclick', 'delRow()');

        tr.appendChild(tddel);
        tRow.appendChild(tr);
      });
      var bill = document.getElementById("totalBill");
    bill.innerHTML = "Total Amount = " +arr[index].total;

    close = document.getElementById("closeSession");
    var x = `<button class='btn cancel' onclick='closeSession("${tName}")'>CloseSession</button>`;
        close.innerHTML = x;
    }
  });
}

var currentServings = 0;
function inputFocus(input) {
  currentServings = input.value;
}
//updates price and servings
function update(input, price, tableName, itemName) {
  var originalPrice = (Number(price)) / currentServings;
  currentServings = input.value;
  var newPrice = originalPrice * currentServings;
  input.parentNode.parentNode.childNodes[2].innerHTML = newPrice

  var tbl = localStorage.getItem("tables");
  var arr = JSON.parse(tbl);
  arr.forEach((element, index) => {
    if (element.name == tableName) {
      (arr[index].details).forEach((asd, i) => {
        if (arr[index].details[i].item == itemName) {
          arr[index].details[i].price = newPrice;
          arr[index].details[i].servings = currentServings;
        }

      });
    }
  });
  localStorage.setItem("tables", JSON.stringify(arr));
  totalPrice(tableName);
  window.location.reload();
}

function totalPrice(tableName)
{
  var tbl = localStorage.getItem("tables");
  var arr = JSON.parse(tbl);
  var totalPrice = 0;
  arr.forEach((element, index) => {
    if (element.name == tableName) {
      (arr[index].details).forEach((asd, i) => {
        totalPrice += Number(arr[index].details[i].price);
      });
      arr[index].total = totalPrice;
    }
  });
  localStorage.setItem("tables", JSON.stringify(arr));
  window.location.reload();

}

//deletes item
function delRow() {
  var tName = event.target.parentNode.parentNode.parentNode.childNodes[3].innerText;
  var itemName = event.target.parentNode.childNodes[1].innerText;
  event.target.parentNode.parentNode.removeChild(event.target.parentNode);
  var tbl = localStorage.getItem("tables");
  var arr = JSON.parse(tbl);
  var sno = 0;
  arr.forEach((element, index) => {
    if (element.name == tName) {
      (arr[index].details).forEach((asd, i) => {
        if (sno != 0 && arr[index].details[i].Sno > sno) {
          arr[index].details[i].Sno += -1;
        }
        if (arr[index].details[i].item == itemName) {
          sno = arr[index].details[i].Sno;
          arr[index].details.splice(i, 1);
        }
      });
    }
  });
  localStorage.setItem("tables", JSON.stringify(arr));
  totalPrice(tName);
  window.location.reload();
}



//opens table popup
function openTable(tName) {
  $('#tRow tr').slice(1).remove();
  displayTableDetails(tName);
  document.getElementById("myForm").style.display = "block";
}

function closeTable() {
  document.getElementById("myForm").style.display = "none";
}

function closeSession(tableName)
{
  var tbl = localStorage.getItem("tables");
  var arr = JSON.parse(tbl);
  arr.forEach((element, index) => {
    if (element.name == tableName) {
      (arr[index].details).forEach((asd, i) => {
          arr[index].details.splice(i, 1);
      });
    }
    arr[index].total = 0;
  });
  localStorage.setItem("tables", JSON.stringify(arr));
  window.location.reload();
}
