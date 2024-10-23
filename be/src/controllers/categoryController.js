import { getAllCategories } from "../services/categoryService"

export const getCategories = async (req, res) => {
    try {
        const categories = await getAllCategories()
        return res.status(200).json({ categories })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: err.message })
    }
}