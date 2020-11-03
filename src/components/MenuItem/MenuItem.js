import calzone from '../../assets/images/calzone.png';
import './MenuItem.css';

function MenuItem () {
    return (
        <img className="MenuItem" src={calzone}></img>
    );
}

export default MenuItem;