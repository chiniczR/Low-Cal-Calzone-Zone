# Set base image (host OS)
FROM python:3.8

# Set the working directory in the container
WORKDIR /code

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install dependencies
RUN pip install -r requirements.txt

# Copy the random people info csv file
COPY people.csv .

# Copy the content of the local src directory to the working directory
COPY robots.py .

# Command to run on container start
CMD [ "python", "robots.py" ]