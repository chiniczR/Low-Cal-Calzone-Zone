import React, { useState, useEffect } from "react";
import "./App.css";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import Menu from "./components/Menu/Menu";
import OrderPad from "./components/OrderPad/OrderPad";
import Kitchen from "./components/Kitchen/Kitchen";
import OrderStack from "./components/OrderStack/OrderStack";
import Notifications from "./components/Notifications/Notifications";
import axios from "axios";
import socketIOClient from "socket.io-client";
import config from "./config";
const socket = socketIOClient(config.websocket.server, { path: config.websocket.path });

function App() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [food, setFood] = useState([]);
  const pushFood = (order) => {
    let f = [...food];
    let existInd = f.findIndex((o) => o.food === order);
    if (existInd > -1) {
      f[existInd].quantity += 1;
    } else {
      f.push({ food: order, quantity: 1 });
    }
    setFood(f);
  };
  const dropFood = (order, all = false) => {
    let f = [...food];
    let existInd = f.findIndex((o) => o.food === order);
    if (existInd > -1) {
      if (all) {
        f = f.filter((o) => o.food !== order);
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
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [addr, setAddr] = useState("");
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState("empty");

  const handleSubmitOrder = (event) => {
    event.preventDefault();
    let newOrder = {
      client: {
        email: email,
        name: name,
        addr: addr,
        phone: phone,
      },
      food: food,
      drinks: drinks,
      orderId: null
    };

    const options = {
      url: config.checkout,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: {
        o: { ...newOrder },
      },
    };

    axios(options)
      .then((response) => {
        if (response.data.v !== "-1" && !response.data.err) {
          socket.emit("checkout", {...newOrder, orderId: response.data.v}, "add");
          setShow(false);
          setEmail("");
          setAddr("");
          setPhone("");
          setFood([]);
          setDrinks([]);
          setStage("baking");
        } else {
          console.error(JSON.stringify(response.data.err));
        }
      })
      .catch((err) => {
        var d = new Date();
        socket.emit("notification", {"action": "CHEKOUT", "type": "local", "id": notifications.length + 1, "message": "Failed to checkout order", "date": d.toISOString(), "variant": "danger" });
        console.error(JSON.stringify(err));
      });
  };

  const [calzones, setCalzones] = useState([]);
  const getCalzones = () => {
    const options = {
      url: config.calzones + "/get",
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    };
    axios(options)
      .then((response) => {
        setCalzones(response.data.calzones);
      })
      .catch((err) => {
        console.error(JSON.stringify(err));
      });
  };

  const [beverages, setBeverages] = useState([]);
  const getBeverages = () => {
    const options = {
      url: config.beverages + "/get",
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    };
    axios(options)
      .then((response) => {
        setBeverages(response.data.beverages);
      })
      .catch((err) => {
        console.error(JSON.stringify(err));
      });
  };

  const [notifications, setNotifications] = useState([]);
  const dropNotifications = (e) => {
    e.preventDefault();
    socket.emit("drop-all");
  }

  const refresh = (e) => {
    e.preventDefault();
    getCalzones();
    getBeverages();
  }

  useEffect(() => {
    socket.on("notify", notification => {
      if (notification.action === "ORDER-READY") {
        socket.emit("checkout", notification.message.order_id, "drop");
      }
      setNotifications((notifications) => [...notifications, notification]);
    });
    socket.on("remove-all", () => {
      setNotifications([]);
    });
    socket.on("put-order", (order, op) => {
      if (op === "add") {
        setOrders((orders) => [...orders, order]);
      } else {
        setOrders((orders) => orders.filter(o => o.orderId !== order));
      }
    });
    getCalzones();
    getBeverages();
  }, []);

  return (
    <div className="App align-items-center w-100">
      <header className="App-header container-flex mb-2">
        <div className="row align-items-center">
          <h1 className="text-outline">
            <b>The Low-Cal Calzone Zone</b>
          </h1>
        </div>
      </header>
      <Container fluid className="w-100">
        <Row className="justify-content-center align-items-center">
          <Col>
            <Menu
              orderFood={(order) => pushFood(order)}
              orderDrink={(order) => pushDrink(order)}
              f={food}
              d={drinks}
              calzones={calzones}
              beverages={beverages}
              refresh={(e) => {refresh(e)}}
              updateNotifications={(notification) => socket.emit("notification", {...notification, 'id': notifications.length + 1})}
            />
            <OrderPad
              className="mt-3 mb-0"
              food={food}
              calzones={calzones}
              drinks={drinks}
              beverages={beverages}
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
              variant="primary"
              className="my-0 rounded-pill"
              onClick={handleShow}
            >
              Place Order
            </Button>
          </Col>
          <Col className="bg-cool rounded p-0 m-1">
            {stage === "empty"
            ? <h5 className="mt-3">Orders I've Placed</h5>
            : <OrderStack orders={orders} />
            }
            <Container fluid className="text-center full-height">
              <Kitchen stage={stage} calzones={calzones} beverages={beverages} />
            </Container>
          </Col>
          <Col className="bg-cool rounded p-0 m-1 mr-2">
            <h5 className="mt-3">Notifications 
              <Button
                variant="link"
                className="ml-2 btn-sm no-deco"
                onClick={dropNotifications}
              >
                <small className="text-secondary">Dismiss all</small>
              </Button>
            </h5>
            <Notifications notifications={notifications} />
          </Col>
        </Row>
      </Container>
      <Modal show={show} onHide={handleClose} backdrop={true} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Client Information</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitOrder}>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter client's email"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Client name"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Client address"
                value={addr}
                onChange={(e) => setAddr(e.currentTarget.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Client telephone"
                value={phone}
                onChange={(e) => setPhone(e.currentTarget.value)}
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
