import { NextResponse } from 'next/server';
import { graphService } from '@/services/graphService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const spofs = await graphService.getSinglePointsOfFailure();
    return NextResponse.json({ spofs }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Database is currently unreachable.' }, { status: 503 });
  }
}
