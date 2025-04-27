import { Request, Response, NextFunction } from "express";
import { readLogs, clearLogs, generateCurlCommand } from "../middleware/logger";
import { Parser } from 'json2csv';

export class LogController {
  constructor() {
    this.getAllLogs = this.getAllLogs.bind(this);
    this.exportLogs = this.exportLogs.bind(this);
    this.clearAllLogs = this.clearAllLogs.bind(this);
    this.getCurlCommand = this.getCurlCommand.bind(this);
  }

  /**
   * Get all logs for the admin dashboard
   */
  getAllLogs(req: Request, res: Response, next: NextFunction): void {
    try {
      const logs = readLogs();
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  /**
   * Export logs as CSV
   */
  exportLogs(req: Request, res: Response, next: NextFunction): void {
    try {
      const logs = readLogs();
      
      if (logs.length === 0) {
        res.status(404).json({ message: "No logs available to export" });
        return;
      }

      // Use json2csv to convert JSON to CSV
      const fields = ['id', 'timestamp', 'userId', 'username', 'action', 'information', 'method', 'path', 'statusCode', 'ipAddress', 'userAgent'];
      const parser = new Parser({ fields });
      const csv = parser.parse(logs);
      
      // Set headers for file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=logs-${new Date().toISOString().slice(0, 10)}.csv`);
      
      res.status(200).send(csv);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  /**
   * Get curl command for a specific log entry
   */
  getCurlCommand(req: Request, res: Response, next: NextFunction): void {
    try {
      const logId = req.params.id;
      const logs = readLogs();
      const logEntry = logs.find(log => log.id === logId);
      
      if (!logEntry) {
        res.status(404).json({ message: "Log entry not found" });
        return;
      }
      
      // Generate curl command
      const curlCommand = generateCurlCommand(logEntry);
      
      res.status(200).json({ curlCommand });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  /**
   * Clear all logs
   */
  clearAllLogs(req: Request, res: Response, next: NextFunction): void {
    try {
      clearLogs();
      res.status(200).json({ message: "All logs have been cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}