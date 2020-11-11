import './OrderPad.css';

const OrderPad = function ({removeFood, removeDrink, food, drinks}) {
    return (
        <>
            <div id="paper">
                <div id="pattern">
                    <div id="content">
                        {food.map((f, i) => (
                            <span key={i}>
                                { f.quantity + 'x ' + f.size + ' calzone ' + (f.fillings.length > 0 ? 'with ' : '') + f.fillings.join(", ") }
                                <br />
                            </span>
                        ))}
                        {drinks.map(d => (
                            <span key={d.drink}>
                                { d.quantity + 'x ' + d.drink }
                                <br />
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
};

export default OrderPad;