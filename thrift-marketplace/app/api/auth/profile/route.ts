// app/api/auth/profile/route.ts
import { NextResponse } from 'next/server';
import { getUsers, saveUsers } from '@/services/DbService';
import { User } from '@/types/user';

// The fields the profile screen owns; everything else on the user record is left alone
const EDITABLE_FIELDS = [
  'fullName',
  'phone',
  'bio',
  'avatar',
  'coverPhoto',
  'address',
  'city',
  'state',
  'gender',
  'profession'
] as const;

type EditableField = (typeof EDITABLE_FIELDS)[number];

export interface ProfilePayload {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  avatar: '',
coverPhoto: '',
address: '',
city: '',
state: '',
dob: '',
age: '',
gender: '',
profession: '',
}

function toPayload(
  user: User & { dob?: string; age?: string; coverPhoto?: string }
): ProfilePayload {
  return {
    id: user.id,
    fullName: user.fullName || '',
    email: user.email || '',
    phone: user.phone || '',
    bio: user.bio || '',
    avatar: user.avatar || '',
    coverPhoto: user.coverPhoto || '',
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
    gender: user.gender || '',
    profession: user.profession || '',
    dob: user.dob || '',
    age: user.age || '',
  };
}

// Sessions created before users.json existed are keyed by email
function findUser(users: User[], userId: string) {
  return users.find((user) => user.id === userId || user.email === userId);
}

export async function GET(request: Request) {
  try {
    const userId = new URL(request.url).searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
    }

    const user = findUser(getUsers(), userId);

    return NextResponse.json(
      { success: true, data: user ? toPayload(user) : null },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error reading profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PUT: save the editable profile fields, creating the record for sessions that predate it
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, email } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
    }

    const users = getUsers();
    const existing = findUser(users, userId);
    const now = new Date().toISOString();

    const updates: Partial<Record<EditableField, string>> = {};
    for (const field of EDITABLE_FIELDS) {
      if (typeof body[field] === 'string') updates[field] = body[field];
    }

    let saved: User & { dob?: string; age?: string };

    if (existing) {
      Object.assign(existing, updates, { updatedAt: now });
      saved = existing;
    } else {
      saved = {
        id: userId,
        email: email || userId,
        username: (email || userId).split('@')[0],
        joinedDate: now,
        createdAt: now,
        updatedAt: now,
        fullName: '',
        phone: '',
        bio: '',
        avatar: '',
        address: '',
        city: '',
        state: '',
        dob: '',
        age: '',
        gender: '',  
        profession: '',
        ...updates,
      } as User & { dob?: string; age?: string };
      users.push(saved);
    }

    saveUsers(users);

    return NextResponse.json({ success: true, data: toPayload(saved) }, { status: 200 });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to save profile' }, { status: 500 });
  }
}