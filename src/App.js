import React, { useState } from 'react';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import Menu from './components/Menu/Menu';
import OrderPad from './components/OrderPad/OrderPad';

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
  const dropFood = (order, all=false) => {
    console.log('Got to dropFood:  order =', JSON.stringify(order), 'all =', all)
    let f = [...food];
    let existInd = f.findIndex(o => o.size === order.size && order.fillings.every(fil => o.fillings.includes(fil)));
    if (existInd > -1) {
      if (all) {
        f = f.filter(o => o.size !== order.size && !order.fillings.every(fil => o.fillings.includes(fil)))
      }
      else {
        f[existInd].quantity -= 1;
      }
    }
    setFood(f);
  }

  const [drinks, setDrinks] = useState([])
  const pushDrink = (order) => {
    let d = [...drinks];
    let existInd = d.findIndex(o => o.drink === order);
    if (existInd > -1) {
      d[existInd].quantity += 1;
    }
    else {
      d.push({ drink: order, quantity: 1 });
    }
    setDrinks(d);
  }
  const dropDrinks = (order, all=false) => {
    let d = [...drinks];
    let existInd = d.findIndex(o => o.drink === order);
    if (existInd > -1) {
      if (all) {
        d = d.filter(o => o.drink !== order)
      }
      else {
        d[existInd].quantity -= 1;
      }
    }
    setDrinks(d);
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
              <Menu orderFood={order => pushFood(order)} orderDrink={order => pushDrink(order)} />
              <OrderPad className="mt-3" food={food} drinks={drinks} removeFood={dropFood} removeDrink={dropDrinks} />
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
