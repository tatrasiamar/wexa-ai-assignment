import { NextResponse } from 'next/server';
import { graphService } from '@/services/graphService';

export async function POST(request: Request) {
  try {
    const { source, target, relType } = await request.json();
    if (!source || !target || !relType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    await graphService.createRelationship(source, target, relType);
    return NextResponse.json({ message: 'Relationship created' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
