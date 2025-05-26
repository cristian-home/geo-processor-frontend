import { NextRequest, NextResponse } from "next/server";
import { GeoPointsRequest, ProcessedPoints } from "@/types";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = (await req.json()) as GeoPointsRequest;

    // Validate the input
    if (
      !body.points ||
      !Array.isArray(body.points) ||
      body.points.length === 0
    ) {
      return NextResponse.json(
        { message: "Invalid request: points field must be a non-empty array" },
        { status: 400 }
      );
    }

    // Validate each point has valid lat/lng values
    for (const point of body.points) {
      if (
        typeof point.lat !== "number" ||
        typeof point.lng !== "number" ||
        isNaN(point.lat) ||
        isNaN(point.lng) ||
        point.lat < -90 ||
        point.lat > 90 ||
        point.lng < -180 ||
        point.lng > 180
      ) {
        return NextResponse.json(
          {
            message: `Invalid coordinates: lat=${point.lat}, lng=${point.lng}`,
          },
          { status: 400 }
        );
      }
    }

    // Forward the request to the Python service
    const response = await fetch("http://localhost:8000/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Frontend-URL":
          req.headers.get("X-Frontend-URL") ||
          process.env.FRONTEND_URL ||
          "http://localhost:3001",
      },
      body: JSON.stringify(body),
    });

    // Check if the Python service responded with an error
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Error from geo-processor service" },
        { status: response.status }
      );
    }

    // Return the processed data from the Python service
    const data = (await response.json()) as ProcessedPoints;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
