import { Router } from 'express'
import { getCategories } from '../controllers/categoryController.js'

let router = Router()

const categoryRoute = (app) => {
    router.get('/', getCategories)

    app.use('/api/v1/category', router)
}

export default categoryRoute