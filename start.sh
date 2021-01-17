./kafka/setup.sh
kubectl apply -k mysql > logs.txt
kubectl apply -f websocket/websocket > logs.txt
kubectl apply -f calzones/calzones > logs.txt
kubectl apply -f beverages/beverages > logs.txt
kubectl apply -f checkout/checkout > logs.txt
kubectl apply -f kitchen/kitchen > logs.txt
kubectl apply -f client/client > logs.txt
