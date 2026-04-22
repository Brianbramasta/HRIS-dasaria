# Brief: pembaharuan kasbon 
Tanggal: 22 april 2026 10:15

---

# task
sesuaikan parameter dto dan id pada kolom sesuai dengan parameter di response untuk src\features\payroll\pages\cash-advance\tab\StatusCashAdvancePage.tsx : contoh loan_status_name jadi loan_status

# response
```json
{
    "meta": {
        "status": 200,
        "message": "Active and completed loans retrieved successfully"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "nip": "DSR005",
                "full_name": "Brian Aldy Bramasta",
                "position_name": null,
                "department_name": null,
                "deduction_start_period": "2026-04-01",
                "deduction_end_period": "2026-11-01",
                "remaining_balance": 0,
                "loan_status": "Masa Cicilan",
                "total_active_kasbon": 0,
                "total_periode_kasbon": 7,
                "has_active_loan": false
            },
            {
                "nip": "DSR018",
                "full_name": "Budi Santoso",
                "position_name": "UI\/UX Designer",
                "department_name": "Business Operation Department",
                "deduction_start_period": "2026-04-01",
                "deduction_end_period": "2026-11-01",
                "remaining_balance": 0,
                "loan_status": "Masa Cicilan",
                "total_active_kasbon": 1,
                "total_periode_kasbon": 7,
                "has_active_loan": true
            },
            {
                "nip": "DSR013",
                "full_name": "Merveliane",
                "position_name": "Business Analyst",
                "department_name": "Business Quality & Governance",
                "deduction_start_period": "2026-04-01",
                "deduction_end_period": "2026-10-01",
                "remaining_balance": 0,
                "loan_status": "Masa Cicilan",
                "total_active_kasbon": 0,
                "total_periode_kasbon": 6,
                "has_active_loan": false
            },
            {
                "nip": "DSR009",
                "full_name": "Mima",
                "position_name": "UI\/UX Designer",
                "department_name": "Core Systems Department",
                "deduction_start_period": "2026-04-01",
                "deduction_end_period": "2026-06-01",
                "remaining_balance": 0,
                "loan_status": "Masa Cicilan",
                "total_active_kasbon": 0,
                "total_periode_kasbon": 2,
                "has_active_loan": false
            },
            {
                "nip": "DSR019",
                "full_name": "Nice",
                "position_name": "Director of Business Development & Governance",
                "department_name": null,
                "deduction_start_period": "2026-04-01",
                "deduction_end_period": "2026-09-01",
                "remaining_balance": 0,
                "loan_status": "Masa Cicilan",
                "total_active_kasbon": 1,
                "total_periode_kasbon": 5,
                "has_active_loan": true
            },
            {
                "nip": "DSR031",
                "full_name": "Nur Huda",
                "position_name": "Business Intelligence",
                "department_name": "Business Quality & Governance",
                "deduction_start_period": "2026-05-01",
                "deduction_end_period": "2026-11-01",
                "remaining_balance": 0,
                "loan_status": "Masa Cicilan",
                "total_active_kasbon": 2,
                "total_periode_kasbon": 6,
                "has_active_loan": true
            },
            {
                "nip": "DSR007",
                "full_name": "biyanka",
                "position_name": "UI\/UX Designer",
                "department_name": "Core Systems Department",
                "deduction_start_period": "2026-05-01",
                "deduction_end_period": "2027-03-01",
                "remaining_balance": 0,
                "loan_status": "Masa Cicilan",
                "total_active_kasbon": 1,
                "total_periode_kasbon": 10,
                "has_active_loan": true
            },
            {
                "nip": "DSR008",
                "full_name": "yuanita",
                "position_name": "UI\/UX Designer",
                "department_name": "Core Systems Department",
                "deduction_start_period": "2026-04-01",
                "deduction_end_period": "2026-04-01",
                "remaining_balance": 0,
                "loan_status": "Masa Cicilan",
                "total_active_kasbon": 1,
                "total_periode_kasbon": 0,
                "has_active_loan": true
            }
        ],
        "per_page": 10,
        "to": 8,
        "total": 8
    }
}```