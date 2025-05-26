import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("Health check request received");
  console.log("Request URL:", request.url);
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "geo-processor-frontend",
  });
}
