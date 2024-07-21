# Parking Reservation

A parking system API for reserving and managing parking.


## Run Locally

Clone the project

```bash
  git clone https://github.com/Singatha/parking-reservation.git
```

To run the project, go to the project folder

```bash
  cd parking-reservation
```
and run

```bash
  docker-compose up --build
```

To compose down run

```bash
  docker-compose down
```

To compose down run and remove images

```bash
  docker-compose down --rmi all
```

To compose down run, remove images and volumes

```bash
  docker-compose down -v --rmi all
```

## Authors

- [@singatha](https://www.github.com/singatha)

- [@charbileigh](https://www.github.com/charbileigh)

## Roadmap

- Add Emails
  - Reservation Email
  - Invoice Email
- Authentication
  - add OAuth authentication (google, facebook, github, ..etc) 
- Payment Gateway Service
- Caching
- Security
