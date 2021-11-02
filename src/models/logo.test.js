import entity from "./entity";
import getLogo from "./logo.js";

jest.mock("./entity");



describe("Logo", () => {
  let logoCustomer = "http://zaven.com/logo.svg";

  beforeEach(async () => {
  });


  it("getLogo('http://localhost:3000') should return Greenstand logo", async () => {
    const logo = await getLogo("http://localhost:3000");
    // getLogo returns an undefined src if there is no provided wallet or map in the url query params
    expect(typeof logo).toBe("undefined");
  });

  it("getLogo('http://localhost:3000/?wallet=Zaven", async () => {
    entity.getByWallet.mockResolvedValue([{
      logo_url: logoCustomer,
    }]);
    const logo = await getLogo("http://localhost:3000/?wallet=Zaven");
    expect(entity.getByWallet).toHaveBeenCalled();
    expect(logo).toBe(logoCustomer);
  });

  it("getLogo('http://localhost:3000/@Zaven", async () => {
    entity.getByWallet.mockResolvedValue([{
      logo_url: logoCustomer,
    }]);
    const logo = await getLogo("http://localhost:3000/@Zaven");
    expect(entity.getByWallet).toHaveBeenCalled();
    expect(logo).toBe( logoCustomer);
  });

  it("getLogo('https://localhost:3000/@Zaven", async () => {
    entity.getByWallet.mockResolvedValue([{
      logo_url: logoCustomer,
    }]);
    const logo = await getLogo("https://localhost:3000/@Zaven");
    expect(entity.getByWallet).toHaveBeenCalled();
    expect(logo).toBe( logoCustomer);
  });

  it("getLogo('https://freetown.greenstand.org", async () => {
    entity.getByMapName.mockResolvedValue([{
      logo_url: logoCustomer,
    }]);
    const logo = await getLogo("https://freetown.greenstand.org");
    expect(entity.getByMapName).toHaveBeenCalled();
    expect(logo).toBe( logoCustomer);
  });

  it("getLogo('https://greenstand.org/?map_name=freetown", async () => {
    entity.getByMapName.mockResolvedValue([{
      logo_url: logoCustomer,
    }]);
    const logo = await getLogo("https://greenstand.org/?map_name=freetown");
    expect(entity.getByMapName).toHaveBeenCalledWith("freetown");
    expect(logo).toBe( logoCustomer);
  });

});
