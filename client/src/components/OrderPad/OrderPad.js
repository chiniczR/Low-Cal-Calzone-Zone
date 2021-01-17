import "./OrderPad.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faTrash } from "@fortawesome/free-solid-svg-icons";

const OrderPad = function ({ removeFood, removeDrink, food, calzones, drinks, beverages }) {
  const foodById = (id) => (calzones.filter(c => c.CalzoneId === id)[0]).Name;
  const drinkById = (id) => (beverages.filter(b => b.BeverageId === id)[0]).Name;

  return (
    <>
      <div id="paper">
        <div id="pattern">
          <div id="content">
            {food.map((f, i) => (
              <span key={i}>
                <span className="mr-1">
                  <b>{f.quantity + "x "}</b> {foodById(f.food)} Calzone
                </span>
                {f.quantity > 1 && (
                  <FontAwesomeIcon
                    icon={faReply}
                    className="icon-btn"
                    title="Remove one"
                    onClick={() => removeFood(f.food)}
                  />
                )}
                <FontAwesomeIcon
                  icon={faTrash}
                  className="icon-btn"
                  title="Remove all"
                  onClick={() => removeFood(f.food, true)}
                />
                <br />
              </span>
            ))}
            {drinks.map((d) => (
              <span key={d.drink}>
                <span className="mr-1">
                  <b>{d.quantity + "x "}</b> {drinkById(d.drink)}
                </span>
                {d.quantity > 1 && (
                  <FontAwesomeIcon
                    icon={faReply}
                    className="icon-btn"
                    title="Remove one"
                    onClick={() => removeDrink(d.drink)}
                  />
                )}
                <FontAwesomeIcon
                  icon={faTrash}
                  className="icon-btn"
                  title="Remove all"
                  onClick={() => removeDrink(d.drink, true)}
                />
                <br />
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPad;
