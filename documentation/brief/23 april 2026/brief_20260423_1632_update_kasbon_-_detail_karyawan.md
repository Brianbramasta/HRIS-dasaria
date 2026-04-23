# Brief: update kasbon - detail karyawan
Tanggal: 23 april 2026 16:32

---
## endpoint
1. Riwayat penggajian
{{ngrok}}/api/employee-master-data/employees/salaries/:employee_id/index
``` json
{
    "meta": {
        "status": 200,
        "message": "Employee salaries retrieved successfully"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "019cdb79-5c32-7345-ac0b-d34111196168",
                "payroll_month": "2026-03-11",
                "type": "Staff",
                "net_salary": 950000
            },
            {
                "id": "019cd69d-c69e-71b9-a8c1-289bd747c48a",
                "payroll_month": "2026-03-10",
                "type": "Staff",
                "net_salary": 950000
            },
            {
                "id": "019cd653-c16f-721e-b9be-9b7340cf40e9",
                "payroll_month": "2026-03-10",
                "type": "Staff",
                "net_salary": 800000
            },
            {
                "id": "019cbd36-f353-71d8-9a0c-69369fa29b0a",
                "payroll_month": "2026-03-05",
                "type": "Thr",
                "net_salary": 0
            },
            {
                "id": "019cbd36-11e6-73a4-8733-6ec6e85b046c",
                "payroll_month": "2026-03-01",
                "type": "Staff",
                "net_salary": 6006000
            },
            {
                "id": "019cbd36-086b-72e4-98f9-a282a1403554",
                "payroll_month": "2026-03-01",
                "type": "Thr",
                "net_salary": 0
            }
        ],
        "per_page": 10,
        "to": 6,
        "total": 6
    }
}```

2. Riwayat Kasbon
{{ngrok}}/api/employee-master-data/employees/kasbon/::employe_id/index
``` json
{
    "meta": {
        "status": 200,
        "message": "Employee loans retrieved successfully"
    },
    "data": {
        "current_page": 1,
        "data": [
            {
                "loan_id": "019d75ac-f34b-727c-b9a6-158ef4bbb349",
                "deduction_start_period": null,
                "deduction_end_period": null,
                "nominal_loan": null,
                "loan_period": null
            },
            {
                "loan_id": "019d7609-1846-71e4-a0aa-2c04f1c15816",
                "deduction_start_period": null,
                "deduction_end_period": null,
                "nominal_loan": null,
                "loan_period": null
            },
            {
                "loan_id": "019d760a-7467-70da-86af-32d8ae2045ad",
                "deduction_start_period": null,
                "deduction_end_period": null,
                "nominal_loan": null,
                "loan_period": null
            },
            {
                "loan_id": "019d760b-0876-7391-aae3-61dae5100871",
                "deduction_start_period": null,
                "deduction_end_period": null,
                "nominal_loan": null,
                "loan_period": null
            },
            {
                "loan_id": "019d760d-42cb-70c1-85a9-770707604394",
                "deduction_start_period": null,
                "deduction_end_period": null,
                "nominal_loan": null,
                "loan_period": null
            },
            {
                "loan_id": "019d761b-22c5-7008-9d11-ac4201c6bfcb",
                "deduction_start_period": null,
                "deduction_end_period": null,
                "nominal_loan": null,
                "loan_period": null
            }
        ],
        "per_page": 10,
        "to": 6,
        "total": 6
    }
}```
