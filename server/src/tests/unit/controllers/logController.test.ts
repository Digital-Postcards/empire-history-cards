// unit tests for LogController
//
// No spies. The logger middleware is module-mocked and backed by a small
// in-memory list of log entries, so every assertion is toEqual on
// res.statusCode / res.body / res.headers, or on what is left in that list.
// json2csv is left REAL, so the export test checks actual CSV output rather
// than that a parser was constructed.
//
// getAllLogs
//  1. returns the logs with 200
//  2. returns an empty array when there are no logs
//  3. returns 500 when reading the logs throws
// exportLogs
//  4. returns 404 when there are no logs to export
//  5. returns 200 with a CSV header row and one row per log
//  6. sets the text/csv content type
//  7. names the download file with today's date
//  8. returns 500 when reading the logs throws
// getCurlCommand
//  9. returns the curl command for a known log id
// 10. returns 404 for a log id that doesn't exist
// 11. returns 500 when reading the logs throws
// clearAllLogs
// 12. empties the log store and returns 200
// 13. returns 500 when clearing throws

import { Request } from "express";
import { LogController } from "../../../controllers/logController";
import {
  readLogs,
  clearLogs,
  generateCurlCommand,
} from "../../../middleware/logger";
import { mockRes } from "../../helpers/mockRes";

jest.mock("../../../middleware/logger");

let logsDb: any[];

function freshLogs() {
  return [
    {
      id: "log1",
      timestamp: "2026-01-01T10:00:00.000Z",
      userId: "user1",
      username: "alice@example.com",
      action: "LOGIN",
      information: "Alice logged in",
      method: "POST",
      path: "/api/authentication/authenticateCredentials",
      statusCode: 200,
      ipAddress: "127.0.0.1",
      userAgent: "jest",
    },
    {
      id: "log2",
      timestamp: "2026-01-01T11:00:00.000Z",
      userId: null,
      username: null,
      action: "VIEW",
      information: "Someone listed the cards",
      method: "GET",
      path: "/api/cards",
      statusCode: 200,
      ipAddress: "127.0.0.1",
      userAgent: "jest",
    },
  ];
}

function installLoggerFake() {
  logsDb = freshLogs();

  (readLogs as jest.Mock).mockImplementation(() => logsDb);

  (clearLogs as jest.Mock).mockImplementation(() => {
    logsDb = [];
  });

  (generateCurlCommand as jest.Mock).mockImplementation(
    (entry: any) =>
      `curl -X ${entry.method} http://localhost:3002${entry.path}`,
  );
}

describe("LogController", () => {
  let controller: LogController;

  beforeEach(() => {
    jest.clearAllMocks();
    installLoggerFake();
    controller = new LogController();
  });

  describe("getAllLogs", () => {
    it("returns the logs with 200", async () => {
      const res = mockRes();

      controller.getAllLogs({} as Request, res, jest.fn());

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(logsDb);
    });

    it("returns an empty array when there are no logs", async () => {
      logsDb = [];
      const res = mockRes();

      controller.getAllLogs({} as Request, res, jest.fn());

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("returns 500 when reading the logs throws", async () => {
      (readLogs as jest.Mock).mockImplementation(() => {
        throw new Error("log file unreadable");
      });
      const res = mockRes();

      controller.getAllLogs({} as Request, res, jest.fn());

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "log file unreadable" });
    });
  });

  describe("exportLogs", () => {
    it("returns 404 when there are no logs to export", () => {
      logsDb = [];
      const res = mockRes();

      controller.exportLogs({} as Request, res, jest.fn());

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "No logs available to export" });
      expect(res.headers).toEqual({});
    });

    it("returns CSV with a header row and one row per log", () => {
      const res = mockRes();

      controller.exportLogs({} as Request, res, jest.fn());

      expect(res.statusCode).toBe(200);

      const lines = (res.body as string).split("\n");
      expect(lines).toHaveLength(3); // header + 2 logs
      expect(lines[0]).toEqual(
        '"id","timestamp","userId","username","action","information","method","path","statusCode","ipAddress","userAgent"',
      );
      expect(lines[1]).toContain("log1");
      expect(lines[1]).toContain("alice@example.com");
      expect(lines[2]).toContain("log2");
    });

    it("sets the csv content type", () => {
      const res = mockRes();

      controller.exportLogs({} as Request, res, jest.fn());

      expect(res.headers["Content-Type"]).toEqual("text/csv");
    });

    it("names the download file with today's date", () => {
      const today = new Date().toISOString().slice(0, 10);
      const res = mockRes();

      controller.exportLogs({} as Request, res, jest.fn());

      expect(res.headers["Content-Disposition"]).toEqual(
        `attachment; filename=logs-${today}.csv`,
      );
    });

    it("returns 500 when reading the logs throws", () => {
      (readLogs as jest.Mock).mockImplementation(() => {
        throw new Error("log file unreadable");
      });
      const res = mockRes();

      controller.exportLogs({} as Request, res, jest.fn());

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "log file unreadable" });
    });
  });

  describe("getCurlCommand", () => {
    it("returns the curl command for a known log id", () => {
      const req = { params: { id: "log2" } } as unknown as Request;
      const res = mockRes();

      controller.getCurlCommand(req, res, jest.fn());

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        curlCommand: "curl -X GET http://localhost:3002/api/cards",
      });
    });

    it("returns 404 for a log id that doesn't exist", () => {
      const req = { params: { id: "nope" } } as unknown as Request;
      const res = mockRes();

      controller.getCurlCommand(req, res, jest.fn());

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "Log entry not found" });
    });

    it("returns 500 when reading the logs throws", () => {
      (readLogs as jest.Mock).mockImplementation(() => {
        throw new Error("log file unreadable");
      });
      const req = { params: { id: "log1" } } as unknown as Request;
      const res = mockRes();

      controller.getCurlCommand(req, res, jest.fn());

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "log file unreadable" });
    });
  });

  describe("clearAllLogs", () => {
    it("empties the log store and returns 200", () => {
      const res = mockRes();

      controller.clearAllLogs({} as Request, res, jest.fn());

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        message: "All logs have been cleared successfully",
      });
      expect(logsDb).toEqual([]);
    });

    it("returns 500 when clearing throws", () => {
      (clearLogs as jest.Mock).mockImplementation(() => {
        throw new Error("log file locked");
      });
      const res = mockRes();

      controller.clearAllLogs({} as Request, res, jest.fn());

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "log file locked" });
      expect(logsDb).toHaveLength(2); // nothing was cleared
    });
  });
});
