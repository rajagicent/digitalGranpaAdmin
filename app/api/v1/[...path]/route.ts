import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return handleProxy(request, path);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return handleProxy(request, path);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return handleProxy(request, path);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return handleProxy(request, path);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return handleProxy(request, path);
}

async function handleProxy(request: NextRequest, path: string[]) {
  const backendBase = (
    process.env.BACKEND_URL ||
    process.env.BASE_URL ||
    (process.env.NEXT_PUBLIC_API_URL?.startsWith('http')
      ? process.env.NEXT_PUBLIC_API_URL
      : '') ||
    ''
  )
    .trim()
    .replace(/\/+$/, '');

  if (!backendBase) {
    return NextResponse.json(
      { error: 'BACKEND_URL or BASE_URL is not configured in .env' },
      { status: 500 }
    );
  }

  const pathStr = path.join('/');
  const search = request.nextUrl.search;
  const targetUrl = `${backendBase}/${pathStr}${search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    // Strip headers that cause CORS or host mismatch on remote backend
    const lower = key.toLowerCase();
    if (!['host', 'origin', 'referer', 'connection', 'content-length'].includes(lower)) {
      headers.set(key, value);
    }
  });

  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    headers.set('authorization', authHeader);
  }

  const method = request.method;
  const body = ['GET', 'HEAD'].includes(method)
    ? undefined
    : await request.arrayBuffer();

  try {
    const res = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: 'no-store',
    });

    const data = await res.arrayBuffer();
    const responseHeaders = new Headers();
    res.headers.forEach((val, key) => {
      const lower = key.toLowerCase();
      if (!['content-encoding', 'transfer-encoding'].includes(lower)) {
        responseHeaders.set(key, val);
      }
    });

    return new NextResponse(data, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to proxy request to backend' },
      { status: 502 }
    );
  }
}

