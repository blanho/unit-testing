import { registerUser } from "./authController";
import bcrypt from "bcryptjs";
import User from "../models/users";

jest.mock("../utils/helpers", () => ({
  getJwtToken: jest.fn(() => "jwt_token"),
}));

const mockRequest = () => {
  return {
    body: {
      name: "Test User",
      email: "test@gmail.com",
      password: "12345678",
    },
  };
};

const mockResponse = () => {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
};

const mockUser = {
  _id: "63f188744338c0aa1e1e77de",
  name: "Test User",
  email: "test@gmail.com",
  password: "hashedPassword",
};

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe("Register User", () => {
  it("should register user", async () => {
    jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("hashedPassword");
    jest.spyOn(User, "create").mockResolvedValueOnce(mockUser);

    const mockReq = mockRequest();
    const mockRes = mockResponse();

    await registerUser(mockReq, mockRes);

    expect(bcrypt.hash).toHaveBeenCalledWith("12345678", 10);
    expect(User.create).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@gmail.com",
      password: "hashedPassword",
    });
    expect(mockRes.status).toHaveBeenCalledWith(201);
  });

  it("should throw validation error", async () => {
    const mockReq = (mockRequest().body = { body: {} });
    const mockRes = mockResponse();

    await registerUser(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Please enter all values",
    });
  });

  it("should throw duplicate email entered error", async () => {
    jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("hashedPassword");
    jest.spyOn(User, "create").mockRejectedValueOnce({ code: 11000 });

    const mockReq = mockRequest();
    const mockRes = mockResponse();

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Duplicate email",
    });
  });
});
