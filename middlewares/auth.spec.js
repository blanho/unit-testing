import jwt from "jsonwebtoken";
import User from "../models/users";
import { isAuthenticatedUser } from "./auth";

const mockReq = () => {
  return {
    headers: {
      authorization: "Bearer",
    },
  };
};

const mockRes = () => {
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

const mockNext = jest.fn();

describe("Authentication Middleware", () => {
  it("should throw missing authorization header error", async () => {
    const mockRequest = (mockReq().headers = { headers: {} });
    const mockResponse = mockRes();

    await isAuthenticatedUser(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Missing Authorization header with Bearer token",
    });
  });

  it("should throw missing authorization header error", async () => {
    jest.spyOn(jwt, "verify").mockResolvedValueOnce({ id: mockUser._id });
    jest.spyOn(User, "findById").mockResolvedValue(mockUser);

    const mockRequest = (mockReq().headers = {
      headers: {
        authorization: "Bearer token",
      },
    });
    const mockResponse = mockRes();

    await isAuthenticatedUser(mockRequest, mockResponse, mockNext);

    expect(mockNext).toBeCalledTimes(1);
  });
});
