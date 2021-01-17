import OrderCheck from "../../assets/images/order-check.jpg"
import { Popover, Container, Row, OverlayTrigger } from "react-bootstrap";
import "./OrderStack.css";

function OrderStack ({orders}) {
    const popover = (order, i) => {
        return (
            <Popover id="popover-basic" animation={false}>
                <Popover.Title as="h3">Order ID: {order.orderId}</Popover.Title>
                <Popover.Content>
                    <ul>
                        <li>
                            {order.food.length}x Calzones
                        </li>
                        <li>
                            {order.drinks.length}x Drinks
                        </li>
                    </ul>
                </Popover.Content>
            </Popover>
        )
    };

    let color = (i) => i === 0 ? 'primary' : 'dark';

    return (
        <Container fluid className="my-2 mx-1">
            <Row className="justify-content-left">
                {orders.map((order, i) => {
                    return (
                        <span key={i} className="m-1">
                            <OverlayTrigger trigger="click" placement="right" overlay={popover(order, i)} transition={null}>
                                <img src={OrderCheck} alt="Order check" className={`btn-img border border-${color(i)} rounded`} height="90" />
                            </OverlayTrigger>
                        </span>
                    );
                })}
            </Row>
        </Container>
    );
};

export default OrderStack;