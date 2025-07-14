import { account_roles } from "../constants/constants";
import { USER_ROLES, GENERAL_STATUS } from "../constants/enum";
import { CategoryService } from "../services";


const role_author_number = {
    [USER_ROLES.NO_ROLE]: 0,
    [USER_ROLES.USER]: 1,
    [USER_ROLES.EMPLOYEE]: 2,
    [USER_ROLES.ADMIN]: 3,
    [USER_ROLES.SUPER_ADMIN]: 4,
}
const canCreate = (req_role) => role_author_number[req_role] >= role_author_number[USER_ROLES.ADMIN];
const canRead = (req_role) => role_author_number[req_role] >= role_author_number[USER_ROLES.NO_ROLE];
const canUpdate = (req_role) => role_author_number[req_role] >= role_author_number[USER_ROLES.ADMIN];
const canDelete = (req_role) => role_author_number[req_role] >= role_author_number[USER_ROLES.ADMIN];
export default class CategoryController {
    constructor() {
    }

    async getAll(req, res) {
        try {
            if (!canRead(req.user?.role || USER_ROLES.NO_ROLE)) {
                return res.status(403).json({ message: "You don't have permission to read" });
            }

            const { tree } = req.query;
            let data;

            if (tree === 'true') {
                data = await new CategoryService().getCategoryTree();
            } else {
                data = await new CategoryService().getAll();
            }

            return res.status(200).json(data);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getOne(req, res) {
        try {
            const data = await new CategoryService().getOne({ where: { id: req.params.id } });
            if (!data) {
                return res.status(404).json({ message: "Not found" });
            }
            return res.status(200).json(data);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async create(req, res) {
        try {
            if (!canCreate(req.user?.role || USER_ROLES.NO_ROLE)) {
                return res.status(403).json({ message: "You don't have permission to create this category" });
            }

            // Validate enum values
            if (req.body.status && !Object.values(GENERAL_STATUS).includes(req.body.status)) {
                return res.status(400).json({ message: "Invalid status value" });
            }

            // Set default values
            const categoryData = {
                ...req.body,
                status: req.body.status || GENERAL_STATUS.ACTIVE
            };

            const data = await new CategoryService().create(categoryData);
            return res.status(201).json({ category: data, message: "Create successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async update(req, res) {
        try {
            const target_category = await new CategoryService().getOne({ where: { id: req.params.id } });
            if (!target_category) {
                return res.status(404).json({ message: "Not found" });
            }
            if (!canUpdate(req.user?.role || USER_ROLES.NO_ROLE)) {
                return res.status(403).json({ message: "You don't have permission to edit this category" });
            }

            // Validate enum values
            if (req.body.status && !Object.values(GENERAL_STATUS).includes(req.body.status)) {
                return res.status(400).json({ message: "Invalid status value" });
            }

            let data = await new CategoryService().update(req.body);
            return res.status(200).json({ category: data, message: "Update successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async delete(req, res) {
        try {
            if (!canDelete(req.user?.role || USER_ROLES.NO_ROLE)) {
                return res.status(403).json({ message: "You don't have permission to delete this category" });
            }

            const target_category = await new CategoryService().getOne({ where: { id: req.params.id } });
            if (!target_category) {
                return res.status(404).json({ message: "Not found" });
            }

            await new CategoryService().delete({ where: { id: req.params.id } });
            return res.status(204).json();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}