import Calzone from '../../assets/images/calzone.png';
import './MenuItem.css';
import ItemImages from './ItemImages';
import { Container, Figure } from "react-bootstrap";

function MenuItem (props) {
    var Image = Calzone
    if (props.name) {
        Image = ItemImages[[props.title]]
    }
    return (
        <Figure>
            <Figure.Image
                className={`MenuItem ${props.size} mb-0 ${props.fillings ? 'food' : ''} ${props.available ? 'unavailable' : ''}`}
                src={Image}
                alt={props.name}
                title={props.title}
            />
            <Figure.Caption className="text-dark pull-up">
                {props.title}<br className="pull-up mt-0" />
                {props.fillings &&
                    <Container className="pull-up">
                        <small>
                            {props.fillings.join(', ')}
                        </small>
                    </Container>
                }
            </Figure.Caption>
        </Figure>
    );
}

export default MenuItem;