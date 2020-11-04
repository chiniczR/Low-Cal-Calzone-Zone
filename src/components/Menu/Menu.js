import React from 'react';
import './Menu.scss';
import { Button, Container, Row } from 'react-bootstrap';
import MenuItem from '../MenuItem/MenuItem';

class Menu extends React.Component {
    constructor () {
        super()
        this.state = {
            size: '',
            filling: '',
            drink: ''
        }
    }

    render () {
        return (
            <Container className="Menu border rounded">
                <h2><u>MENU</u></h2>
                <label htmlFor="sizeRow">Size:</label>
                <span id="sizeRow" className="ml-4">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="small"  />
                        <label class="form-check-label" for="inlineRadio1">
                            <MenuItem size="small"/>
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Medium" checked />
                        <label class="form-check-label" for="inlineRadio2">
                            <MenuItem size="medium"/>
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="large" />
                        <label class="form-check-label" for="inlineRadio3">
                            <MenuItem size="large"/>
                        </label>
                    </div>
                </span>
                <hr />
                <label htmlFor="fillingRow">Filling:</label>
                <span id="fillingRow" className="ml-4">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" name="inlineRadioOptions" id="inlineRadio4" value="tomato" />
                        <label class="form-check-label" for="inlineRadio4">
                            <MenuItem size="small" name="tomato"/>
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" name="inlineRadioOptions" id="inlineRadio5" value="onion" />
                        <label class="form-check-label" for="inlineRadio5">
                            <MenuItem size="small" name="onion"/>
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" name="inlineRadioOptions" id="inlineRadio6" value="pepper" />
                        <label class="form-check-label" for="inlineRadio6">
                            <MenuItem size="small" name="pepper"/>
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" name="inlineRadioOptions" id="inlineRadio7" value="cheese" />
                        <label class="form-check-label" for="inlineRadio7">
                            <MenuItem size="large" name="cheese"/>
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" name="inlineRadioOptions" id="inlineRadio8" value="broccoli" />
                        <label class="form-check-label" for="inlineRadio8">
                            <MenuItem size="small" name="broccoli"/>
                        </label>
                    </div>
                </span>
                <hr className="my-1" />
                <Row className="justify-content-end mr-1">
                    <Button variant="outline-dark" className="rounded-circle"><b>+</b></Button>
                </Row>
            </Container>
        )
    }
}

export default Menu;