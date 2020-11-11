import React, { useState } from 'react';
import './Menu.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import MenuItem from '../MenuItem/MenuItem';

function Menu ({ orderFood, orderDrink }) {
    const [size, setSize] = useState('medium');
    const sizes = [
        { name: 'Small', value: 'small' },
        { name: 'Medium', value: 'medium' },
        { name: 'Large', value: 'large' },
    ];

    const [fillings, setFillings] = useState([]);
    const fills = [
        { name: 'Tomato', value: 'tomato' },
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

    const drinks = [
        { name: 'Coca-Cola', value: 'coke' },
        { name: 'Tea', value: 'tea' },
        { name: 'Hot Chocolate', value: 'hot-chocolate' },
        { name: 'Iced Tea', value: 'iced-tea' }
    ]

    return (
        <Container className="Menu border rounded">
            <h2 className="mb-0"><u>MENU</u></h2>
            <label htmlFor="sizeRow">Size:</label>
            <span id="sizeRow" className="ml-2 my-0">
                {sizes.map((sz, i) => (
                    <div className="form-check form-check-inline" key={sz.name + i} title={sz.name}>
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
            <hr className="mb-2 mt-0" />
            <label htmlFor="fillingRow">Filling:</label>
            <span id="fillingRow" className="ml-2">
                {fills.map((f, i) => (
                    <div className="form-check form-check-inline" key={f.name + i} title={f.name}>
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
                            <MenuItem size={f.value === "cheese" ? "medium" : "small"} name={f.value} />
                        </label>
                    </div>
                ))}
            </span>
            <hr className="mt-1 mb-0" />
            <Row className="mt-0 align-items-center">
                <Col sm="10" className="text-left">
                    <p className="ml-1 mt-1 mb-0">{size.charAt(0).toUpperCase() + size.slice(1)} calzone { fillings.length > 0 ? 'with ' : '' } {fillings.join(", ")}</p>
                </Col>
                <Col sm="2" className="text-right">
                    <Button variant="outline-dark" title="Add to order" className="rounded-circle py-0 px-2 m-1" onClick={() => orderFood({ size: size, fillings: fillings })}><b>+</b></Button>
                </Col>
            </Row>
            <hr className="mt-0 mb-2" />
            <Row className="justify-content-center mb-2">To Drink:</Row>
            <Row className="mb-3">
                {drinks.map(drink => (
                    <Col title={drink.name} key={drink.value}>
                        <MenuItem size="small" name={drink.value} />
                        <div>
                            <Button variant="outline-dark" title="Add to order" className="rounded-circle py-0 px-2 mt-1" onClick={() => orderDrink(drink.value)}><b>+</b></Button>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default Menu;