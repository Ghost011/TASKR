import React, { Component } from 'react';
import { Button, Modal, Form} from 'react-bootstrap';
import { FaTrashAlt, FaRegEdit, FaTintSlash } from "react-icons/fa";

import './App.css';
import './style/modal.css';


class App extends Component {
 
  constructor(props) {
   
    super(props);
    this.state = {value: '',
    value1: '',
    todos: [],
    show: false,
    showM: false,
    valueUpdate: {},
    valueTitleUpdate: '',
    valueDescUpdate: '',
    value2:'',
    value3:''
    };


    this.handleChange = this.handleChange.bind(this);
    this.handleChanges = this.handleChanges.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleUpdateChange = this.handleUpdateChange.bind(this);
    this.handleUpdateChanges = this.handleUpdateChanges.bind(this);
    this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);


    this.showData();

   
  }

  

 
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleChanges(event) {
    this.setState({value1: event.target.value});
  }


  handleUpdateChange(event) {
    if(event.target.value === "")
    {
      this.setState({value2: this.state.valueUpdate.title});
    }
    this.setState({value2: event.target.value});
  }

  handleUpdateChanges(event) {
    if(event.target.value === "")
    {
      this.setState({value3: this.state.valueUpdate.description});
    }
    this.setState({value3: event.target.value});
  }




//+++++++++++++++++++++++++ Adding data to database +++++++++++++++++++ 
  handleSubmit(event) {
  
    event.preventDefault();
    const response = fetch("http://127.0.0.1:8000/api/",
    {
        method: 'POST',
        body: JSON.stringify({
            "title":this.state.value,
            "description":this.state.value1
            // Other body stuff
        }),
        headers: {
            
            'Content-Type': 'application/json'
            // Other possible headers
        }
    }
 

) .then((data) => {
  this.setState({ isLoading: false, downlines: data.response });
  this.hideModal();
 this.showData();
})
.catch((error) => {
  console.log('error: ' + error);
  this.setState({ requestFailed: true });
});

  }
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



//+++++++++++++++++++++++++ Updating data in database +++++++++++++++++++ 
handleUpdateSubmit(event) {
  
  event.preventDefault();
  console.log(this.state.valueUpdate.id+" "+ this.state.value2+" "+this.state.value3);
  const response = fetch("http://127.0.0.1:8000/api/"+this.state.valueUpdate.id+"/",
  {
      method: 'PUT',
      body: JSON.stringify({
          "title":this.state.value2,
          "description":this.state.value3
          // Other body stuff
      }),
      headers: {
          
          'Content-Type': 'application/json'
          // Other possible headers
      }
  }


) .then((data) => {
this.setState({ isLoading: false, downlines: data.response });
this.hideUpdateModal();
this.showData();
})
.catch((error) => {
console.log('error: ' + error);
this.setState({ requestFailed: true });
});

}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



  //++++++++++++++++ Show  and hide add modal +++++++++++++++++++
  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

 //++++++++++++++++ Show  and hide update modal +++++++++++++++++++
 showUpdateModal(val){
  this.state.valueUpdate = val;

  this.setState({ showM: true });
}

hideUpdateModal = () => {
  this.setState({ showM: false });  
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// +++++++++++++++++ Recieve or show data from database ++++++++++++++++
async showData()
{
  try {
    const res = await fetch('http://127.0.0.1:8000/api/');
    const todos = await res.json();
    this.setState({
      todos
    });
  } catch (e) {
    console.log(e);
  }
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

componentDidMount() {
  
}


// ++++++++++++++++++++ Delete data from database using data id ++++++++

  delete(val)
  {
 
    const response = fetch("http://127.0.0.1:8000/api/"+val.id,
    {
        method: 'DELETE',
        body: JSON.stringify({
          "title":this.state.value,
          "description":this.state.value1
          // Other body stuff
      }),
        headers: {
            
            'Content-Type': 'application/json'
            // Other possible headers
        }
    }) .then((data) => {
      this.setState({ isLoading: false, downlines: data.response });
      this.showData();
      // window.location.reload();
    })
    .catch((error) => {
      console.log('error: ' + error);
      this.setState({ requestFailed: true });
    });
   
    
  }

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



render() {
    return (
      <div className="main">
       
       <nav className="title" >
          TASKR
          <p className="tagLine">Make notes for your daily tasks</p>
        </nav>
       
          <Button className="addBtn" variant="primary"  onClick={this.showModal}>Add</Button>
          
        <span className="content">
          {this.state.todos.map(item => (
          
            
              <div key={item.id} className="heading">
               
                <h1>{item.title}</h1>
                <span className="Desc">{item.description}</span>
                <span >
                  <FaTrashAlt className="delete" onClick={this.delete.bind(this, item)}/>
                  <FaRegEdit className="edit" onClick={this.showUpdateModal.bind(this, item)}/>
                </span>
              </div>
      
          ))}
        </span>

{/* +++++++++++++++++++++++++++++++++++++++++++ Showing add modal +++++++++++++++++++++++++++++++++++++++++++++++ */}
        <Modal show={this.state.show} onHide={this.hideModal}>
          <Modal.Header className="modalHeader">
            <Modal.Title>Add a todo</Modal.Title>
            <p className="modalClose" onClick={this.hideModal}>x</p>
          </Modal.Header>
          <Modal.Body className="modalB">
          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Control type="text" value={this.state.value} onChange={this.handleChange} placeholder="Enter title" />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Control as="textarea" rows="3" value={this.state.value1} onChange={this.handleChanges} 
              placeholder="Enter description"/>
            </Form.Group>
          <input className="submitBtn" type="submit" value="Save"></input>
          </Form>
          </Modal.Body>

          <Modal.Footer className="modalFooter">

            
          </Modal.Footer>
          
        </Modal>
  {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

{/* +++++++++++++++++++++++++++++++++++++++++++ Showing update modal +++++++++++++++++++++++++++++++++++++++++++++++ */}
        <Modal show={this.state.showM} onHide={this.hideUpdateModal}>
          <Modal.Header className="modalHeader">
            <Modal.Title>Update a todo</Modal.Title>
            <p className="modalClose" onClick={this.hideUpdateModal}>x</p>
          </Modal.Header>
          <Modal.Body className="modalB">
          <Form onSubmit={this.handleUpdateSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Control type="text" value={this.state.value2} onChange={this.handleUpdateChange} placeholder="Enter title" />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Control as="textarea" rows="3" value={this.state.value3} onChange={this.handleUpdateChanges} 
              placeholder="Enter description"/>
            </Form.Group>
          <input className="submitBtn" type="submit" value="Save"></input>
          </Form>
          </Modal.Body>

          <Modal.Footer className="modalFooter">

            
          </Modal.Footer>
          
        </Modal>
  {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}


      </div>
    );
  }
}



export default App;