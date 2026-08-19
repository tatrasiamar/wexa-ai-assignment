import { NextResponse } from 'next/server';
import { graphService } from '@/services/graphService';

export async function POST() {
  try {
    await graphService.seedDatabase();
    return NextResponse.json({ message: 'Graph Database seeded successfully!' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
