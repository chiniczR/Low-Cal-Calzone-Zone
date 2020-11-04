import Calzone from '../../assets/images/calzone.png';
import './MenuItem.scss';
import ItemImages from './ItemImages';

function MenuItem (props) {
    var Image = Calzone
    if (props.name) {
        Image = ItemImages[[props.name]]
    }
    return (
        <img className={`MenuItem ${props.size}`} src={Image} alt={props.name ? props.name : props.size} title={props.name ? props.name : props.size} />
    );
}

export default MenuItem;