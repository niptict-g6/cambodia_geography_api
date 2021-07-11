import asyncHandler from 'express-async-handler'

const paginatedResult = (model) =>
  asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1
    const limit = 3
    // 5
    // 10
    console.log(model)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const modelLength = await model.countDocuments().exec()

    console.log(page)
    console.log(startIndex)
    console.log(endIndex)
    console.log(modelLength)

    const links = {}
    let data = []

    if (endIndex < modelLength) {
      links.self = `http://localhost:5000/places?page=${page}`
      if (page + 1 <= Math.round(modelLength / limit)) {
        links.next = `http://localhost:5000/places?page=${page + 1}`
      }

      if (page - 1 > 0) {
        links.prev = `http://localhost:5000/places?page=${page - 1}`
      }

      links.first = `http://localhost:5000/places?page=1`
      links.last = `http://localhost:5000/places?page=${Math.round(
        modelLength / limit
      )}`
    }

    if (startIndex > 0) {
      links.self = `http://localhost:5000/places?page=${page}`
      if (page + 1 < Math.round(modelLength / limit)) {
        links.next = `http://localhost:5000/places?page=${page + 1}`
      }

      if (page - 1 > 0) {
        links.prev = `http://localhost:5000/places?page=${page - 1}`
      }
      links.first = `http://localhost:5000/places?page=1`
      links.last = `http://localhost:5000/places?page=${Math.round(
        modelLength / limit
      )}`
    }

    try {
      data = await model.find().limit(limit).skip(startIndex).exec()
      res.links = links
      res.data = data
      next()
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

export default paginatedResult
