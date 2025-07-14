import { FileService, OrderService, ProductService, SettingService, UserService } from "../services";
import { USER_ROLES, ORDER_STATUS } from "../constants/enum";

export default class PublicController {

  getAnalytics = async (req, res) => {
    try {
      // Check if user has permission to view analytics
      if (req.user?.role !== USER_ROLES.ADMIN && req.user?.role !== USER_ROLES.SUPER_ADMIN) {
        return res.status(403).json({ message: "You don't have permission to view analytics" });
      }

      const orders = await new OrderService().getAll();
      const users = await new UserService().getAll();
      const products = await new ProductService().getAll();

      // Calculate completed orders revenue
      const completedOrders = orders.filter(order => order.status === ORDER_STATUS.DELIVERED || order.status === ORDER_STATUS.FINISHED);
      const totalRevenue = completedOrders.reduce((acc, order) => acc + parseFloat(order.total_amount || 0), 0);

      const analytics = [
        {
          title: "Total Users",
          value: users.length,
          type: "number"
        },
        {
          title: "Total Products",
          value: products.length,
          type: "number"
        },
        {
          title: "Total Orders",
          value: orders.length,
          type: "number"
        },
        {
          title: "Total Revenue",
          value: totalRevenue.toLocaleString() + " VND",
          type: "currency"
        },
      ];

      return res.status(200).json({ analytics });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }

  getPolicies = async (req, res) => {
    try {
      const policiesSettings = await new SettingService().getPolicies();

      return res.status(200).json({ policies: policiesSettings.value });
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }

  updatePolicies = async (req, res) => {
    try {
      // Check if user has permission to update policies
      if (req.user?.role !== USER_ROLES.ADMIN && req.user?.role !== USER_ROLES.SUPER_ADMIN) {
        return res.status(403).json({ message: "You don't have permission to update policies" });
      }

      const { policies } = req.body;

      if (!policies || !Array.isArray(policies)) {
        return res.status(400).json({ message: "Invalid policies data" });
      }

      const oldPolicies = await new SettingService().getPolicies();

      // Delete old images that are no longer used
      if (oldPolicies && oldPolicies.value) {
        for (let old of oldPolicies.value) {
          if (old.image_url && !policies.find(p => p.image_url === old.image_url)) {
            try {
              await new FileService().deleteImage(old.image_url.split('/').reverse()[0]);
            } catch (deleteError) {
              console.error("Error deleting old image:", deleteError);
            }
          }
        }
      }

      await new SettingService().updatePolicies(policies);

      return res.status(200).json({ message: "Policies updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }

  getPromotions = async (req, res) => {
    try {
      const promotionsSettings = await new SettingService().getPromotions();

      return res.status(200).json({ promotions: promotionsSettings.value });
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }

  updatePromotions = async (req, res) => {
    try {
      // Check if user has permission to update promotions
      if (req.user?.role !== USER_ROLES.ADMIN && req.user?.role !== USER_ROLES.SUPER_ADMIN) {
        return res.status(403).json({ message: "You don't have permission to update promotions" });
      }

      const { promotions } = req.body;

      if (!promotions || !Array.isArray(promotions)) {
        return res.status(400).json({ message: "Invalid promotions data" });
      }

      const oldPromotions = await new SettingService().getPromotions();

      // Delete old images that are no longer used
      if (oldPromotions && oldPromotions.value) {
        for (let old of oldPromotions.value) {
          if (old.image_url && !promotions.find(p => p.image_url === old.image_url)) {
            try {
              await new FileService().deleteImage(old.image_url.split('/').reverse()[0]);
            } catch (deleteError) {
              console.error("Error deleting old image:", deleteError);
            }
          }
        }
      }

      await new SettingService().updatePromotions(promotions);

      return res.status(200).json({ message: "Promotions updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }
}