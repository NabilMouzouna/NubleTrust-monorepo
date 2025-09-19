import { NextRequest, NextResponse } from 'next/server';
import { registerApp } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { name, description, developerId } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!developerId) {
      return NextResponse.json({ error: "Developer ID is required" }, { status: 400 });
    }

    const app = await registerApp(name, description, developerId);
    if (!app) {
      return NextResponse.json({ error: "Failed to create app" }, { status: 500 });
    }

    return NextResponse.json(app);
  } catch (error) {
    console.error("Error creating app:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}