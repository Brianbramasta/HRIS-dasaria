# Kontrak API – Dashboard (SaaS)

Base URL: `/api/dashboard`

Catatan umum:
- Satu halaman satu API untuk halaman Dashboard utama (`src/pages/Dashboard/Saas.tsx`).
- Response berisi data ringkas yang benar-benar dipakai komponen: metrics, chart series, recent invoices, product performance, activities.
- Fitur dashboard saat ini berbasis UI/komponen, tidak memiliki tabel khusus di DB.

## Dashboard SaaS

Endpoint: `GET /api/dashboard/saas`
- Query params: none
- Response body:
```json
{
  "metrics": {
    "totalRevenue": 20045.87,
    "totalRevenueChangePct": 2.5,
    "activeUsers": 9528,
    "activeUsersChangePct": 9.5,
    "clv": 849.54,
    "clvChangePct": -1.6,
    "cac": 9528,
    "cacChangePct": 3.5
  },
  "charts": {
    "churnRate": {
      "series": [4.5, 4.2, 4.6, 4.3, 4.1, 4.2, 4.26],
      "unit": "%"
    },
    "growth": {
      "series": [12500, 14000, 15500, 14800, 16200, 17500, 18200],
      "unit": "currency"
    },
    "funnel": {
      "categories": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      "series": [
        { "name": "Ad Impressions", "data": [44, 55, 41, 67, 22, 43, 55, 41] },
        { "name": "Website Session", "data": [13, 23, 20, 8, 13, 27, 13, 23] },
        { "name": "App Download", "data": [11, 17, 15, 15, 21, 14, 18, 20] },
        { "name": "New Users", "data": [21, 7, 25, 13, 22, 8, 18, 20] }
      ]
    }
  },
  "recentInvoices": [
    { "id": "#DF429", "date": "April 28, 2016", "user": "Jenny Wilson", "amount": 473.85, "status": "Complete" },
    { "id": "#HTY274", "date": "October 30, 2017", "user": "Wade Warren", "amount": 293.01, "status": "Complete" },
    { "id": "#LKE600", "date": "May 29, 2017", "user": "Darlene Robertson", "amount": 782.01, "status": "Pending" },
    { "id": "#HRP447", "date": "May 20, 2015", "user": "Arlene McCoy", "amount": 202.87, "status": "Cancelled" },
    { "id": "#WRH647", "date": "March 13, 2014", "user": "Bessie Cooper", "amount": 490.51, "status": "Complete" }
  ],
  "productPerformance": {
    "dailySales": {
      "digital": 790,
      "physical": 572,
      "averageDaily": 2950,
      "averageDailyChangePct": -0.52,
      "series": []
    },
    "onlineSales": {
      "digital": 8490,
      "physical": 950,
      "totalOnline": 59410,
      "totalOnlineChangePct": 1.85,
      "series": []
    },
    "newUsers": {
      "total": 3768,
      "changePct": 3.85,
      "series": []
    }
  },
  "activities": [
    { "user": "Francisco Grbbs", "action": "created invoice", "invoiceId": "PQ-4491C", "timeAgo": "Just Now", "avatarUrl": "/images/user/user-01.jpg" },
    { "user": "Courtney Henry", "action": "created invoice", "invoiceId": "HK-234G", "timeAgo": "15 minutes ago", "avatarUrl": "/images/user/user-03.jpg" },
    { "user": "Bessie Cooper", "action": "created invoice", "invoiceId": "LH-2891C", "timeAgo": "5 months ago", "avatarUrl": "/images/user/user-04.jpg" },
    { "user": "Theresa Web", "action": "created invoice", "invoiceId": "CK-125NH", "timeAgo": "2 weeks ago", "avatarUrl": "/images/user/user-05.jpg" }
  ]
}
```

- Keterangan:
  - `series` dikembalikan dalam bentuk array sederhana sesuai komponen chart Apex.
  - Nilai angka dapat disesuaikan dari agregasi tabel yang tersedia (mis. dari `staff`, `pengunduran_diri`, dsb.) meskipun dashboard tidak memiliki tabel khusus.

## Catatan CRUD
- Dashboard hanya konsumsi data agregat; tidak ada operasi `POST`, `PATCH`, `DELETE` yang relevan pada halaman ini.