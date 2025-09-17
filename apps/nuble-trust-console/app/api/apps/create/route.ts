import { NextRequest, NextResponse } from 'next/server';
import { registerApp } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const {name,description} = await request.json();
    const app = await registerApp(name,description);
    return NextResponse.json(app);
  } catch (error: unknown) {
    console.error('Error creating app:', error);
    if (
      error instanceof Error &&
      error.message.includes('duplicate key') &&
      error.message.includes('applications_name_key')
    ) {
      return NextResponse.json({ error: 'Application with the same name already exists' }, { status: 400 });
    }

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
