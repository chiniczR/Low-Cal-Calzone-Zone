import Baker from "../../assets/images/Baker-amico.png";
import { Row } from "react-bootstrap";

function Kitchen ({stage}) {
    let pic = Baker;
    let height = 450;
    return (
        <Row className="align-items-center justify-content-center h-100">
            <img src={pic} className={stage === 'empty' ? 'mt-5' : 'mt-3'} alt={stage} height={height} />
            <h5>{stage === 'empty' ? 'No orders placed' : 'Orders above are being processed'}</h5>
        </Row>
    )
};

export default Kitchen;

