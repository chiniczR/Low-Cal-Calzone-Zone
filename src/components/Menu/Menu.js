import React, { useState } from 'react';
import './Menu.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import MenuItem from '../MenuItem/MenuItem';

function Menu ({ orderFood }) {
    const [size, setSize] = useState('medium')
    const sizes = [
        { name: 'Small', value: 'small' },
        { name: 'Medium', value: 'medium' },
        { name: 'Large', value: 'large' },
    ];

    const [fillings, setFillings] = useState([])
    const fills = [
        { name: 'Tomato', value: 'tomato' },
        { name: 'Onion', value: 'onion' },
        { name: 'Pepper', value: 'pepper' },
        { name: 'Cheese', value: 'cheese' },
        { name: 'Broccoli', value: 'broccoli' }
    ];
    const changeFilling = (e, prev) => {
        let val = e.target.value;
        if (fillings.includes(val)) {
            return fillings.filter(fil => fil !== val);
        }
        else {
            return [...prev, val];
        }
    }

    return (
        <Container className="Menu border rounded">
            <h2><u>MENU</u></h2>
            <label htmlFor="sizeRow">Size:</label>
            <span id="sizeRow" className="ml-4">
                {sizes.map((sz, i) => (
                    <div className="form-check form-check-inline" key={sz.name + i}>
                        <input
                            className="form-check-input" 
                            type="radio" 
                            name="size" 
                            id={"inlineRadio" + i} 
                            value={sz.value} 
                            checked={size === sz.value}
                            onChange={(e) => setSize(e.currentTarget.value)}
                        />
                        <label className="form-check-label" htmlFor={"inlineRadio" + i}>
                            <MenuItem size={sz.value} />
                        </label>
                    </div>
                ))}
            </span>
            <hr />
            <label htmlFor="fillingRow">Filling:</label>
            <span id="fillingRow" className="ml-4">
                {fills.map((f, i) => (
                    <div className="form-check form-check-inline" key={f.name + i}>
                        <input
                            className="form-check-input" 
                            type="checkbox" 
                            name="size" 
                            id={"inlineRadio" + i} 
                            value={f.value} 
                            checked={fillings.includes(f.value)}
                            onChange={(e) => setFillings((prev) => changeFilling(e, prev) )}
                        />
                        <label className="form-check-label" htmlFor={"inlineRadio" + i}>
                            <MenuItem size={f.value === "cheese" ? "large" : "small"} name={f.value} />
                        </label>
                    </div>
                ))}
            </span>
            <hr className="my-1" />
            <Row>
                <Col sm="10" className="text-left">
                    {size.charAt(0).toUpperCase() + size.slice(1)} calzone with {fillings.join(", ")}
                    </Col>
                <Col sm="2" className="text-right">
                    <Button variant="outline-dark" title="Add to order" className="rounded-circle py-0 px-2 m-1" onClick={() => orderFood({ size: size, fillings: fillings })}><b>+</b></Button>
                </Col>
            </Row>
        </Container>
    )
}

export default Menu;