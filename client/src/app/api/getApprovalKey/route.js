import { NextResponse } from 'next/server';

export async function POST() {
  const tokenUrl = 'https://openapi.koreainvestment.com:9443/oauth2/Approval';
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      appkey: 'PSdoa3Su2HX5QF9E1qajU0L4NCfZHAqVjP1o',
      secretkey:
        '+nSae+89WLLzZ8CGgLfEdKKkRx1tfMx1logGGTY+L/rLbvIm0qSGauVZWJm8X2qIjdTkbqL58qQwBEcu2JMA4zQyc2d0C0kKpqx0jHVcWUWMRlKSeFyxYk9ywlq5TI4xDLT6UsF88U/Dr69WIRzK/HHu308xd0zMf6ZaaJiuejF07dqO9CI=',
    }),
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.ok ? 200 : 400 });
}
