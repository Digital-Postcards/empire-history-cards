// Fake Express Response for controller unit tests. Records what the handler
// sent so tests can read res.body, res.statusCode and res.cookies, the same
// surface supertest gives the route tests.
import { Response } from "express";

export interface MockResponse extends Response {
  body: any;
  cookies: Record<string, { value: string; options: any }>;
  headers: Record<string, any>;
}

export function mockRes(): MockResponse {
  // Starts at 200 because that's what Express sends when a handler calls
  // res.json() without setting a status first.
  const res = { statusCode: 200, cookies: {}, headers: {} } as MockResponse;

  res.status = jest.fn((code) => {
    res.statusCode = code;
    return res;
  }) as any;

  res.json = jest.fn((data) => {
    res.body = data;
    return res;
  }) as any;

  res.send = jest.fn((data) => {
    res.body = data;
    return res;
  }) as any;

  res.cookie = jest.fn((name: string, value: string, options: any) => {
    res.cookies[name] = { value, options };
    return res;
  }) as any;

  res.clearCookie = jest.fn((name: string) => {
    delete res.cookies[name];
    return res;
  }) as any;

  res.setHeader = jest.fn((name: string, value: any) => {
    res.headers[name] = value;
    return res;
  }) as any;

  return res;
}
