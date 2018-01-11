const express = require('express')
const router = express.Router()

const CustomerService = require('../services/customer-service')
const SeatService = require('../services/seat-service')

//Customer routes

router.get('/customer', async (req, res, next) => {
  res.send(await CustomerService.findAll())
})

router.get('/customer/detail/:id', async (req, res, next) => {
  const customer = await CustomerService.find(req.params.id)
  res.render('customer-detail', { customer })
})

router.get('/customer/all', async (req, res, next) => {
  const customers = await CustomerService.findAll()
  res.render('customer-list', { customers })
})

router.post('/customer', async (req, res, next) => {
  const newCustomer = req.body
  try {
    const customer = await CustomerService.add(newCustomer)
    res.send(customer)
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).send({
        success: false,
        message: 'An user with this email is already registered.'
      })
    }
    return res.status(500).send({ success: false, message: err.message })
  }
})

router.post('/customer/:id/booking', async (req, res, next) => {
  const customer = await CustomerService.find(req.params.id)
  const seat = await SeatService.find(req.body.seatId)

  const customerSeatId = customer.seatId
  const seatId = seat._id
  const seatCustomerId = seat.customerId

  if (customerSeatId !== '') {
    return res.status(404).send({
      success: false,
      message: 'This customer already has a ticket.'
    })
    if (seatCustomerId !== '') {
      return res.status(404).send({
        success: false,
        message: 'This seat is not available.'
      })
    }
  }

  customerSeatId = seatId
  const updatedCustomer = await customer.save()
  res.send(updatedCustomer)
})

//Seat routes

router.get('/seat', async (req, res, next) => {
  res.send(await SeatService.findAll())
})

router.get('/seat/detail/:id', async (req, res, next) => {
  const seat = await SeatService.find(req.params.id)
  res.render('seat-detail', { seat })
})

router.get('/seat/all', async (req, res, next) => {
  const seats = await SeatService.findAll()
  res.render('seat-list', { seats })
})

router.get('/seat/available', async (req, res, next) => {
  const seats = await SeatService.findAvailableSeats()
  res.render('seat-list', { seats })
})

router.post('/seat', async (req, res, next) => {
  const newSeat = req.body
  try {
    const seat = await SeatService.add(newSeat)
    res.send(seat)
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).send({
        success: false,
        message: 'This seat is already registered.'
      })
    }
    return res.status(500).send({ success: false, message: err.message })
  }
})

module.exports = router
