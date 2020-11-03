import React from 'react';
import './Menu.scss';
import { Container, Form, FormCheck } from 'react-bootstrap';
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
                <label htmlFor="sizeRow">Size</label>
                <span id="sizeRow" className="ml-2">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" checked />
                        <label class="form-check-label" for="inlineRadio1">1</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
                        <label class="form-check-label" for="inlineRadio2">
                            <MenuItem />
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3" />
                        <label class="form-check-label" for="inlineRadio3">3</label>
                    </div>
                </span>
            </Container>
        )
    }
}

export default Menu;