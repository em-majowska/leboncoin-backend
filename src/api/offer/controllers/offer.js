"use strict";

/**
 * offer controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::offer.offer", ({ strapi }) => ({
  async deleteAllOffers(ctx) {
    try {
      const userId = ctx.state.user.id;
      const userData = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        userId,
        { populate: ["offers"] },
      );

      for (let offer of userData.offers) {
        await strapi.entityService.delete("api::offer.offer", offer.id);
      }

      await strapi.entityService.update(
        "plugin::users-permissions.user",
        userId,
        { data: { offers: [] } },
      );

      return userData;
    } catch (error) {
      ctx.response.status = 500;
      return { message: error.message };
    }
  },
  async create(ctx) {
    try {
      const userId = ctx.state.user.id;
      const body = JSON.parse(ctx.request.body.data);
      const ownerId = body.owner;
      if (ownerId !== userId) {
        ctx.response.status = 403;
        return {
          message:
            "Un utilisateur ne peut poster une offre que s'il en est le propriétaire",
        };
      }

      const { data, meta } = await super.create(ctx);

      return { data, meta };
    } catch (error) {
      ctx.response.status = 500;
      return { message: error.message };
    }
  },
}));
