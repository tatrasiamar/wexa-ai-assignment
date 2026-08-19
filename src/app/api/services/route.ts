import { NextResponse } from 'next/server';
import { graphService } from '@/services/graphService';

export async function GET() {
  try {
    const nodes = await graphService.getAllNodes();
    return NextResponse.json({ nodes }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, type } = await request.json();
    if (!name || !type) return NextResponse.json({ error: 'Name and Type are required' }, { status: 400 });
    await graphService.createNode(name, type);
    return NextResponse.json({ message: 'Created successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    await graphService.deleteNode(name);
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
