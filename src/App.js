import React, { useState } from 'react';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import Menu from './components/Menu/Menu';

function App() {
  const [food, setFood] = useState([])
  const pushFood = (order) => {
    let f = [...food];
    let existInd = f.findIndex(o => o.size === order.size && order.fillings.every(fil => o.fillings.includes(fil)));
    if (existInd > -1) {
      f[existInd].quantity += 1;
    }
    else {
      f.push({ size: order.size, fillings: order.fillings, quantity: 1 });
    }
    setFood(f);
  }

  return (
    <div className="App">
      <header className="App-header container-flex">
        <div className="row align-items-center">
          <h1 className="text-outline"><b>The Low-Cal Calzone Zone</b></h1> 
        </div>
      </header>
      <Container fluid>
          <Row>
            <Col className="border-right">
              <Menu orderFood={order => pushFood(order)} />
              <p className="mt-3">{JSON.stringify(food)}</p>
            </Col>
            <Col className="border-right">
            </Col>
            <Col>
            </Col>
          </Row>
        </Container>
    </div>
  );
}

export default App;
