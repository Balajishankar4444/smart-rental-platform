// app/api/auth/favorites/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Favorites are stored per user as a list of listing ids
const dataFilePath = path.join(process.cwd(), 'data', 'favorites.json');

type FavoritesByUser = Record<string, string[]>;

function readFavorites(): FavoritesByUser {
  const dir = path.dirname(dataFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({}, null, 2), 'utf8');
  }

  const parsed = JSON.parse(fs.readFileSync(dataFilePath, 'utf8') || '{}');
  return parsed && typeof parsed === 'object' ? (parsed as FavoritesByUser) : {};
}

function writeFavorites(favorites: FavoritesByUser) {
  fs.writeFileSync(dataFilePath, JSON.stringify(favorites, null, 2), 'utf8');
}

// GET: the listing ids a user has hearted
export async function GET(request: Request) {
  try {
    const userId = new URL(request.url).searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
    }

    return NextResponse.json(
      { success: true, data: readFavorites()[userId] || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error reading favorites:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// POST: toggle a listing in the user's favorites
export async function POST(request: Request) {
  try {
    const { userId, productId } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, error: 'userId and productId are required' },
        { status: 400 }
      );
    }

    const favorites = readFavorites();
    const current = favorites[userId] || [];
    const favorited = !current.includes(productId);

    favorites[userId] = favorited
      ? [...current, productId]
      : current.filter((id) => id !== productId);

    writeFavorites(favorites);

    return NextResponse.json(
      { success: true, favorited, data: favorites[userId] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating favorites:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update favorites' },
      { status: 500 }
    );
  }
}
