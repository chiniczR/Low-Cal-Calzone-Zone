import React from "react";
import { Container, Alert, Col, Row } from "react-bootstrap";
import "./Notifications.css";

function Notifications ({notifications}) {
    return (
        <Container className="notfications">
            {notifications.sort(function(a, b) {
                return b.date > a.date;
            }).map((n, i) => {
                let time = n.date.split('T')[1].split(':')[0] + ":" + n.date.split('T')[1].split(':')[1]
                return (
                    <Alert variant={n.variant} className="pt-2" key={i} transition={null}>
                        <Alert.Heading className="text-md p-0 my-0 row justify-content-between">
                            <Col className="col-4">
                                <Row className="ml-1 align-items-bottom">
                                    {n.action} <small className="ml-2 text-italics">{n.type}</small>
                                </Row>
                            </Col>
                            <Col className="col-2"><small>{time}</small></Col>
                        </Alert.Heading>
                        <hr className="p-0 my-1" />
                        <p className="p-0 my-0">{
                            n.action !== "ORDER-READY" ?
                            n.message :
                            "Order: " + n.message.order_id + ", for " + n.message.client + " is ready"
                        }</p>
                    </Alert>
                )
            })}
        </Container>
    );
}

export default Notifications;