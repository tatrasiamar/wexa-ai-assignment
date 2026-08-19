import { NextResponse } from 'next/server';
import { graphService } from '@/services/graphService';

export async function GET() {
  try {
    const dependencies = await graphService.getBlastRadius();
    return NextResponse.json({ dependencies }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Database is currently unreachable.' }, { status: 503 });
  }
}
