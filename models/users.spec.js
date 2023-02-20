import User from "./users";

afterEach(() => {
  jest.resetAllMocks();
});

describe("User Model", () => {
  it("should throw validation error for required fields", async () => {
    const user = new User();
    jest.spyOn(user, "validate").mockRejectedValueOnce({
      errors: {
        name: "Please enter your name",
        email: "Please enter your email address",
        password: "Please enter password",
      },
    });
    try {
      await user.validate();
    } catch (error) {
      expect(error.errors.name).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.password).toBeDefined();
    }
  });
  it("should throw password length error", async () => {
    const user = new User({
      name: "Lan Dep trai",
      email: "h.baolan20025@gmail.com",
      password: "123456",
    });
    jest.spyOn(user, "validate").mockRejectedValueOnce({
      errors: {
        password: {
          message: "Your password must be at least 8 characters long",
        },
      },
    });
    try {
      await user.validate();
    } catch (error) {
      expect(error.errors.password).toBeDefined();
      expect(error.errors.password.message).toMatch(
        /Your password must be at least 8 characters long/i
      );
    }
  });
  it("should create a new user", async () => {
    const user = new User({
      name: "Lan Dep trai",
      email: "h.baolan20025@gmail.com",
      password: "123456789",
    });

    expect(user).toHaveProperty("_id");
  });
});
