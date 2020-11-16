import React, { useState } from "react";
import "./App.css";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import Menu from "./components/Menu/Menu";
import OrderPad from "./components/OrderPad/OrderPad";
import Kitchen from "./components/Kitchen/Kitchen";
import OrderStack from "./components/OrderStack/OrderStack";
import ReadyDeliveryGuy from "./assets/images/Messenger-pana.png";
import OnRouteDeliveryGuy from "./assets/images/Delivery-amico.png";
import DeliveryStack from "./components/DeliveryStack/DeliveryStack";

function App() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [food, setFood] = useState([]);
  const pushFood = (order) => {
    let f = [...food];
    let existInd = f.findIndex(
      (o) =>
        o.size === order.size &&
        order.fillings.every((fil) => o.fillings.includes(fil))
    );
    if (existInd > -1) {
      f[existInd].quantity += 1;
    } else {
      f.push({ size: order.size, fillings: order.fillings, quantity: 1 });
    }
    setFood(f);
  };
  const dropFood = (order, all = false) => {
    console.log(
      "Got to dropFood:  order =",
      JSON.stringify(order),
      "all =",
      all
    );
    let f = [...food];
    let existInd = f.findIndex(
      (o) =>
        o.size === order.size &&
        order.fillings.every((fil) => o.fillings.includes(fil))
    );
    if (existInd > -1) {
      if (all) {
        f = f.filter(
          (o) =>
            o.size !== order.size &&
            !order.fillings.every((fil) => o.fillings.includes(fil))
        );
      } else {
        f[existInd].quantity -= 1;
      }
    }
    setFood(f);
  };

  const [drinks, setDrinks] = useState([]);
  const pushDrink = (order) => {
    let d = [...drinks];
    let existInd = d.findIndex((o) => o.drink === order);
    if (existInd > -1) {
      d[existInd].quantity += 1;
    } else {
      d.push({ drink: order, quantity: 1 });
    }
    setDrinks(d);
  };
  const dropDrinks = (order, all = false) => {
    let d = [...drinks];
    let existInd = d.findIndex((o) => o.drink === order);
    if (existInd > -1) {
      if (all) {
        d = d.filter((o) => o.drink !== order);
      } else {
        d[existInd].quantity -= 1;
      }
    }
    setDrinks(d);
  };
  
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState('');
  const [addr, setAddr] = useState('');
  const [stage, setStage] = useState('empty');
  const [delivering, setDelivering] = useState(false);

  const handleSubmitOrder = (event) => {
    event.preventDefault()
    let newOrder = {
      email: email,
      addr: addr,
      food: food,
      drinks: drinks
    };
    /*
     TODO: async save to database
    */
    let o = [...orders];
    o.push(newOrder);
    setOrders(o);
    setShow(false);
    setEmail('');
    setAddr('');
    setFood([]);
    setDrinks([]);

    setStage('baking'); // <-- Should only happen when we get notfied from kitchen topic
    setDelivering(true); // <-- Should only happen when notified from delivery topic
  }

  return (
    <div className="App">
      <header className="App-header container-flex">
        <div className="row align-items-center">
          <h1 className="text-outline">
            <b>The Low-Cal Calzone Zone</b>
          </h1>
        </div>
      </header>
      <Container fluid>
        <Row className="justify-content-center align-items-center">
          <Col>
            <Menu
              orderFood={(order) => pushFood(order)}
              orderDrink={(order) => pushDrink(order)}
            />
            <OrderPad
              className="mt-3 mb-0"
              food={food}
              drinks={drinks}
              removeFood={dropFood}
              removeDrink={dropDrinks}
            />
            <Button
              disabled={food.length < 1 && drinks.length < 1}
              title={
                food.length < 1 && drinks.length < 1
                  ? "Please select some food or drink first"
                  : "Click here to place your order as defined above"
              }
              variant="outline-default"
              className="my-0 bg-off-white border rounded-pill"
              onClick={handleShow}
            >
              Place Order
            </Button>
          </Col>
          <Col className="bg-cool rounded p-0 m-1">
            <OrderStack orders={orders} />
            <Kitchen stage={stage} />
          </Col>
          <Col className="bg-cool rounded p-0 m-1 mr-2">
            <DeliveryStack deliveries={orders} />
            <img src={delivering ? OnRouteDeliveryGuy : ReadyDeliveryGuy} alt="Ready delivery guy" height="400" />
            <h5>{delivering ? 'Delivery on route' : 'Ready to deliver'}</h5>
          </Col>
        </Row>
      </Container>
      <Modal show={show} onHide={handleClose} backdrop={true}>
        <Modal.Header closeButton>
          <Modal.Title>Delivery Information</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitOrder}>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Your email address</Form.Label>
              <Form.Control 
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              <Form.Text className="text-muted">
                If you are a frequent customer, your order will be delivered more quickly!
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicAddress">
              <Form.Label>Enter the address you want your ordered delivered to</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your address"
                value={addr}
                onChange={(e) => setAddr(e.currentTarget.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Order
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default App;
