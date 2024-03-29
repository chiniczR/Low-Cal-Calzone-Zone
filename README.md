# Low-Cal-Calzone-Zone

[Demo]: ./LCCZ-Screenshot.png "Demonstration of app"

![Demo]

The Low-Cal Calzone Zone is a microservices application for a calzone store. For a more detailed description of what it does and the idea behind the project, visit this article on https://medium.com/gitconnected/dbs-in-a-pod-calzones-containers-and-microservices-74e47e3e01bc .

### Pre-requisites
- A Kuberenetes cluster
- NGINX Ingress Controller
- kubectl
- helm

### To initialise
```
git clone https://github.com/chiniczR/Low-Cal-Calzone-Zone
cd Low-Cal-Calzone-Zone
./init.sh
./start.sh
```
Optionally, if you want to use the name low-cal-calzone.zone to access the application (locally), 
1. Get Kuberetes IP address, e.g. with Minikube
```
minikube ip
```
2. Open `/etc/hosts` (assuming you're on Linux):
```
sudo vi /etc/hosts
```
3. Add before  "`# The following lines ...`" :
```
<IP Address>    low-cal-calzone.zone
<IP Address>    api.low-cal-calzone.zone
```

### To stop
```
./stop.sh
```

[Architecture]: ./LowCalCalzoneZone.jpg "Overview of Architecture"

### Architecture Overview
![Architecture]
