module.exports = (plugin) => {
  const register = plugin.controllers.auth.register;

  plugin.controllers.auth.register = async (ctx) => {
    await register(ctx);

    if (ctx.request.files?.avatar) {
      const user = await strapi.entityService.findMany(
        "plugin::users-permissions.user",
        { filters: { username: ctx.request.body.username } },
      );

      await strapi.plugins.upload.services.upload.upload({
        data: {
          refId: user[0].id,
          ref: "plugin::users-permissions.user",
          field: "avatar",
        },
        files: ctx.request.files.avatar,
      });
    }
  };
  return plugin;
};
