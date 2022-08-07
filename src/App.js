// import "./App.css";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function App() {
  const [item, setItem] = useState([
    { iname: "", quantity: "", amount: "", total: 0 },
  ]);

  //Create state for BillTo
  const [billTotal, setBillTotal] = useState(0);

  useEffect(() => {
    //Setting total bill amount
    setBillTotal(() => {
      //Get copy of every item with corresponding total amount
      let data = [...item];
      //Initialize temp variable
      let temp = 0;
      //Parse through each item to calculate bill total based on each item total amount
      for (let i = 0; i < data.length; i++) {
        temp = parseFloat(data[i].total) + temp;
      }
      return temp.toFixed(2);
    });
  }, [item]);

  function handleChange(index, event) {
    //Store current item in array obj
    let data = [...item];
    //Get the changed input box name and the corresponding value
    data[index][event.target.name] = event.target.value;
    //Calculate the total value accordingly
    data[index]["total"] = (
      data[index]["quantity"] * data[index]["amount"]
    ).toFixed(2);
    //Set the new value accordingly
    setItem(data);
  }

  function removeEntry(index) {
    //Store old items in variable
    let data = [...item];
    //Remove the array obj with the index value from the stored variables
    data.splice(index, 1);
    //Store it in the state
    setItem(data);
  }

  function addItem() {
    //Create a new object
    const newItem = { iname: "", quantity: "", total: 0 };
    setItem((oldValue) => {
      const newArray = [];
      //Get the old value and push to new empty array
      for (let i = 0; i < oldValue.length; i++) {
        newArray.push(oldValue[i]);
      }
      //After pushing old array, add newly created obj
      newArray.push(newItem);
      return newArray;
    });
  }

  function handleSubmit(event) {
    //Prevent the input from being erased
    event.preventDefault();
    //Initialize jspdf
    const doc = new jsPDF();
    let newArray = [];

    //Convert array obj into array to make PDF conversion
    for (let i = 0; i < item.length; i++) {
      newArray.push([
        i + 1,
        item[1].name,
        item[i].quantity,
        item[i].amount,
        item[i].total,
      ]);
    }
    doc.text("Pesar's Custom Shop", 70, 20);

    //Calculate current date to display in PDF
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();

    today = dd + "/" + mm + "/" + yyyy;

    //Display today's date
    doc.text(`Date: ${today}`, 200, 25, null, null, "right");
    doc.text(`Customer name: Pesar`, 200, 30, null, null, "right");

    //Add table handling
    autoTable(doc, {
      head: [["S.no", "Item name", "Quantity", "Amount", "Total"]],
      body: newArray,
      startY: 35,
    });

    //Add total billing to end of table
    let finalY = doc.previousAutoTable.finalY;
    doc.text(`Total amount to be paid: ${billTotal}`, 12, finalY + 10);
    //Save bill in the name of
    doc.save("Bill.pdf");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="App">
        {item.map((input, index) => (
          <div key={index}>
            <input
              name="iname"
              placeholder="item name"
              value={input.name}
              onChange={(event) => handleChange(index, event)}
            ></input>
            <input
              name="quantity"
              type="number"
              pattern="[0-9*"
              step=".001"
              min=".000"
              max="999.999"
              placeholder="quantity"
              value={input.quantity}
              onChange={(event) => handleChange(index, event)}
            ></input>
            <input
              name="amount"
              type="number"
              pattern="[0-9*"
              step=".01"
              min=".01"
              max="99999.99"
              placeholder="amount"
              value={input.amount}
              onChange={(event) => handleChange(index, event)}
            ></input>
            <input
              name="total"
              placeholder="total"
              value={input.total}
              readOnly
            ></input>
            <button key={index} onClick={() => removeEntry(index)}>
              Remove
            </button>
          </div>
        ))}

        <button type="button" onClick={addItem}>
          Add+
        </button>
        <h3>Total amount: {billTotal ? billTotal : 0}</h3>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

export default App;
