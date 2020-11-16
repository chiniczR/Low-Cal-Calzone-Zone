import OrderCheck from "../../assets/images/order-check.jpg"
import { Popover, Container, Row, OverlayTrigger } from "react-bootstrap";
import "./OrderStack.css";

function OrderStack ({orders}) {
    const popover = (order, i) => {
        return (
            <Popover id="popover-basic">
            <Popover.Title as="h3">Order No. {i + 1}</Popover.Title>
            <Popover.Content>
                Calzones:
                <ul>
                    {order.food.map((food, j) => {
                        return (
                            <li key={'food' + j}>{food.quantity}x {food.size} {food.fillings.length > 0 ? 'with ' + food.fillings.join(', ') : 'plain'}</li>
                        );
                    })}
                </ul>
                Drinks:
                <ul>
                    {order.drinks.map((drink, j) => {
                        return (
                            <li key={'drink' + j}>{drink.quantity}x {drink.drink}</li>
                        );
                    })}
                </ul>
            </Popover.Content>
            </Popover>
        )
    };

    let color = (i) => i === 0 ? 'primary' : 'dark';

    let ordersToStack = orders.map((order, i) => {
        return (
            <span key={i} className="m-1">
                <OverlayTrigger trigger="click" placement="right" overlay={popover(order, i)}>
                    <img src={OrderCheck} alt="Order check" className={`btn-img border border-${color(i)} rounded`} height="90" />
                </OverlayTrigger>
            </span>
        );
    });

    return (
        <Container fluid className="my-2 mx-1">
            <Row className="justify-content-left">
                {ordersToStack}
            </Row>
        </Container>
    );
};

export default OrderStack;