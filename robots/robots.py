import pandas as pd
import requests
import time
import random
import json

people = pd.read_csv("people.csv", header=[0])
beverages = ["321cba", "654fed", "987ihg", "210lkj"]
calzones = ["123abc", "456def", "789ghi"]

while 1 == 1:
    num = random.randint(0, 9)
    
    # Randomly select the client info
    person = people.loc[num]
    client = {
        "name": person["name"],
        "email": person["email"],
        "addr": person["address"],
        "phone": person["phone"]
    }

    # Random number of different calzones to order
    num = random.randint(1, 5)

    # Randomly select calzones
    food = list()
    present = list()
    for i in range(0, num):
        kit = calzones[random.randint(0, 2)]
        qnt = random.randint(1, 3)
        newfood = {
            "food": kit,
            "quantity": qnt
        }
        # If we don't already have a calzone of this type in our order
        if kit not in present:
            present.append(kit)
            food.append(newfood)

    # Random number of different beverages to order
    num = random.randint(1, 5)
    
    # Randomly select beverages
    drink = list()
    present = list()
    for i in range(0, num):
        sel = random.randint(0, 3)
        d = beverages[sel]
        qnt = random.randint(1, 3)
        newdrink = {
            "drink": d,
            "quantity": qnt
        }
        # If we don't already have this beverage in our order
        if d not in present:
            present.append(d)
            drink.append(newdrink)

    order = { "o": {
        "client": client,
        "food": food,
        "drinks": drink,
        "orderId": None
    }}

    print(f"{order}")
    r = requests.post("http://checkout:8080/checkout", data=json.dumps(order))
    print(r.text + "\n---")

    time.sleep(3)