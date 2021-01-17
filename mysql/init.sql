CREATE DATABASE lccz;

USE lccz;

CREATE TABLE beverage
(
  beverage_id   VARCHAR(50) NOT NULL,
  beverage_name VARCHAR(50) NOT NULL,
  quantity      INT         NOT NULL DEFAULT 0,
  picture       VARCHAR(50),
  PRIMARY KEY (beverage_id)
);

ALTER TABLE beverage
  ADD CONSTRAINT UQ_beverage_name UNIQUE (beverage_name);

CREATE TABLE calzone
(
  calzone_id VARCHAR(50) NOT NULL,
  quantity   INT         NOT NULL,
  order_id   VARCHAR(50) NOT NULL,
  kit_id     VARCHAR(50) NULL    ,
  PRIMARY KEY (calzone_id)
);

CREATE TABLE client
(
  client_id      VARCHAR(50)  NOT NULL,
  email          VARCHAR(100) NOT NULL,
  client_name    VARCHAR(50)  NOT NULL,
  client_address VARCHAR(150) NULL    ,
  phone          VARCHAR(20)  NULL    ,
  PRIMARY KEY (client_id)
);

ALTER TABLE client
  ADD CONSTRAINT UQ_client_id UNIQUE (client_id);

ALTER TABLE client
  ADD CONSTRAINT UQ_email UNIQUE (email);

CREATE TABLE drink
(
  drink_id    VARCHAR(50) NOT NULL,
  quantity    INT         NOT NULL,
  order_id    VARCHAR(50) NULL    ,
  beverage_id VARCHAR(50) NULL    ,
  PRIMARY KEY (drink_id)
);

ALTER TABLE drink
  ADD CONSTRAINT UQ_drink_id UNIQUE (drink_id);

CREATE TABLE kit
(
  kit_id   VARCHAR(50)                                              NOT NULL,
  kit_name VARCHAR(50)                                              NOT NULL,
  quantity INT                                                      NOT NULL DEFAULT 0,
  fillings SET('cheese','broccoli','tomato','fish','olives','tofu') NOT NULL DEFAULT ('cheese'),
  picture  VARCHAR(50),
  PRIMARY KEY (kit_id)
);

ALTER TABLE kit
  ADD CONSTRAINT UQ_kit_name UNIQUE (kit_name);

CREATE TABLE ordered
(
  order_id  VARCHAR(50) NOT NULL,
  client_id VARCHAR(50) NOT NULL,
  creation  DATETIME    NULL     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (order_id)
);

ALTER TABLE ordered
  ADD CONSTRAINT UQ_order_id UNIQUE (order_id);

ALTER TABLE ordered
  ADD CONSTRAINT FK_client_TO_ordered
    FOREIGN KEY (client_id)
    REFERENCES client (client_id)
    ON DELETE CASCADE;

ALTER TABLE calzone
  ADD CONSTRAINT FK_ordered_TO_calzone
    FOREIGN KEY (order_id)
    REFERENCES ordered (order_id)
    ON DELETE CASCADE;

ALTER TABLE drink
  ADD CONSTRAINT FK_ordered_TO_drink
    FOREIGN KEY (order_id)
    REFERENCES ordered (order_id)
    ON DELETE CASCADE;

ALTER TABLE drink
  ADD CONSTRAINT FK_beverage_TO_drink
    FOREIGN KEY (beverage_id)
    REFERENCES beverage (beverage_id)
    ON DELETE CASCADE;

ALTER TABLE calzone
  ADD CONSTRAINT FK_kit_TO_calzone
    FOREIGN KEY (kit_id)
    REFERENCES kit (kit_id)
    ON DELETE CASCADE;

SET @stock := 25;

INSERT INTO kit (kit_id, kit_name, quantity, fillings, picture)
  VALUES ('123abc', 'Classic', @stock, 'cheese,tomato', 'classic.jpeg'),
  ('456def', 'Fit', @stock, 'tofu,fish,broccoli', 'fit.jpeg'),
  ('789ghi', 'Vegan', @stock, 'tofu,tomato,olives', 'vegan.jpeg');

INSERT INTO beverage (beverage_id, beverage_name, quantity, picture)
  VALUES ('321cba', 'Coke', @stock, 'coke.png'),
  ('654fed', 'Iced Tea', @stock, 'iced-tea.png'),
  ('987ihg', 'Tea', @stock, 'tea.png'),
  ('210lkj', 'Hot Chocolate', @stock, 'hot-chocolate.png');

DELIMITER $$

CREATE TRIGGER check_kit_stock
BEFORE INSERT ON calzone
FOR EACH ROW
BEGIN
  IF (new.quantity IS NULL OR new.quantity > (SELECT kit.quantity FROM kit WHERE kit.kit_id = new.kit_id)) THEN
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = "NOT ENOUGH CALZONE KITS";
  ELSE
    UPDATE kit
    SET kit.quantity = kit.quantity - new.quantity
    WHERE kit.kit_id = new.kit_id;
  END IF;
END$$

CREATE TRIGGER check_beverage_stock
BEFORE INSERT ON drink
FOR EACH ROW
BEGIN
  IF (new.quantity IS NULL OR new.quantity > (SELECT beverage.quantity FROM beverage WHERE beverage.beverage_id = new.beverage_id)) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = "NOT ENOUGH BEVERAGES";
  ELSE
    UPDATE beverage
    SET beverage.quantity = beverage.quantity - new.quantity
    WHERE beverage.beverage_id = new.beverage_id;
  END IF;
END$$

CREATE TRIGGER refill_order_canceled
AFTER DELETE ON ordered
FOR EACH ROW
BEGIN
  UPDATE kit
  SET kit.quantity = @stock - IFNULL((SELECT SUM(calzone.quantity) FROM calzone WHERE calzone.kit_id = kit.kit_id), 0)
  WHERE 1 = 1;
  UPDATE beverage
  SET beverage.quantity = @stock - IFNULL((SELECT SUM(drink.quantity) FROM drink WHERE drink.beverage_id = beverage.beverage_id), 0)
  WHERE 1 = 1;
END$$

DELIMITER ;