export default {
  expo: {
    android: {
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
    },
  },
};
