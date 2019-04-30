import React, { Component } from 'react';


class App extends Component{



  state={
    userID:2,
    username:"Bilbo",
    currentList:"",
    listNames:[],
    currentListItems:[],
    newItemText:"",
    newListText:""
  }


  
  render(){
    return (
      <div className="App">
      <header id="header">
        <h1>ToDo lists</h1> 
              
    </header>


          

    <nav id="user">
        <h2 id="username">{this.state.username}</h2>
        <h3>Lists:</h3>
        {this.state.listNames.map((listName,index) => <button key={listName} onClick={this.changeList}>{listName}</button>)} 
        <nav id="logout" >
                <a href="#" >logout</a>
            </nav>    
    </nav>

    <form id="addList">
        New list
        <br/>
        <input  type="text" placeholder="List Name" onChange={this.updateNewListInput}/>
        <button type="button" onClick={this.addList}>add</button>
    </form>

    
    <div>

            <h2 id="currentListName">{this.state.currentList}</h2>


        <form id="addItem">
            Add Item <br/>
            <input id="newItemInput" type="text" placeholder="new item" onChange={this.updateNewItemInput}/>
            <button type="button"onClick={this.addItem}>add</button>
        </form>

      

      <table id="currentList" cellspacing="10">
            <tr>
                <th id="item">item</th>
                <th >completed</th>
            </tr>
            {this.state.currentListItems.map((item,index)=>
            <tr>
              <td>{item.desc}</td>
              <td>{item.completed.toString()}</td>
              <td><button id={"complete"+item.itemID} onClick={this.complete}>complete</button></td>
              <td><button id={"delete"+item.itemID} onClick={this.delete}>delete</button></td>
            </tr>)}

        </table>

        <br/><br/>
        <button id="deleteCurrentList" onClick={this.deleteCurrentList}>Delete List!</button>





        <script src="main.js"></script>
    </div>
    </div>
  );


  
  
  
}

delete=(e)=>{
  let itemID= e.target.id.substring(6);
  console.log(itemID);
  let requestURL='http://localhost:8181/api/v1/item/'+itemID;
  let request = new XMLHttpRequest();
  request.open('DELETE', requestURL);
  request.responseType = 'json';
  request.setRequestHeader("Accept","application/json");
  request.setRequestHeader("Content-Type","application/json");
  request.onload=()=>{
    this.loadCurrentListItems();
  }
  request.send()
}



deleteCurrentList=()=>{
  let items=this.state.currentListItems
  for (let item of items){
    let itemID= item.itemID;
    console.log(itemID);
    let requestURL='http://localhost:8181/api/v1/item/'+itemID;
    let request = new XMLHttpRequest();
    request.open('DELETE', requestURL);
    request.responseType = 'json';
    request.setRequestHeader("Accept","application/json");
    request.setRequestHeader("Content-Type","application/json");
    request.onload=()=>{
      this.loadListNames();
      this.loadCurrentListItems();
    }
    request.send()
  }
}

updateNewListInput=(e)=>{
  this.setState({
    newListText:e.target.value
  })
  //console.log(e.target.value);
}

addList=()=>{
  let newListName=this.state.newListText;
  this.state.listNames.push(newListName);
  this.setState({
    currentList:newListName
  })
  this.loadItems();
}


updateNewItemInput=(e)=>{
  this.setState({
    newItemText:e.target.value
  })
}


addItem=()=>{
  let newItem={
    "userID":this.state.userID,
    "desc":this.state.newItemText,
    "listName":this.state.currentList
  }
  let requestURL='http://localhost:8181/api/v1/items';
  let request = new XMLHttpRequest();
  request.open('POST', requestURL);
  request.responseType = 'json';
  request.setRequestHeader("Accept","application/json");
  request.setRequestHeader("Content-Type","application/json");
  request.onload=()=>{
    this.loadCurrentListItems();
    console.log(newItem);
  }
  //console.log(JSON.stringify(newItem))
  request.send(JSON.stringify(newItem));

}


complete=(e)=>{
  let itemID=e.target.id.substring(8);
  let requestURL='http://localhost:8181/api/v1/complete/'+itemID;
  let request = new XMLHttpRequest();
  request.open('PUT', requestURL);
  request.responseType = 'json';
  request.setRequestHeader("Accept","application/json");
  request.setRequestHeader("Content-Type","application/json");
  request.onload=()=>{
    this.loadCurrentListItems();
  }
  request.send();
}

changeList=(e)=>{
  this.setState({
    currentList:e.target.innerHTML
  })
  this.loadItems(e.target.innerHTML);

}


loadCurrentListItems=()=>{

    let listItems="";
    let requestURL='http://localhost:8181/api/v1/listItems?listName='+this.state.currentList+'&userID='+this.state.userID;
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json'
    request.setRequestHeader("content-Type","application/json");
    request.onload=()=>{
      listItems=request.response;      
      this.setCurrentListItems(listItems);
      //console.log(listItems);
    }
    request.send();
}

loadItems=(listName)=>{

  let listItems="";
  let requestURL='http://localhost:8181/api/v1/listItems?listName='+listName+'&userID='+this.state.userID;
  let request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json'
  request.setRequestHeader("content-Type","application/json");
  request.send();
  request.onload=()=>{
    listItems=request.response;      
    this.setCurrentListItems(listItems);
    //console.log(listItems);
  }
}

setCurrentListItems=(listItems)=>{
  this.setState({
    currentListItems:listItems
  });
}

setListNames=(listNames)=>{
  this.setState({
    listNames:listNames,
    currentList:listNames[0]
  });
}


loadListNames=()=>{
  let listNames="";
  let requestURL='http://localhost:8181/api/v1/listNames?userID='+this.state.userID;
  let request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.setRequestHeader("content-Type","application/json");
  request.onload=()=>{
    listNames=request.response;
    this.setListNames(listNames);
    return listNames[0];
  }    
  request.send();
}

hello=()=>{
  console.log("hello");
}

componentDidMount = () => {
  this.loadListNames();
  this.loadCurrentListItems();
}


}

export default App;
