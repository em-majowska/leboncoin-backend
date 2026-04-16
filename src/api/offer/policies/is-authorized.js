module.exports = async (policyContext, config, { strapi }) => {
  const userId = policyContext.state.user.id;
  const offerId = policyContext.request.params.id;

  const offer = await strapi.entityService.findOne(
    "api::offer.offer",
    offerId,
    { populate: ["owner"] },
  );

  const offerOwnerId = offer.owner.id;

  if (offerOwnerId !== userId) {
    return false;
  } else {
    return true;
  }
};
