import { FileService, SettingService } from "../services";

export default class PublicController {
  getPolicies = async (req, res) => {
    try {

      const policiesSettings = await new SettingService().getPolicies();

      return res.status(200).json({ policies: policiesSettings.value });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  getPromotions = async (req, res) => {
    try {
      const promotionsSettings = await new SettingService().getPromotions();

      return res.status(200).json({ promotions: promotionsSettings.value });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  updatePromotions = async (req, res) => {
    try {
      const promotions = req.body.promotions;
      const oldPromotions = await new SettingService().getPromotions();

      for (let old of oldPromotions.value) {
        if (!promotions.find(p => p.img === old.img)) {
          await new FileService().deleteImage(old.img.split('/').reverse()[0]);
        }
      }

      await new SettingService().updatePromotions(promotions);

      return res.status(200).json({ message: "Promotions updated successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}