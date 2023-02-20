import Job from "../models/jobs";
import { getJob, getJobs, newJob, updateJob } from "./jobsController";

const mockJob = {
  _id: "63f2d65a44d0dd206c12a98d",
  title: "Hello world",
  description: "Hello world",
  email: "abcdef@gmail.com",
  address: "123 Abc",
  company: "company name",
  industry: [],
  positions: 1,
  salary: 123456,
  postingDate: "2023-02-20T02:09:30.951Z",
  user: "63f2d5b23a69fbeab28d389f",
};

const mockReq = () => {
  return {
    body: {},
    query: {},
    params: {},
    user: {},
  };
};

const mockRes = () => {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
};

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe("Jobs Controller", () => {
  describe("Get All Jobs", () => {
    it("should get all jobs", async () => {
      jest.spyOn(Job, "find").mockImplementationOnce(() => ({
        limit: () => ({
          skip: jest.fn().mockResolvedValue([mockJob]),
        }),
      }));

      const mockRequest = mockReq();
      const mockResponse = mockRes();

      await getJobs(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        jobs: [mockJob],
      });
    });
  });
  describe("Create new job", () => {
    it("should create a new job", async () => {
      jest.spyOn(Job, "create").mockResolvedValueOnce(mockJob);

      const mockRequest = (mockReq().body = {
        body: {
          title: "Hello world",
          description: "Hello world",
          email: "abcdef@gmail.com",
          address: "123 Abc",
          company: "company name",
          industry: [],
          positions: 1,
          salary: 123456,
        },
        user: {
          id: "63f2d5b23a69fbeab28d389f",
        },
      });
      const mockResponse = mockRes();

      await newJob(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        job: mockJob,
      });
    });
    it("should throw validation error", async () => {
      jest
        .spyOn(Job, "create")
        .mockRejectedValueOnce({ name: "ValidationError" });

      const mockRequest = (mockReq().body = {
        body: {},
        user: {},
      });
      const mockResponse = mockRes();

      await newJob(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Please enter all values",
      });
    });
  });

  describe("Get Single Job", () => {
    it("should throw job not found error", async () => {
      jest.spyOn(Job, "findById").mockResolvedValueOnce(null);

      const mockRequest = (mockReq().params = {
        params: { id: "63f2d65a44d0dd206c12a98d" },
      });
      const mockResponse = mockRes();

      await getJob(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Job not found",
      });
    });

    it("should get job by id", async () => {
      jest.spyOn(Job, "findById").mockResolvedValueOnce(mockJob);

      const mockRequest = (mockReq().params = {
        params: { id: "63f2d65a44d0dd206c12a98d" },
      });
      const mockResponse = mockRes();

      await getJob(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        job: mockJob,
      });
    });

    it("should throw invalid Id error", async () => {
      jest.spyOn(Job, "findById").mockRejectedValueOnce({ name: "CastError" });

      const mockRequest = (mockReq().params = {
        params: { id: "randomKey" },
      });
      const mockResponse = mockRes();

      await getJob(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Please enter correct id",
      });
    });
  });

  describe("Update a job", () => {
    it("should throw job not found error", async () => {
      jest.spyOn(Job, "findById").mockResolvedValueOnce(null);

      const mockRequest = (mockReq().params = {
        params: { id: "63f2d65a44d0dd206c12a98d" },
      });
      const mockResponse = mockRes();

      await getJob(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Job not found",
      });
    });
    it("should throw unauthorized to update this job", async () => {
      jest.spyOn(Job, "findById").mockResolvedValueOnce(mockJob);

      const mockRequest = {
        ...mockReq(),
        params: { id: "63f2d65a44d0dd206c12a98d" },
        user: {
          id: "63f2d5b23a69fbeab28d383f",
        },
      };
      const mockResponse = mockRes();

      await updateJob(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "You are not allowed to update this job",
      });
    });
    it("should update the job by id", async () => {
      const title = "Yo, sup bro";
      const updatedJob = { ...mockJob, title };

      jest.spyOn(Job, "findById").mockResolvedValueOnce(mockJob);
      jest.spyOn(Job, "findByIdAndUpdate").mockResolvedValueOnce(updatedJob);

      const mockRequest = {
        ...mockReq(),
        params: { id: "63f2d65a44d0dd206c12a98d" },
        user: {
          id: "63f2d5b23a69fbeab28d389f",
        },
        body: {
          title,
        },
      };
      const mockResponse = mockRes();

      await updateJob(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        job: updatedJob,
      });
    });
  });

  describe("Delete a job", () => {
    it("should throw job not found error", async () => {
      jest.spyOn(Job, "findById").mockResolvedValueOnce(null);

      const mockRequest = (mockReq().params = {
        params: { id: "63f2d65a44d0dd206c12a98d" },
      });
      const mockResponse = mockRes();

      await getJob(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Job not found",
      });
    });

    it("should delete a job by id", async () => {
      jest.spyOn(Job, "findById").mockResolvedValueOnce(mockJob);
      jest.spyOn(Job, "findByIdAndDelete").mockResolvedValueOnce(mockJob);

      const mockRequest = (mockReq().params = {
        params: { id: "63f2d65a44d0dd206c12a98d" },
      });
      const mockResponse = mockRes();

      await getJob(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        job: mockJob,
      });
    });
  });
});
