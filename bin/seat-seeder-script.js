const faker = require('faker')
const fs = require('fs')

const priceSelector = row => {
  let price = 0
  if (row <= 6) {
    price = 8
  } else {
    price = 7
  }
  return price
}

const generateSeat = (rowIndex, numberIndex, movieTitle) => ({
  row: rowIndex + 1,
  number: numberIndex + 1,
  movieTitle: movieTitle,
  price: priceSelector(rowIndex + 1)
})

const generateSeats = (amountOfRows, amountOfSeats, movieTitle) => {
  const seatsArray = []

  for (let r = 0; r < amountOfRows; r++) {
    for (let s = 0; s < amountOfSeats; s++) {
      seatsArray.push(generateSeat(r, s, movieTitle))
    }
  }

  return seatsArray
}

const seats = generateSeats(10, 8, 'Arrival')

fs.writeFile('./seats.json', JSON.stringify(seats), () => {
  console.log('Seats saved in json file')
})
