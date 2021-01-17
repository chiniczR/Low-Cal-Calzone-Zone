from confluent_kafka import Consumer
import socketio
import json
import datetime
import time

if __name__ == '__main__':
    # Create the SocketIO client
    sio = socketio.Client()

    @sio.event
    def connect():
        print('WS connection established')

    @sio.event
    def disconnect():
        print('WS disconnected from server')

    sio.connect('http://websocket:5000')

    # Read arguments and configurations and initialize
    topic = 'kitchen'

    # Create Consumer instance
    # 'auto.offset.reset=earliest' to start reading from the beginning of the
    #   topic if no committed offsets exist
    consumer = Consumer({
        'bootstrap.servers': 'my-cluster-kafka-bootstrap:9092',
        'group.id': 'myGroup',
        'auto.offset.reset': 'earliest'
    })

    # Subscribe to topic
    consumer.subscribe([topic])

    # Process messages
    total_count = 0
    try:
        while True:
            msg = consumer.poll(1.0)
            if msg is None:
                # No message available within timeout.
                # Initial message consumption may take up to
                # `session.timeout.ms` for the consumer group to
                # rebalance and start consuming
                print("Waiting...")
                continue
            elif msg.error():
                print('Error: {}'.format(msg.error()))
            else:
                # Check for Kafka message
                record_key = msg.key()
                record_value = msg.value()
                data = json.loads(record_value)
                if data["client"] == "":
                    print("Waiting...")
                    continue
                else:
                    total_count += 1
                    print("{}) Client: {}, OrderId: {}, Content: {}"
                        .format(total_count, data["client"], data["order_id"], data["order_content"]))
                    
                    # Prepare the order for 3 seconds
                    time.sleep(10)

                    sio.emit('notification', {'action': 'ORDER-READY', 'date': datetime.datetime.now().isoformat(), 'message': data, 'variant': 'success'})
    except KeyboardInterrupt:
        pass
    finally:
        # Leave group and commit final offsets
        consumer.close()