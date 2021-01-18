# Low-Cal-Calzone-Zone

The Low-Cal Calzone Zone is a microservices application for a calzone store. For a more detailed description of what it does and the idea behind this project, visit this article.

### Pre-requisites
- A Kuberenetes cluster
- kubectl
- helm

### To initialise
```
git clone https://github.com/chiniczR/Low-Cal-Calzone-Zone
cd Low-Cal-Calzone-Zone
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
