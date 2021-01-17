import './Menu.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import MenuItem from '../MenuItem/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollyFlatbed, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import config from '../../config';

function Menu ({ orderFood, orderDrink, f, d, calzones, beverages, updateNotifications, refresh }) {
    let theCalzone = (food) => f.filter(x => x.food === food.CalzoneId)[0]
    let theBeverage = (drink) => d.filter(x => x.drink === drink.BeverageId)[0]

    const restock = (e, what) => {
        e.preventDefault();
        var endpoint = config[what] + "/restock"
        const options = {
            url: endpoint,
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8",
            }
          };
          axios(options)
            .then((response) => {
                var d = new Date();
                updateNotifications({'action': 'RESTOCK', 'message': 'Restocked ' + what, 'date': d.toISOString(), 'variant': 'primary' })
            })
            .catch((err) => {
                var d = new Date();
                updateNotifications({'action': 'RESTOCK', 'message': 'Failed to restock ' + what, 'date': d.toISOString(), 'variant': 'danger' })
                console.error(err)
            });
    }

    return (
        <Container className="Menu border rounded">
            <h2 className="mb-0">
                <u>MENU</u>
                <Button
                     variant="link"
                     className="btn-sm"
                     title="Refresh menu"
                     onClick={(e) => {
                        refresh(e)
                     }}
                >
                        <FontAwesomeIcon icon={faSyncAlt} />
                </Button>    
            </h2>
            <Row className="justify-content-between mb-2">
                <Col className="col-2"><b>Food</b></Col>
                <Col className="col-2">
                    <Button
                     variant="link"
                     className="btn-sm"
                     title="Restock calzone kits"
                     onClick={(e) => {
                        restock(e, "calzones")
                     }}
                    >
                        <FontAwesomeIcon icon={faDollyFlatbed} />
                    </Button>
                </Col>
            </Row>
            <Row className="mb-3 align-items-center">
                {calzones.map(food => (
                    <Col title={food.Name} key={food.CalzoneId}>
                        <Row className="justify-content-center mb-0">
                            <MenuItem 
                                size="large" 
                                name={food.CalzoneId} 
                                title={food.Name}
                                fillings={food.Fillings}
                                available={food.Quantity < 1 || (theCalzone(food) && theCalzone(food).quantity === food.Quantity)}
                                picture={food.Picture}
                            />
                        </Row>
                        <Button 
                            variant="outline-dark" 
                            title={food.Quantity < 1 || (theCalzone(food) && theCalzone(food).quantity >= food.Quantity) ? 'Unavailable' : 'Add to order'} 
                            className="rounded-circle py-0 px-2 mt-0"
                            disabled={food.Quantity < 1 || (theCalzone(food) && theCalzone(food).quantity === food.Quantity)}
                            onClick={() => orderFood(food.CalzoneId)}
                        >
                            <b>+</b>
                        </Button>
                    </Col>
                ))}
            </Row>
            <hr className="mt-0 mb-2" />
            <Row className="justify-content-between mb-2">
                <Col className="col-2"><b>Drink</b></Col>
                <Col className="col-2">
                    <Button
                     variant="link"
                     className="btn-sm"
                     title="Restock beverages"
                     onClick={(e) => {
                        restock(e, "beverages")
                     }}
                    >
                        <FontAwesomeIcon icon={faDollyFlatbed} />
                    </Button>
                </Col>
            </Row>
            <Row className="mb-3 align-items-center">
                {beverages.map(drink => (
                    <Col title={drink.Name} key={drink.BeverageId}>
                        <Row className="justify-content-center mb-0">
                            <MenuItem 
                                size="small" 
                                name={drink.BeverageId} 
                                title={drink.Name} 
                                available={drink.Quantity < 1 || (theBeverage(drink) && theBeverage(drink).quantity === drink.Quantity)}
                                picture={drink.Picture} 
                            />
                        </Row>
                        <Button 
                            variant="outline-dark"
                            title={drink.Quantity < 1 || (theBeverage(drink) && theBeverage(drink).quantity >= drink.Quantity) ? 'Unavailable' : 'Add to order'}  
                            className="rounded-circle py-0 px-2 mt-0" 
                            disabled={drink.Quantity < 1 || (theBeverage(drink) && theBeverage(drink).quantity === drink.Quantity)}
                            onClick={() => orderDrink(drink.BeverageId)}
                        >
                            <b>+</b>
                        </Button>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default Menu;