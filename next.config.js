const withImages = require('next-images')

module.exports = {
   ...withImages(),
   future: {
      webpack5: true,
   },
  env: {
    NEXT_PUBLIC_API_NEW: "http://127.0.0.1:4010/mock",
  },

}
