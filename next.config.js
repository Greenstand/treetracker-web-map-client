const withImages = require('next-images')

module.exports = {
   ...withImages(),
   future: {
      webpack5: true,
   },
  env: {
    NEXT_PUBLIC_API_NEW: "https://48b2db50-8226-4f1e-9b46-7d80bed46d0f.mock.pstmn.io/",
  },

}
