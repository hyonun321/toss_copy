import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { token } = await request.json();
    console.log(token);
    const dataUrl =
      'https://openapi.koreainvestment.com:9443/uapi/overseas-stock/v1/ranking/trade-vol';

    const response = await fetch(dataUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: `Bearer ${token}`, // 필요 시 "Bearer " 접두어를 추가해야 하는지 확인
        appkey: 'PSdoa3Su2HX5QF9E1qajU0L4NCfZHAqVjP1o',
        appsecret:
          '+nSae+89WLLzZ8CGgLfEdKKkRx1tfMx1logGGTY+L/rLbvIm0qSGauVZWJm8X2qIjdTkbqL58qQwBEcu2JMA4zQyc2d0C0kKpqx0jHVcWUWMRlKSeFyxYk9ywlq5TI4xDLT6UsF88U/Dr69WIRzK/HHu308xd0zMf6ZaaJiuejF07dqO9CI=',
        tr_id: 'HHDFS76310010',
        custtype: 'P',
        // 필요하다면 tr_cont: "" (초기 조회)
      },
    });
    const data = await response.json();
    console.log(data);
    return NextResponse.json(data, { status: response.ok ? 200 : 400 });
  } catch (error) {
    console.error('getStockData 오류:', error);
    return NextResponse.json({ error: '서버 에러' }, { status: 500 });
  }
}
