import { NextResponse } from 'next/server';
import { supabase } from '../supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('meals')
      .select('*');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch meals' },
      { status: 500 }
    );
  }
} 