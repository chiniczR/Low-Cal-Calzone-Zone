import Delivery from "../../assets/images/delivery.png"
import { Popover, Container, Row, OverlayTrigger } from "react-bootstrap";
import "./DeliveryStack.css";

function OrderStack ({deliveries}) {
    const popover = (delivery) => {
        return (
            <Popover id="popover-basic">
            <Popover.Title as="h3">Delivery for {delivery.email}</Popover.Title>
            <Popover.Content>
                Address: {delivery.addr}
            </Popover.Content>
            </Popover>
        )
    };

    let deliveriesToStack = deliveries.map((delivery, i) => {
        return (
            <span key={i} className="m-1">
                <OverlayTrigger trigger="click" placement="right" overlay={popover(delivery)}>
                    <img src={Delivery} alt="Delivery packet" className="btn-img" height="70" />
                </OverlayTrigger>
            </span>
        );
    });

    return (
        <Container fluid className="my-2 mx-1">
            <h5>To be delivered: {deliveries.length > 0 ? '' : 'none'}</h5>
            <Row className="justify-content-left">
                {deliveriesToStack}
            </Row>
        </Container>
    );
};

export default OrderStack;