import "./OrderPad.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faTrash } from "@fortawesome/free-solid-svg-icons";

const OrderPad = function ({ removeFood, removeDrink, food, drinks }) {
  return (
    <>
      <div id="paper">
        <div id="pattern">
          <div id="content">
            {food.map((f, i) => (
              <span key={i}>
                <span className="mr-1">
                  <b>{f.quantity + "x "}</b>{" "}
                  {f.size +
                    " calzone " +
                    (f.fillings.length > 0 ? "with " : "") +
                    f.fillings.join(", ")}
                </span>
                {f.quantity > 1 && (
                  <FontAwesomeIcon
                    icon={faReply}
                    className="icon-btn"
                    title="Remove one"
                    onClick={() => removeFood(f)}
                  />
                )}
                <FontAwesomeIcon
                  icon={faTrash}
                  className="icon-btn"
                  title="Remove all"
                  onClick={() => removeFood(f, true)}
                />
                <br />
              </span>
            ))}
            {drinks.map((d) => (
              <span key={d.drink}>
                <span className="mr-1">
                  <b>{d.quantity + "x "}</b> {d.drink}
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
