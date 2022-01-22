module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return[
      {
        source: "/api/bithumb",
        destination: "https://api.bithumb.com/public/ticker/ALL_KRW"
      },
      {
        source: "/api/korbit",
        destination: "https://api.korbit.co.kr/v1/ticker/detailed/all"
      },
      {
        source: "/api/upbit/mymoney",
        destination: "https://api.upbit.com/v1/accounts"
      }
    ]
  }
}
