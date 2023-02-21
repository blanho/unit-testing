import jwt from "jsonwebtoken";
import { getJwtToken, sendEmail } from "./helpers";

jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValueOnce({
    sendMail: jest.fn().mockResolvedValueOnce({
      accepted: ["test@gmail.com"],
    }),
  }),
}));

describe("Utils/Helpers", () => {
  describe("Send mail", () => {
    it("should send email to user", async () => {
      const response = await sendEmail({
        email: "test@gmail.com",
        subject: "Verify  your email",
        message: "Ok    ",
      });

      expect(response).toBeDefined();
      expect(response.accepted).toContain("test@gmail.com");
    });
  });
  describe("JWT Token", () => {
    it("should give JWT token", async () => {
      jest.spyOn(jwt, "sign").mockResolvedValueOnce("token");

      const token = await getJwtToken("63f188744338c0aa1e1e77de");

      expect(token).toBeDefined();
      expect(token).toBe("token");
    });
  });
});
